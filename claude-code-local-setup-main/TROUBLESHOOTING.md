# 🔧 Troubleshooting Guide

**Solutions for common issues when setting up Claude Code with local Qwen.**

---

## Quick Diagnosis

### Problem: Nothing works

**Run these 3 commands to diagnose:**

```powershell
ollama --version
node --version
claude --version
```

All three should show version numbers. If one fails, install that software.

---

## Installation Issues

### ❌ "Ollama: command not found"

**Cause:** Ollama isn't installed or not in your PATH

**Solutions:**

1. **Restart PowerShell** (close and reopen)
2. **Restart your computer** (Ollama adds itself to PATH)
3. **Reinstall Ollama** from https://ollama.ai

**Verify:**
```powershell
ollama --version
```

Should show version like `ollama version 0.3.4`

---

### ❌ "npm: File cannot be loaded because running scripts is disabled"

**Cause:** PowerShell execution policy is too restrictive

**Solution:**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

When asked, type **Y** and press Enter.

---

### ❌ "Node.js not found" or "npm: command not found"

**Cause:** Node.js isn't installed

**Solutions:**

1. **Check if installed:**
   ```powershell
   node --version
   ```

2. **If not installed:**
   - Download from: https://nodejs.org
   - Run installer (use default settings)
   - Restart PowerShell

3. **Verify after install:**
   ```powershell
   node --version
   npm --version
   ```

---

### ❌ Ollama installation hangs

**Cause:** Security software blocking installation

**Solutions:**

1. **Temporarily disable antivirus**
2. **Run as Administrator** (right-click installer)
3. **Try different browser** (if downloading)
4. **Check firewall** settings

---

## Model Download Issues

### ❌ "ollama pull qwen3-coder:30b" is very slow

**Cause:** Slow internet connection or network congestion

**Solutions:**

1. **Just wait** — 20GB takes time on slow internet
2. **Check internet speed:**
   - Speed test: https://speedtest.net
   - Less than 5Mbps = will be slow

3. **Download at night** (less network congestion)

4. **Use smaller model instead:**
   ```powershell
   ollama pull qwen2.5-coder:7b
   ```
   (Only 4.7GB instead of 20GB)

---

### ❌ "Error: pull model manifest: file does not exist"

**Cause:** Network issues or typo in model name

**Solutions:**

1. **Check spelling:**
   ```powershell
   ollama pull qwen3-coder:30b
   ```
   (must be exact)

2. **Retry download:**
   ```powershell
   ollama pull qwen3-coder:30b
   ```
   (Ollama will resume from where it stopped)

3. **Check internet** is working

4. **Try different model:**
   ```powershell
   ollama pull mistral:7b
   ```

---

### ❌ Disk space error during download

**Cause:** Not enough free disk space (need 30GB+)

**Solutions:**

1. **Check free space:**
   ```powershell
   Get-Volume
   ```

2. **Free up space** (delete large files)

3. **Use external drive** (if available)

---

## Runtime Issues

### ❌ "Claude --version" works but "claude --model qwen3-coder:30b" fails

**Cause:** Environment variables not set

**Solutions:**

1. **Check environment variables:**
   ```powershell
   $env:ANTHROPIC_BASE_URL
   ```
   Should output: `http://localhost:11434/v1`

2. **If empty, set them again:**
   ```powershell
   $env:ANTHROPIC_AUTH_TOKEN="ollama"
   $env:ANTHROPIC_API_KEY=""
   $env:ANTHROPIC_BASE_URL="http://localhost:11434/v1"
   ```

3. **Note:** Environment variables reset when you close PowerShell!
   - Create a batch file to set them automatically
   - Or add to your profile

---

### ❌ "Connection refused on localhost:11434"

**Cause:** Ollama isn't running

**Solutions:**

1. **Start Ollama:**
   - Click the Ollama icon in system tray
   - Or open it from Start menu

2. **Verify it's running:**
   ```powershell
   netstat -ano | findstr :11434
   ```
   Should show a process listening on port 11434

3. **Check port availability:**
   ```powershell
   netstat -ano | findstr :11434
   ```

---

### ❌ "Model not found" error

**Cause:** Model wasn't fully downloaded

**Solutions:**

1. **Check installed models:**
   ```powershell
   ollama list
   ```

2. **If qwen3-coder:30b is missing, download again:**
   ```powershell
   ollama pull qwen3-coder:30b
   ```

3. **Verify complete download:**
   ```powershell
   ollama list
   ```
   Should show full size (20GB for Qwen3-coder:30b)

---

### ❌ Claude Code launches but is very slow

**Cause:** System is under heavy load or RAM is full

**Solutions:**

1. **Close other applications** (especially Chrome, VS Code)

2. **Check RAM usage:**
   - Open Task Manager (Ctrl + Shift + Esc)
   - Look at Memory tab
   - Should have 5-10GB free when running Claude

