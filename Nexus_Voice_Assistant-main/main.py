import sys
import datetime
import pywhatkit
import wikipedia
import pyjokes
from config_manager import ConfigManager
from voice_engine import VoiceEngine

class Assistant:
    def __init__(self):
        self.config = ConfigManager()
        self.voice = VoiceEngine()
        self.name = self.config.get_name()
        
    def greet(self):
        hour = int(datetime.datetime.now().hour)
        if 0 <= hour < 12:
            greeting = "Good Morning!"
        elif 12 <= hour < 18:
            greeting = "Good Afternoon!"
        else:
            greeting = "Good Evening!"
        
        self.voice.speak(f"{greeting} I am {self.name}. How can I help you?")

    def handle_command(self, command):
        # Basic check to see if the command effectively addresses the assistant
        # Note: In a continuous loop, we usually check for the wake word first.
        # But for simplicity here, we assume the user might wake it up or we check if the name is in the sentence.
        
        # If the name is part of the command (optional for now, or mandatory?)
        # Let's make it so if the command starts with the name, we process it.
        # Or if we just process everything since we are in a 'Listening...' state.
        
        # We'll support commands without the name for direct interaction,
        # but logically, we check "change your name" or "change name"
        
        if 'change your name to' in command:
            new_name = command.replace('change your name to', '').strip()
            if new_name:
                self.config.set_name(new_name)
                self.name = new_name
                self.voice.speak(f"Okay, I have changed my name to {self.name}.")
            else:
                self.voice.speak("I didn't catch the new name.")
                
        elif 'change name to' in command:
             new_name = command.replace('change name to', '').strip()
             if new_name:
                self.config.set_name(new_name)
                self.name = new_name
                self.voice.speak(f"Done. My name is now {self.name}.")

        elif 'play' in command:
            song = command.replace('play', '').strip()
            self.voice.speak(f"Playing {song}")
            pywhatkit.playonyt(song)

        elif 'time' in command:
            time = datetime.datetime.now().strftime('%I:%M %p')
            self.voice.speak(f"Current time is {time}")

        elif 'who is' in command:
            person = command.replace('who is', '').strip()
            try:
                info = wikipedia.summary(person, sentences=1)
                self.voice.speak(info)
            except:
                self.voice.speak("I could not find information on that.")

        elif 'what is' in command:
            thing = command.replace('what is', '').strip()
            try:
                info = wikipedia.summary(thing, sentences=1)
                self.voice.speak(info)
            except:
                self.voice.speak("I could not find information on that.")
        
        elif 'joke' in command:
            self.voice.speak(pyjokes.get_joke())

        elif 'stop' in command or 'exit' in command or 'quit' in command:
            self.voice.speak("Goodbye!")
            sys.exit()
            
        else:
            # Check if addressed by name but command not understood
            if self.name.lower() in command:
                self.voice.speak("I am not sure how to do that yet.")

    def run(self):
        self.greet()
        while True:
            command = self.voice.listen()
            if command:
                # To make it feel like "Alexa", we usually wait for the wake word.
                # E.g. "Alexa, play music".
                
                # Check if command starts with name OR if the user just spoke directly 
                # (simple mode: process all speech if it matches a known pattern)
                
                if self.name.lower() in command:
                    # Strip the name out to process the raw intent more easily?
                    # Or just pass the full command.
                    self.handle_command(command)
                else:
                    # Allow commands without name if they are distinct enough?
                    # For now, let's process key keywords directly to be helpful
                    keywords = ['play', 'time', 'who is', 'what is', 'joke', 'change name', 'stop', 'exit']
                    if any(k in command for k in keywords):
                        self.handle_command(command)

if __name__ == "__main__":
    app = Assistant()
    command = ""
    # Optional: Quick loop to make sure dependencies are happy
    try:
        app.run()
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print(f"Critical Error: {e}")
