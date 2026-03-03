# Nexus Voice Assistant

**Nexus** is a customizable, offline-capable voice assistant built with Python. It functions similarly to Amazon Alexa or Google Assistant but runs entirely on your local machine, giving you privacy and control.

## 🌟 Features
- **Voice Interaction**: Speaks and listens naturally.
- **Customizable Wake Word**: You can change the assistant's name (e.g., "Alexa", "Jarvis", "Computer") via voice command.
- **Music Player**: "Play [song name]" opens YouTube and plays the track.
- **Knowledge Base**: "Who is [Person]?" or "What is [Thing]?" fetches instant summaries from Wikipedia.
- **Time & Date**: Ask "What time is it?" for instant updates.
- **Jokes**: Ask "Tell me a joke" for some developer humor.
- **Persistent Memory**: Remembers its name even after you restart the computer.

## 🛠️ Installation

### Prerequisites
- **Python 3.8+** installed on your system.
- A working **Microphone** and **Speakers**.
- An active **Internet Connection** (for Google Speech Recognition, Wikipedia, and YouTube).

### Setup Steps
1.  **Clone or Download** this repository.
2.  Open a terminal/command prompt in the project folder.
3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
    *Note for Windows Users: If `pyaudio` fails to install, install `pipwin` first:*
    ```bash
    pip install pipwin
    pipwin install pyaudio
    pip install -r requirements.txt
    ```

## 🚀 Usage

1.  **Start the Assistant**:
    ```bash
    python main.py
    ```
2.  **Greet**: The assistant will say "Good [Time of Day], I am Alexa (or current name)...".
3.  **Speak a Command**:
    - **"Play Blinding Lights"** -> Plays the song on YouTube.
    - **"Change your name to Jarvis"** -> Changes the wake word to Jarvis.
    - **"Who is Elon Musk?"** -> Reads a biography summary.
    - **"Stop"** or **"Exit"** -> Shuts down the assistant.

## 🔧 Configuration
The assistant's settings are stored in `config.json`.
- **Name**: The name the assistant refers to itself by.
- **Voice Rate**: Speed of speech.
- **Voice Volume**: Volume level (0.0 to 1.0).

## 📦 Requirements
- `SpeechRecognition`
- `pyttsx3`
- `pywhatkit`
- `wikipedia`
- `pyaudio`
- `requests`
- `pyjokes`

---
*Built for personal use and education.*
