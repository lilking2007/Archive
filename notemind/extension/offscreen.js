// NoteMind — offscreen.js
// Runs in offscreen context: captures tab audio, chunks it, sends to local Python server via WebSocket

const SERVER_URL = 'ws://localhost:8765';
const CHUNK_INTERVAL_MS = 5000; // Send audio every 5 seconds
const SAMPLE_RATE = 16000; // Whisper expects 16kHz

let mediaStream = null;
let mediaRecorder = null;
let audioChunks = [];
let wsSocket = null;
let chunkInterval = null;
let isCapturing = false;
let sessionId = null;

// ─── Message listener ───────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'START_OFFSCREEN_CAPTURE') startCapture(msg.streamId, msg.tabId);
  if (msg.type === 'STOP_OFFSCREEN_CAPTURE') stopCapture();
});

// ─── Start capture ──────────────────────────────────────────────────────────
async function startCapture(streamId, tabId) {
  try {
    sessionId = 'nm_' + Date.now();

    // Get media stream from tab using the stream ID
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: streamId
        }
      },
      video: false
    });

    // Connect to local Python AI server
    connectWebSocket();

    // Set up MediaRecorder to capture audio chunks
    mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: 'audio/webm;codecs=opus'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.push(event.data);
    };

    mediaRecorder.start();
    isCapturing = true;

    // Send chunks every CHUNK_INTERVAL_MS
    chunkInterval = setInterval(flushChunk, CHUNK_INTERVAL_MS);

    notifyPopup('SERVER_STATUS', { status: 'capturing', message: 'Recording started' });
  } catch (err) {
    notifyPopup('SERVER_STATUS', { status: 'error', message: err.message });
  }
}

// ─── Stop capture ────────────────────────────────────────────────────────────
function stopCapture() {
  isCapturing = false;
  clearInterval(chunkInterval);

  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    // Flush any remaining audio
    setTimeout(flushChunk, 200);
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach(t => t.stop());
    mediaStream = null;
  }

  if (wsSocket) {
    // Send end signal
    if (wsSocket.readyState === WebSocket.OPEN) {
      wsSocket.send(JSON.stringify({ type: 'END_SESSION', sessionId }));
    }
    setTimeout(() => { wsSocket?.close(); wsSocket = null; }, 1000);
  }

  notifyPopup('SERVER_STATUS', { status: 'stopped', message: 'Recording stopped' });
}

// ─── Flush audio chunk to server ────────────────────────────────────────────
async function flushChunk() {
  if (audioChunks.length === 0) return;
  if (!wsSocket || wsSocket.readyState !== WebSocket.OPEN) return;

  const blob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
  audioChunks = [];

  // Convert blob to ArrayBuffer and send
  const buffer = await blob.arrayBuffer();
  const meta = JSON.stringify({ type: 'AUDIO_CHUNK', sessionId, timestamp: Date.now() });
  const metaBytes = new TextEncoder().encode(meta + '\n');

  // Send metadata then audio bytes
  wsSocket.send(metaBytes);
  wsSocket.send(buffer);
}

// ─── WebSocket connection ────────────────────────────────────────────────────
function connectWebSocket() {
  wsSocket = new WebSocket(SERVER_URL);

  wsSocket.onopen = () => {
    notifyPopup('SERVER_STATUS', { status: 'connected', message: 'AI server connected' });
    wsSocket.send(JSON.stringify({ type: 'INIT', sessionId, sampleRate: SAMPLE_RATE }));
  };

  wsSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'TRANSCRIPT') {
        notifyPopup('TRANSCRIPT_CHUNK', {
          speaker: data.speaker,
          speakerLabel: data.speakerLabel,  // "Speaker A", "Speaker B" etc
          text: data.text,
          confidence: data.confidence,
          timestamp: data.timestamp,
          isFinal: data.isFinal
        });
      }
    } catch (e) {
      console.error('WS parse error:', e);
    }
  };

  wsSocket.onerror = () => {
    notifyPopup('SERVER_STATUS', {
      status: 'server_offline',
      message: 'Local AI server not running. Start server.py first.'
    });
  };

  wsSocket.onclose = () => {
    if (isCapturing) {
      // Attempt reconnect after 2 seconds
      setTimeout(connectWebSocket, 2000);
    }
  };
}

// ─── Notify popup ────────────────────────────────────────────────────────────
function notifyPopup(type, payload) {
  chrome.runtime.sendMessage({ type, ...payload }).catch(() => {});
}
