import json
import os

CONFIG_FILE = 'config.json'

DEFAULT_CONFIG = {
    "utils": {
        "name": "Alexa",
        "voice_rate": 170,
        "voice_volume": 1.0
    }
}

class ConfigManager:
    def __init__(self):
        self.config = self.load_config()

    def load_config(self):
        if not os.path.exists(CONFIG_FILE):
            self.save_config(DEFAULT_CONFIG)
            return DEFAULT_CONFIG
        try:
            with open(CONFIG_FILE, 'r') as f:
                return json.load(f)
        except:
            return DEFAULT_CONFIG

    def save_config(self, data):
        with open(CONFIG_FILE, 'w') as f:
            json.dump(data, f, indent=4)
        self.config = data

    def get_name(self):
        return self.config.get("utils", {}).get("name", "Alexa")

    def set_name(self, new_name):
        self.config["utils"]["name"] = new_name
        self.save_config(self.config)
