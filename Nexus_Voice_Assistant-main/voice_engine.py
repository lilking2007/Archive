import pyttsx3
import speech_recognition as sr
import threading

class VoiceEngine:
    def __init__(self):
        self.engine = pyttsx3.init()
        # Set default properties
        self.engine.setProperty('rate', 170)
        self.engine.setProperty('volume', 1.0)
        
        # Initialize recognizer
        self.recognizer = sr.Recognizer()

    def speak(self, text):
        """Convert text to speech"""
        print(f"Assistant: {text}")
        self.engine.say(text)
        self.engine.runAndWait()

    def listen(self):
        """Listen to microphone input and return string"""
        try:
            with sr.Microphone() as source:
                print("Listening...")
                # Adjust for ambient noise dynamically
                self.recognizer.adjust_for_ambient_noise(source, duration=0.2)
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=5)
                
                try:
                    print("Recognizing...")
                    command = self.recognizer.recognize_google(audio)
                    print(f"User: {command}")
                    return command.lower()
                except sr.UnknownValueError:
                    return ""
                except sr.RequestError:
                    self.speak("Sorry, my internet connection seems to be down.")
                    return ""
        except Exception as e:
            # Microphone access issues or other errors
            print(f"Error: {e}")
            return ""

    def get_voices(self):
        return self.engine.getProperty('voices')

    def set_voice(self, voice_id):
        self.engine.setProperty('voice', voice_id)
