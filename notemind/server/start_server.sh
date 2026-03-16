#!/bin/bash
# NoteMind Server Launcher — Mac / Linux
# Run: chmod +x start_server.sh && ./start_server.sh

echo "=========================================="
echo "  NoteMind AI Server"
echo "  Whisper + Speaker Detection"
echo "=========================================="
echo ""

if [ -z "$HF_TOKEN" ]; then
    echo "⚠  WARNING: HF_TOKEN not set."
    echo "   Speaker diarization will be disabled."
    echo "   Get your token at: huggingface.co/settings/tokens"
    echo "   Then run: export HF_TOKEN=hf_your_token_here"
    echo ""
fi

echo "Starting server on ws://localhost:8765"
echo "Keep this terminal open while recording."
echo ""

cd "$(dirname "$0")"
python3 server.py