3. **Restart Ollama:**
   - Close it from system tray
   - Wait 10 seconds
   - Reopen it

4. **Use smaller model:**
   ```powershell
   claude --model qwen2.5-coder:7b
   ```

5. **Restart your computer** (frees RAM)

---

### ❌ Claude Code crashes or exits unexpectedly

**Cause:** Out of RAM or Ollama crashed

**Solutions:**

1. **Check available RAM:**
   ```powershell
   Get-ComputerInfo | Select-Object TotalPhysicalMemory
   ```
   Need at least 16GB, 32GB recommended

2. **Close other apps** and restart Ollama

3. **Reduce model size:**
   ```powershell
   claude --model qwen2.5-coder:7b
   ```

4. **Check Ollama is still running:**
   ```powershell
   ollama list
   ```

---

## VS Code Extension Issues

### ❌ VS Code extension won't install

**Cause:** VS Code version too old or network issue

**Solutions:**

1. **Update VS Code:**
   - Click Help → Check for Updates
   - Or download fresh from https://code.visualstudio.com

2. **Try installing again:**
   - Ctrl + Shift + X
   - Search: Claude Code
   - Click Install

3. **Clear VS Code cache:**
   - Close VS Code
   - Delete: `%USERPROFILE%\.vscode`
   - Reopen VS Code

---

### ❌ VS Code extension is installed but Claude doesn't respond

**Cause:** Settings not configured

**Solutions:**

1. **Check settings are set correctly:**
   - Press Ctrl + ,
   - Search: claude
   - Verify these fields:

   | Field | Value |
   |-------|-------|
   | Claude: API Key | (empty) |
   | Claude: API URL | `http://localhost:11434/v1` |
   | Claude: Model | `qwen3-coder:30b` |

2. **Restart VS Code** (Ctrl + Shift + P → Reload Window)

3. **Verify Ollama is running:**
   ```powershell
   ollama list
   ```

---

### ❌ VS Code sidebar shows "Waiting..." forever

**Cause:** Ollama is slow or model is slow

**Solutions:**

1. **Wait longer** (first response can take 30 seconds)

2. **Check Ollama is still running:**
   - Open another PowerShell
   - Run: `ollama list`

3. **Restart Ollama** from system tray

4. **Use faster model:**
   ```
   VS Code → Ctrl + , → Search "claude: model" → Change to mistral:7b
   ```

---

## Hardware Issues

### ❌ "Model requires more memory than available"

**Cause:** Not enough RAM for the model

**Error looks like:**
```
model requires 18.2 GiB RAM but only 4.1 GiB available
```

**Solutions:**

1. **Check RAM:**
   ```powershell
   (Get-ComputerInfo).TotalPhysicalMemory / 1GB
   ```

2. **Use smaller model:**
   - 8GB RAM → Use `qwen2.5-coder:7b`
   - 16GB RAM → Use `qwen3-coder:30b`
   - 32GB+ RAM → Use `llama2:70b`

3. **Close all other applications** before launching Claude

---

### ❌ "Insufficient disk space"

**Solutions:**

1. **Check free space:**
   ```powershell
   Get-Volume
   ```
   Need 30GB+ free

2. **Free up space:**
   - Delete temporary files
   - Move files to external drive
   - Empty Recycle Bin

3. **Move Ollama models** to different drive (advanced)

---

## Network Issues

### ❌ "Unable to connect to https://ollama.ai"

**Cause:** Internet connection issue or firewall blocking

**Solutions:**

1. **Check internet:**
   - Ping Google: `ping google.com`
   - If no response, reconnect to WiFi

2. **Check firewall:**
   - Windows Defender Firewall might be blocking
   - Add Ollama to whitelist

3. **Try different network:**
   - Try mobile hotspot or different WiFi

---

### ❌ Firewall/Antivirus blocking installation

**Solutions:**

1. **Temporarily disable antivirus**
2. **Add Ollama to whitelist** in antivirus settings
3. **Disable Windows Defender** (not recommended but as last resort)

---

## Getting More Help

### 1. Check These First:

- [ ] Run all 3 version commands
- [ ] Check all 3 environment variables are set
- [ ] Verify Ollama is running
- [ ] Restart PowerShell
- [ ] Restart your computer

### 2. Collect Debug Info:

When asking for help, provide:

```powershell
ollama --version
node --version
claude --version
ollama list
```

### 3. Still Stuck?

- **Check main README.md FAQ**
- **Review SETUP_GUIDE.md again**
- **Try alternative model**
- **Try fresh installation**

---

## Nuclear Option: Fresh Start

If everything is broken, start fresh:

### Remove Everything:

```powershell
npm uninstall -g @anthropic-ai/claude-code
ollama rm qwen3-coder:30b
```

### Then Follow SETUP_GUIDE.md Again

Sometimes a fresh start is faster than debugging!

---

**Still stuck? The community is here to help!** 🤝
