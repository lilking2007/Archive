# NoteMind — AI Meeting Notes

> Chrome extension that records any meeting, detects who said what, and generates structured notes using Whisper + Claude.

**Works with:** Google Meet · Zoom (browser) · Microsoft Teams · Any browser meeting · In-person rooms

---

## What it does

- Records tab audio directly from Chrome (no separate mic app needed)
- Transcribes speech at **~97% accuracy** using OpenAI Whisper large-v3 running locally on your machine
- Labels each speaker automatically — **Speaker A**, **Speaker B**, etc.
- At the end, Claude generates a **Summary**, **Key Points**, **Action Items**, **Decisions**, and a **per-speaker breakdown**
- Everything is **100% private** — audio never leaves your machine; only the finished text goes to Claude

---

## Requirements

| What | Where to get it |
|---|---|
| Python 3.9+ | [python.org](https://www.python.org/downloads/) |
| ffmpeg | [ffmpeg.org](https://ffmpeg.org/download.html) or `choco install ffmpeg` |
| Anthropic API key | [console.anthropic.com](https://console.anthropic.com) |
| Hugging Face token | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) |
| Chrome or Edge browser | — |

---

## Setup — do this once

### Step 1 — Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/notemind.git
cd notemind
```

Or download the ZIP from GitHub → click the green **Code** button → **Download ZIP** → unzip it.

---

### Step 2 — Install Python dependencies

```bash
cd server
pip install -r requirements.txt
```

**Windows** — if pip is not recognised, run `python -m pip install -r requirements.txt`

**Mac** — use `pip3 install -r requirements.txt`

Then install ffmpeg:

| OS | Command |
|---|---|
| Windows (Chocolatey) | `choco install ffmpeg` |
| Windows (manual) | Download from [ffmpeg.org](https://ffmpeg.org/download.html), add to system PATH |
| Mac | `brew install ffmpeg` |
| Ubuntu/Debian | `sudo apt install ffmpeg` |

---

### Step 3 — Get your Hugging Face token (for speaker detection)

Speaker detection (knowing *who* said what) requires pyannote, which needs a free Hugging Face account.

1. Go to [huggingface.co](https://huggingface.co) → create a free account
2. Go to **Settings → Access Tokens → New token**
3. Name it `notemind`, role: **Read** → click Create
4. Copy the token (it starts with `hf_`)
5. **Accept the model terms** — you must do both of these or it will not work:
   - [pyannote/speaker-diarization-3.1](https://huggingface.co/pyannote/speaker-diarization-3.1) → click **Agree**
   - [pyannote/segmentation-3.0](https://huggingface.co/pyannote/segmentation-3.0) → click **Agree**
6. Set the token in your environment:

```bash
# Windows (Command Prompt)
set HF_TOKEN=hf_your_token_here

# Windows — to make it permanent (so you never have to set it again)
setx HF_TOKEN "hf_your_token_here"

# Mac / Linux
export HF_TOKEN=hf_your_token_here

# Mac / Linux — to make it permanent
echo 'export HF_TOKEN=hf_your_token_here' >> ~/.zshrc
```

---

### Step 4 — Get your Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com) → sign up or log in
2. Click **API Keys** in the left sidebar → **Create Key**
3. Copy the key (starts with `sk-ant-`)
4. Go to **Billing** → add $5 credit (this covers roughly 500 meetings)

You will enter this key inside the Chrome extension settings panel — not in a file.

---

### Step 5 — Start the AI server

The server runs locally on your machine. It must be running whenever you use the extension.

**Windows** — double-click `server/start_server.bat`

**Mac / Linux:**
```bash
cd server
chmod +x start_server.sh
./start_server.sh
```

You should see this output:
```
NoteMind AI Server starting on ws://localhost:8765
Whisper model: large-v3 | Device: cpu
Speaker diarization: ENABLED
Waiting for Chrome extension to connect...
```

Keep this terminal window open while recording. You can minimise it.

---

### Step 6 — Load the extension into Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Toggle **Developer mode** ON (top right corner)
3. Drag the `extension/` folder from this repo directly onto the page

That is it — the NoteMind icon appears in your Chrome toolbar.

> **Note:** If the icon is not visible, click the puzzle-piece icon in the toolbar and pin NoteMind.

---

### Step 7 — Configure the extension

1. Click the **NoteMind** icon in Chrome toolbar
2. Click the ⚙ settings icon (top right of the popup)
3. Paste your **Anthropic API key**
4. Select your Whisper model:
   - `large-v3` → 97% accuracy, needs ~10GB RAM (recommended if you have 16GB+)
   - `medium` → 94% accuracy, needs ~5GB RAM
   - `base` → 90% accuracy, needs ~1GB RAM
5. Optionally enter speaker names (comma-separated): `Alice, Bob, Charlie`
6. Click **Save settings**

---

## How to record a meeting

1. Start the AI server (Step 5 above)
2. Open your meeting in Chrome (Google Meet, Zoom web, Teams web)
3. Click the **NoteMind** icon
4. Click **Record tab audio** — Chrome may ask for permission, click Allow
5. Talk normally — the transcript appears live with Speaker A / B / C labels
6. When the meeting ends, click **Stop recording**
7. Click **✦ Generate notes** — takes about 10 seconds
8. Review notes across three tabs: **Summary**, **Speakers**, **Actions**
9. Click **export** to download a formatted `.txt` file

---

## Accuracy

| Model | Accuracy | RAM Required |
|---|---|---|
| `large-v3` | ~97% | 10 GB |
| `medium` | ~94% | 5 GB |
| `small` | ~92% | 2 GB |
| `base` | ~90% | 1 GB |

Speaker detection accuracy depends on audio quality and number of speakers. It works best when speakers take clear turns and there is minimal background noise.

---

## Troubleshooting

**Server dot in extension is red / offline**
Make sure `server.py` is running first. The server must be started before you open the extension popup.

**"tabCapture failed" error**
You must be on a regular web page tab. The extension cannot capture `chrome://` pages. Refresh your meeting tab and try again.

**Speaker detection not working / everyone is labelled Speaker A**
Check that `HF_TOKEN` is set and that you accepted the model terms on both Hugging Face pages (Step 3). The server log will say `Speaker diarization: ENABLED` if it is working correctly.

**pyannote install fails on Windows**
Try:
```
pip install pyannote.audio --extra-index-url https://download.pytorch.org/whl/cpu
```

**The server is very slow on first run**
Whisper downloads the model weights on first launch (~3GB for large-v3). This only happens once. Subsequent starts are fast.

**Zoom desktop app — audio not captured**
The extension captures browser tabs only. For the Zoom desktop app you need the Electron desktop app version (coming soon). For now, use Zoom in the browser at [app.zoom.us](https://app.zoom.us).

---

## Project structure

```
notemind/
├── extension/                  Chrome extension (load this folder into Chrome)
│   ├── manifest.json           Extension config — permissions, version
│   ├── background.js           Service worker — manages tab capture lifecycle
│   ├── offscreen.html/.js      Hidden page that handles audio streaming to server
│   ├── popup.html              Extension popup UI
│   ├── popup.css               Styles — Geist font, dark theme
│   ├── popup.js                UI logic — recording, transcript, notes generation
│   └── icons/                  Extension icons (16px, 48px, 128px)
│
├── server/                     Local AI server (run this on your machine)
│   ├── server.py               Main server — Whisper transcription + pyannote diarization
│   ├── requirements.txt        Python dependencies
│   ├── start_server.bat        Windows launcher (double-click)
│   └── start_server.sh         Mac / Linux launcher
│
├── .github/
│   └── workflows/
│       └── lint.yml            GitHub Actions — basic Python lint check
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## Publishing to the Chrome Web Store

Follow these steps to publish NoteMind publicly so anyone can install it with one click.

### What you need first
- A Google account
- $5 (one-time developer registration fee — you only pay this once, ever)
- At least 3 screenshots of the extension in use (1280×800 or 640×400 pixels)
- A short description (up to 132 characters) and a longer one (up to 16,000 characters)
- A privacy policy URL (see note below)

### Privacy policy
All stores require one. Since NoteMind processes audio locally and only sends text to Anthropic, your policy just needs to explain that. Use [Termly](https://termly.io) or [PrivacyPolicyGenerator.info](https://www.privacypolicygenerator.info) to generate one for free and host it on GitHub Pages or any free hosting.

### Steps to publish

**1. Create your developer account**
Go to [chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole) and sign in with your Google account. Pay the one-time $5 registration fee.

**2. Prepare your ZIP**
Zip only the `extension/` folder — not the whole repo.

```bash
# Mac / Linux
cd notemind
zip -r notemind-extension.zip extension/ -x "*.DS_Store"

# Windows (PowerShell)
Compress-Archive -Path extension -DestinationPath notemind-extension.zip
```

**3. Upload**
- In the Developer Console, click **New Item**
- Upload your `notemind-extension.zip`
- Fill in: name, short description, detailed description, category (Productivity)
- Upload screenshots — take them while the extension is running in a real meeting
- Set **Visibility** to Public
- Add your privacy policy URL
- Leave price as **Free**

**4. Submit for review**
Click **Submit for review**. Google reviews extensions within 1–3 business days. You will receive an email when approved.

**5. After approval**
Your extension gets a permanent URL like:
`https://chromewebstore.google.com/detail/notemind/YOUR_EXTENSION_ID`

Share this link and users can install with one click — no developer mode needed.

---

## Publishing to other platforms

### Microsoft Edge Add-ons (free)
Chrome extensions work in Edge with no code changes. Go to [partner.microsoft.com/dashboard](https://partner.microsoft.com/dashboard), create a free account, and upload the same ZIP. Review takes 3–7 business days.

### Firefox (coming soon)
Firefox requires minor manifest changes (Manifest V2 vs V3 differences). A Firefox version is planned.

---

## Privacy

- All audio is processed **locally on your machine** using Whisper
- Audio is never uploaded to any cloud service
- Only the finished text transcript is sent to Anthropic's Claude API to generate notes
- No analytics, no tracking, no data stored after your session ends (unless you export)

---

## Tech stack

| Component | Technology |
|---|---|
| Transcription | [OpenAI Whisper](https://github.com/openai/whisper) (open source, runs locally) |
| Speaker detection | [pyannote.audio](https://github.com/pyannote/pyannote-audio) (open source, runs locally) |
| Note generation | [Claude](https://anthropic.com) via API |
| Extension | Chrome Manifest V3 |
| Audio capture | Chrome tabCapture API + WebSocket |
| Server | Python + websockets |

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.

```bash
git clone https://github.com/YOUR_USERNAME/notemind.git
cd notemind
# Make your changes
git checkout -b feature/your-feature-name
git commit -m "Add your feature"
git push origin feature/your-feature-name
# Open a pull request on GitHub
```

---

## License

MIT — see [LICENSE](LICENSE) file.

---

## Roadmap

- [ ] Electron desktop app (Windows, Mac, Linux) — captures Zoom desktop + in-person audio
- [ ] Firefox extension
- [ ] Custom speaker name assignment from the popup
- [ ] Export to Google Docs / Notion
- [ ] Real-time summary updates during recording
- [ ] Multi-language auto-detection
