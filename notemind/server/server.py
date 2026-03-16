#!/usr/bin/env python3
"""
NoteMind — Local AI Server
Whisper large-v3 transcription + pyannote speaker diarization
Runs on ws://localhost:8765

Requirements: pip install openai-whisper pyannote.audio websockets torch torchaudio ffmpeg-python
"""

import asyncio
import json
import os
import io
import wave
import struct
import tempfile
import logging
from pathlib import Path
from datetime import datetime

import websockets
import torch
import whisper
import torchaudio

# ─── Configuration ─────────────────────────────────────────────────────────────
HOST = "localhost"
PORT = 8765
WHISPER_MODEL_SIZE = "large-v3"   # Options: tiny, base, small, medium, large-v3
HF_TOKEN = os.environ.get("HF_TOKEN", "")  # Set via: export HF_TOKEN=hf_xxxxx
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
LOG_LEVEL = logging.INFO

# ─── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
log = logging.getLogger("notemind")

# ─── Load Models ───────────────────────────────────────────────────────────────
log.info(f"Loading Whisper {WHISPER_MODEL_SIZE} on {DEVICE}...")
whisper_model = whisper.load_model(WHISPER_MODEL_SIZE, device=DEVICE)
log.info("Whisper loaded ✓")

diarization_pipeline = None
try:
    from pyannote.audio import Pipeline
    if HF_TOKEN:
        log.info("Loading pyannote speaker diarization...")
        diarization_pipeline = Pipeline.from_pretrained(
            "pyannote/speaker-diarization-3.1",
            use_auth_token=HF_TOKEN
        )
        diarization_pipeline.to(torch.device(DEVICE))
        log.info("pyannote loaded ✓ — speaker diarization active")
    else:
        log.warning("HF_TOKEN not set — speaker diarization disabled. Set export HF_TOKEN=your_token")
except ImportError:
    log.warning("pyannote not installed — speaker diarization disabled. pip install pyannote.audio")


# ─── Speaker label mapping ──────────────────────────────────────────────────────
SPEAKER_LETTERS = list("ABCDEFGHIJKLMNOP")

class SessionState:
    def __init__(self, session_id):
        self.session_id = session_id
        self.speaker_map = {}       # "SPEAKER_00" → "Speaker A"
        self.speaker_count = 0
        self.audio_chunks = []
        self.full_transcript = []
        self.created_at = datetime.now()

    def get_speaker_label(self, speaker_id):
        if speaker_id not in self.speaker_map:
            letter = SPEAKER_LETTERS[self.speaker_count % len(SPEAKER_LETTERS)]
            self.speaker_map[speaker_id] = f"Speaker {letter}"
            self.speaker_count += 1
        return self.speaker_map[speaker_id]


# ─── Active sessions ────────────────────────────────────────────────────────────
sessions = {}


# ─── Audio processing ──────────────────────────────────────────────────────────
def webm_to_wav(webm_bytes: bytes) -> str:
    """Convert webm audio bytes to a temp WAV file and return path."""
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as f:
        f.write(webm_bytes)
        webm_path = f.name

    wav_path = webm_path.replace(".webm", ".wav")

    # Use torchaudio to convert
    waveform, sample_rate = torchaudio.load(webm_path)
    # Resample to 16kHz (Whisper requirement)
    if sample_rate != 16000:
        resampler = torchaudio.transforms.Resample(sample_rate, 16000)
        waveform = resampler(waveform)
    # Convert to mono
    if waveform.shape[0] > 1:
        waveform = waveform.mean(dim=0, keepdim=True)

    torchaudio.save(wav_path, waveform, 16000)
    os.unlink(webm_path)
    return wav_path


def transcribe_chunk(wav_path: str, language: str = "en") -> dict:
    """Run Whisper transcription on a WAV file."""
    result = whisper_model.transcribe(
        wav_path,
        language=language,
        word_timestamps=True,
        fp16=(DEVICE == "cuda"),
        condition_on_previous_text=True,
        temperature=0.0,            # Deterministic for accuracy
        no_speech_threshold=0.6,
        compression_ratio_threshold=2.4
    )
    return result


def diarize_chunk(wav_path: str) -> list:
    """Run speaker diarization. Returns list of {start, end, speaker}."""
    if not diarization_pipeline:
        return []
    try:
        diarization = diarization_pipeline(wav_path)
        segments = []
        for turn, _, speaker in diarization.itertracks(yield_label=True):
            segments.append({
                "start": turn.start,
                "end": turn.end,
                "speaker": speaker
            })
        return segments
    except Exception as e:
        log.error(f"Diarization error: {e}")
        return []


def assign_speakers_to_words(whisper_result: dict, diarization_segments: list) -> list:
    """Merge Whisper word timestamps with speaker diarization."""
    output = []

    for segment in whisper_result.get("segments", []):
        seg_start = segment["start"]
        seg_end = segment["end"]
        seg_text = segment["text"].strip()

        if not seg_text:
            continue

        # Find best matching speaker for this segment
        speaker = "SPEAKER_00"
        best_overlap = 0

        for dseg in diarization_segments:
            overlap_start = max(seg_start, dseg["start"])
            overlap_end = min(seg_end, dseg["end"])
            overlap = max(0, overlap_end - overlap_start)
            if overlap > best_overlap:
                best_overlap = overlap
                speaker = dseg["speaker"]

        output.append({
            "start": seg_start,
            "end": seg_end,
            "text": seg_text,
            "speaker": speaker,
            "confidence": segment.get("avg_logprob", 0)
        })

    return output


