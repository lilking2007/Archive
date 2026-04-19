# ⚡ Quick Reference Card

**Copy-paste commands and quick reference for Claude Code + Local Qwen setup.**

---

## 📋 One-Page Setup Checklist

- [ ] Install Ollama from https://ollama.ai
- [ ] Download Qwen: `ollama pull qwen3-coder:30b`
- [ ] Install Node.js from https://nodejs.org
- [ ] Install Claude Code: `npm install -g @anthropic-ai/claude-code`
- [ ] Set environment variables (3 commands below)
- [ ] Test: `claude --model qwen3-coder:30b`
- [ ] Install VS Code extension (optional)
- [ ] Configure VS Code (3 settings below)

---

## 🔧 Copy-Paste Commands

### Download Qwen Model

```powershell
ollama pull qwen3-coder:30b
```

### Install Claude Code

```powershell
npm install -g @anthropic-ai/claude-code
```

### Set Environment Variables (run all 3)

```powershell
$env:ANTHROPIC_AUTH_TOKEN="ollama"
$env:ANTHROPIC_API_KEY=""
$env:ANTHROPIC_BASE_URL="http://localhost:11434/v1"
```

### Launch Claude Code

```powershell
claude --model qwen3-coder:30b
```

### Check What Models You Have

```powershell
ollama list
```

### Remove a Model (free disk space)

```powershell
ollama rm qwen3-coder:30b
```

---

## 📱 VS Code Configuration

**3 settings to update in VS Code:**

1. **Press `Ctrl + ,`** (Settings)
2. **Search:** `claude`
3. **Set these fields:**

```
Claude: API Key = (leave empty)
Claude: API URL = http://localhost:11434/v1
Claude: Model = qwen3-coder:30b
```

---

## 🎮 Common Commands

### Check Ollama Version
```powershell
ollama --version
```

### Check Node.js Version
```powershell
node --version
```

### Check Claude Code Version
```powershell
claude --version
```

### Launch with Different Model
```powershell
claude --model qwen2.5-coder:7b
claude --model mistral:7b
```

### Exit Claude Code
```
Ctrl + C
```

---

## 🆘 Troubleshooting Checklist

**If something isn't working, run these in order:**

1. Check versions:
   ```powershell
   ollama --version
   node --version
   claude --version
   ```

2. Check models:
   ```powershell
   ollama list
   ```

3. Check environment variables:
   ```powershell
   $env:ANTHROPIC_BASE_URL
   ```
   Should output: `http://localhost:11434/v1`

4. Verify Ollama running:
   ```powershell
   netstat -ano | findstr :11434
   ```

5. Restart PowerShell and try again

6. Restart Ollama (click icon in system tray)

7. Restart your computer

---

## 📊 Model Quick Reference

| Model | Size | Speed | Quality | Command |
|-------|------|-------|---------|---------|
| **Recommended** | 20GB | Med | ⭐⭐⭐⭐⭐ | `qwen3-coder:30b` |
| **Lightweight** | 4.7GB | Fast | ⭐⭐⭐⭐ | `qwen2.5-coder:7b` |
| **Fastest** | 4GB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | `mistral:7b` |
| **Powerful** | 40GB | Slow | ⭐⭐⭐⭐⭐ | `llama2:70b` |

---

## ⚙️ Environment Variables (Need to Run Each Session)

If you want them to persist, create a batch file:

**File: `claude-setup.bat`**

```batch
@echo off
setx ANTHROPIC_AUTH_TOKEN "ollama"
setx ANTHROPIC_API_KEY ""
setx ANTHROPIC_BASE_URL "http://localhost:11434/v1"
echo Environment variables set! Close and reopen PowerShell.
pause
```

Save this file and run it once. Then environment variables will persist.

---

## 🔗 Important Links

- **Ollama**: https://ollama.ai
- **Node.js**: https://nodejs.org
- **VS Code**: https://code.visualstudio.com
- **Claude Code Docs**: https://docs.anthropic.com

---

## 📞 Quick Help

**Problem → Solution**

| Issue | Quick Fix |
|-------|-----------|
| "command not found" | Restart PowerShell |
| Slow responses | Close other apps, restart Ollama |
| Model not found | Run `ollama pull qwen3-coder:30b` |
| Won't connect | Verify `$env:ANTHROPIC_BASE_URL` is set |
| Out of RAM | Use `qwen2.5-coder:7b` instead |
| Disk full | Run `ollama rm qwen3-coder:30b` |

---

## 🎯 Pro Tips

1. **Set environment variables automatically:**
   - Create a `.cmd` file that sets them
   - Run it once, then they persist

2. **Use different models:**
   - Start with `qwen2.5-coder:7b` (fast!)
   - Upgrade to `qwen3-coder:30b` if needed

3. **Free up disk space:**
   ```powershell
   ollama rm qwen3-coder:30b
   ```
   (You can reinstall anytime)

4. **Work offline:**
   - Once setup, turn off WiFi
   - Everything works perfectly offline!

5. **VS Code shortcuts:**
   - `Ctrl + Shift + X` = Extensions
   - `Ctrl + ,` = Settings
   - `Ctrl + K, Ctrl + W` = Close settings

---

## 📚 Which Guide to Read?

- **Just getting started?** → Read **SETUP_GUIDE.md**
- **Something isn't working?** → Read **TROUBLESHOOTING.md**
- **Want different model?** → Read **ALTERNATIVES.md**
- **Want full details?** → Read **README.md**
- **Need quick reference?** → You're reading it! 👈

---

## ✅ Success Checklist

After setup, you should be able to:

- [ ] Run `claude --version` (shows Claude Code 2.1.114)
- [ ] Run `claude --model qwen3-coder:30b` (launches Claude)
- [ ] Type "hello" and get a response
- [ ] Open code in VS Code and ask Claude questions
- [ ] Work completely offline

---

## 🚀 Next Steps

1. **Finish setup** using SETUP_GUIDE.md
2. **Build something** - start with a simple script
3. **Share with friends** - give them this repo!
4. **Star this repo** ⭐ if it helped!

---

**You've got this!** 💪

Need more help? Check the full documentation above!
