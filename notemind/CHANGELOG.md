# Changelog

All notable changes to NoteMind are documented here.

## [1.0.0] — 2026-03-16

### Added
- Chrome extension with Manifest V3
- Real-time tab audio capture via `chrome.tabCapture` API
- Local AI server with Whisper large-v3 transcription (~97% accuracy)
- pyannote.audio speaker diarization (up to 6 speakers)
- Claude-powered note generation: summary, key points, action items, decisions
- Per-speaker contribution breakdown
- Tabbed notes UI: Summary / Speakers / Actions
- Export to `.txt` file
- Settings panel: API key, Whisper model selection, speaker names, language
- Server status indicator (green/red dot)
- Support for Google Meet, Zoom web, Microsoft Teams, any browser meeting
- Windows launcher (`start_server.bat`)
- Mac/Linux launcher (`start_server.sh`)
- GitHub Actions lint workflow

### Planned for v1.1.0
- Electron desktop app (Windows, Mac, Linux)
- Firefox extension
- Export to Google Docs
- Export to Notion
- Real-time summary panel during recording
