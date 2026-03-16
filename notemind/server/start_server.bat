@echo off
REM NoteMind Server Launcher — Windows
REM Double-click this file to start the AI server

echo ==========================================
echo   NoteMind AI Server
echo   Whisper + Speaker Detection
echo ==========================================
echo.

REM Check if HF_TOKEN is set
if "%HF_TOKEN%"=="" (
    echo WARNING: HF_TOKEN not set.
    echo Speaker diarization will be disabled.
    echo Get your token at: huggingface.co/settings/tokens
    echo Then run: set HF_TOKEN=hf_your_token_here
    echo.
)

echo Starting server on ws://localhost:8765
echo Keep this window open while recording.
echo.

cd /d "%~dp0"
python server.py

pause
