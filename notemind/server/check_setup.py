#!/usr/bin/env python3
"""
NoteMind setup checker.
Run this after installing requirements to verify everything is ready.

Usage: python check_setup.py
"""

import sys
import subprocess
import importlib

REQUIRED = ["whisper", "pyannote.audio", "websockets", "torch", "torchaudio"]
OPTIONAL = ["anthropic"]

def check(label, ok, detail=""):
    mark = "OK " if ok else "FAIL"
    print(f"  [{mark}] {label}" + (f" — {detail}" if detail else ""))
    return ok

def main():
    print("\nNoteMind Setup Checker")
    print("=" * 40)
    all_ok = True

    print("\nPython version:")
    v = sys.version_info
    ok = check(f"Python {v.major}.{v.minor}.{v.micro}", v >= (3, 9), "need 3.9+")
    all_ok = all_ok and ok

    print("\nRequired packages:")
    for pkg in REQUIRED:
        try:
            mod = importlib.import_module(pkg.replace("-", "_").replace(".", "_").split("_")[0])
            ver = getattr(mod, "__version__", "installed")
            ok = check(pkg, True, ver)
        except ImportError:
            ok = check(pkg, False, "run: pip install -r requirements.txt")
            all_ok = all_ok and ok

    print("\nffmpeg:")
    try:
        result = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True)
        ok = check("ffmpeg", result.returncode == 0, result.stdout.split('\n')[0])
    except FileNotFoundError:
        ok = check("ffmpeg", False, "not found — install from ffmpeg.org")
        all_ok = False

    print("\nHugging Face token:")
    import os
    token = os.environ.get("HF_TOKEN", "")
    ok = check("HF_TOKEN", bool(token), "set" if token else "not set — run: set HF_TOKEN=hf_...")
    if not token:
        all_ok = False

    print("\nGPU (optional):")
    try:
        import torch
        cuda = torch.cuda.is_available()
        check("CUDA GPU", cuda, "will use CPU (still works, slightly slower)" if not cuda else torch.cuda.get_device_name(0))
    except Exception:
        check("CUDA check", False, "torch not installed")

    print("\n" + "=" * 40)
    if all_ok:
        print("All checks passed. Run start_server.bat (Windows) or ./start_server.sh (Mac/Linux)")
    else:
        print("Some checks failed. Fix the items marked FAIL above, then run this script again.")
    print()

if __name__ == "__main__":
    main()