def merge_consecutive_same_speaker(segments: list) -> list:
    """Merge consecutive segments from the same speaker."""
    if not segments:
        return []
    merged = [segments[0].copy()]
    for seg in segments[1:]:
        last = merged[-1]
        if seg["speaker"] == last["speaker"] and (seg["start"] - last["end"]) < 1.0:
            last["text"] += " " + seg["text"]
            last["end"] = seg["end"]
        else:
            merged.append(seg.copy())
    return merged


# ─── WebSocket handler ──────────────────────────────────────────────────────────
async def handle_client(websocket):
    session = None
    pending_audio = None  # Holds audio bytes waiting for matching metadata

    log.info(f"Client connected: {websocket.remote_address}")

    try:
        async for message in websocket:

            # If it's text — it's a JSON control message or metadata
            if isinstance(message, str):
                data = json.loads(message.strip())
                msg_type = data.get("type")

                if msg_type == "INIT":
                    session_id = data["sessionId"]
                    sessions[session_id] = SessionState(session_id)
                    session = sessions[session_id]
                    log.info(f"Session started: {session_id}")
                    await websocket.send(json.dumps({"type": "READY", "sessionId": session_id}))

                elif msg_type == "AUDIO_CHUNK":
                    # Next binary message will be the audio for this chunk
                    pending_audio = {
                        "sessionId": data["sessionId"],
                        "timestamp": data.get("timestamp", 0),
                        "language": data.get("language", "en")
                    }

                elif msg_type == "END_SESSION":
                    if session:
                        log.info(f"Session ended: {session.session_id} — {len(session.full_transcript)} segments")
                    await websocket.send(json.dumps({"type": "SESSION_ENDED"}))
                    break

            # If it's bytes — it's audio data
            elif isinstance(message, bytes) and pending_audio:
                if not session:
                    session_id = pending_audio["sessionId"]
                    if session_id in sessions:
                        session = sessions[session_id]

                try:
                    await process_audio_chunk(websocket, session, message, pending_audio)
                except Exception as e:
                    log.error(f"Audio processing error: {e}")
                    await websocket.send(json.dumps({
                        "type": "ERROR",
                        "message": str(e)
                    }))
                finally:
                    pending_audio = None

    except websockets.exceptions.ConnectionClosed:
        log.info("Client disconnected")
    except Exception as e:
        log.error(f"Handler error: {e}")
    finally:
        if session and session.session_id in sessions:
            del sessions[session.session_id]


async def process_audio_chunk(websocket, session, audio_bytes: bytes, meta: dict):
    """Process an audio chunk: convert → transcribe → diarize → send results."""
    if len(audio_bytes) < 1000:
        return  # Too small, skip

    log.info(f"Processing chunk: {len(audio_bytes)} bytes")

    # Run in thread pool to avoid blocking event loop
    loop = asyncio.get_event_loop()
    results = await loop.run_in_executor(None, _process_sync, audio_bytes, meta.get("language", "en"))

    if not results:
        return

    for seg in results:
        speaker_label = session.get_speaker_label(seg["speaker"]) if session else "Speaker A"
        payload = {
            "type": "TRANSCRIPT",
            "speaker": seg["speaker"],
            "speakerLabel": speaker_label,
            "text": seg["text"],
            "confidence": round(min(1.0, max(0.0, (seg["confidence"] + 5) / 5)), 2),
            "timestamp": seg["start"],
            "isFinal": True
        }
        await websocket.send(json.dumps(payload))
        log.info(f"{speaker_label}: {seg['text'][:60]}...")

        if session:
            session.full_transcript.append(payload)


def _process_sync(audio_bytes: bytes, language: str) -> list:
    """Synchronous audio processing (runs in thread pool)."""
    wav_path = None
    try:
        wav_path = webm_to_wav(audio_bytes)

        # Transcribe
        whisper_result = transcribe_chunk(wav_path, language)

        # Diarize (if available)
        diarization_segments = diarize_chunk(wav_path) if diarization_pipeline else []

        if diarization_segments:
            segments = assign_speakers_to_words(whisper_result, diarization_segments)
        else:
            # No diarization — all one speaker
            segments = [
                {
                    "start": s["start"], "end": s["end"],
                    "text": s["text"].strip(), "speaker": "SPEAKER_00",
                    "confidence": s.get("avg_logprob", 0)
                }
                for s in whisper_result.get("segments", []) if s["text"].strip()
            ]

        return merge_consecutive_same_speaker(segments)

    except Exception as e:
        log.error(f"Sync processing error: {e}")
        return []
    finally:
        if wav_path and os.path.exists(wav_path):
            os.unlink(wav_path)


# ─── Main ───────────────────────────────────────────────────────────────────────
async def main():
    log.info(f"NoteMind AI Server starting on ws://{HOST}:{PORT}")
    log.info(f"Whisper model: {WHISPER_MODEL_SIZE} | Device: {DEVICE}")
    log.info(f"Speaker diarization: {'ENABLED' if diarization_pipeline else 'DISABLED (set HF_TOKEN)'}")
    log.info("─" * 50)
    log.info("Waiting for Chrome extension to connect...")

    async with websockets.serve(handle_client, HOST, PORT, max_size=50_000_000):
        await asyncio.Future()  # Run forever


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        log.info("Server stopped.")
