# 📚 Detailed Setup Guide - Claude Code with Local Qwen

**Complete walkthrough with all steps, options, and troubleshooting.**

---

## Table of Contents

1. [Prerequisites Check](#prerequisites-check)
2. [Step 1: Install Ollama](#step-1-install-ollama)
3. [Step 2: Download Qwen Model](#step-2-download-qwen-model)
4. [Step 3: Install Node.js (if needed)](#step-3-install-nodejs-if-needed)
5. [Step 4: Install Claude Code](#step-4-install-claude-code)
6. [Step 5: Configure for Local Use](#step-5-configure-for-local-use)
7. [Step 6: Test It Works](#step-6-test-it-works)
8. [Step 7: Install VS Code Extension (Optional GUI)](#step-7-install-vs-code-extension-optional-gui)
9. [Verification Checklist](#verification-checklist)

---

## Prerequisites Check

Before you start, verify you have:

### Hardware Check:
```
- RAM: Run this in PowerShell to check:
  (Get-ComputerInfo).TotalPhysicalMemory / 1GB
  
  Should be: 16GB or higher
```

```
- Storage: Check free disk space:
  Get-Volume
  
  Should have: 30GB+ free space
```

```
- Internet: Required for setup (afterwards optional)
```

### Software Check:
- Windows 10/11, macOS, or Linux ✅
- Administrator access to install software ✅

---

## Step 1: Install Ollama

**What is Ollama?**  
Ollama is the engine that runs AI models locally on your machine.

### For Windows:

1. Go to: https://ollama.ai
2. Click **"Download"** for Windows
3. Run the installer
4. Follow the installation wizard (use default settings)
5. Restart your computer when prompted

### Verify Installation:

Open PowerShell and run:
```powershell
ollama --version
```

You should see something like:
```
ollama version 0.3.4
```

✅ **Ollama is installed!**

---

## Step 2: Download Qwen Model

**What is Qwen?**  
Qwen3-coder:30b is a powerful AI coding model (~20GB).

### Download Qwen:

Open PowerShell and run:
```powershell
ollama pull qwen3-coder:30b
```

### What You'll See:

```
pulling manifest
pulling 119d192cf2a1: 8%
pulling 11ce4ee3e170: 100%
...
writing manifest
success
```

⏱️ **Time**: 15-30 minutes depending on internet speed

### If Download is Slow:

Your internet might be slow. **DO NOT CANCEL!** Just wait. It will eventually complete.

**Alternative (Smaller Model):**
If you want a faster download:
```powershell
ollama pull qwen2.5-coder:7b
```
This is only 4.7GB instead of 20GB.

### Verify Download:

Once complete, check it's installed:
```powershell
ollama list
```

You should see:
```
NAME                    ID              SIZE
qwen3-coder:30b        119d192cf2a1    20GB
```

✅ **Qwen is downloaded!**

---

## Step 3: Install Node.js (if needed)

**What is Node.js?**  
Node.js allows us to install Claude Code via npm.

### Check if You Have Node.js:

Open PowerShell and run:
```powershell
node --version
```

If you see a version number (like `v24.15.0`), **skip to Step 4** — you already have it!

### If Node.js is Not Installed:

1. Go to: https://nodejs.org
2. Click **"Download"** (current/LTS version)
3. Run the installer
4. Click **"Next"** through all screens (use defaults)
5. When installation finishes, **restart PowerShell**

### Verify Installation:

```powershell
node --version
npm --version
```

Both should show version numbers.

✅ **Node.js is installed!**

---

## Step 4: Install Claude Code

### Fix PowerShell Execution Policy:

You may need to allow PowerShell to run scripts:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

When asked, type **Y** and press Enter.

### Install Claude Code via NPM:

```powershell
npm install -g @anthropic-ai/claude-code
```

### What You'll See:

```
added 2 packages in 43s
```

### Verify Installation:

```powershell
claude --version
```

Should show: `Claude Code v2.1.114`

✅ **Claude Code is installed!**

---

## Step 5: Configure for Local Use

**What This Does:**  
This tells Claude Code to use YOUR local Qwen model instead of Anthropic's cloud API.

### Set Environment Variables:

In PowerShell, run these **3 commands in order**:

**Command 1:**
```powershell
$env:ANTHROPIC_AUTH_TOKEN="ollama"
```

**Command 2:**
```powershell
$env:ANTHROPIC_API_KEY=""
```

**Command 3:**
```powershell
$env:ANTHROPIC_BASE_URL="http://localhost:11434/v1"
```

### What Each One Does:

- **ANTHROPIC_AUTH_TOKEN**: Tells Claude Code to use local Ollama instead of cloud
- **ANTHROPIC_API_KEY**: Left empty (not needed for local)
- **ANTHROPIC_BASE_URL**: Points to YOUR machine's Ollama (localhost:11434)

✅ **Claude Code is configured!**

---

## Step 6: Test It Works

### Launch Claude Code:

```powershell
claude --model qwen3-coder:30b
```

### You Should See:

```
━━━ Claude Code v2.1.114 ━━━

Welcome back!

qwen3-coder:30b • API Usage Billing

>>>
```

### Test It:

Type this:
```
hello, can you help me?
```

Press Enter.

### Expected Response:

Claude should respond with something like:
```
Hello! I'd be happy to help you with anything you need. 
Whether it's coding, answering questions, or working on a project, 
I'm here to assist. What would you like help with?
```

### Exit Claude Code:

Press **Ctrl + C** to exit.

✅ **Claude Code works with local Qwen!**

---

## Step 7: Install VS Code Extension (Optional GUI)

**Why do this?**  
The VS Code extension gives you a beautiful GUI editor instead of just terminal.

### Requirements:

- VS Code installed (download from https://code.visualstudio.com if not)

### Installation Steps:

**Step 1:** Open Visual Studio Code

**Step 2:** Press **`Ctrl + Shift + X`** (opens Extensions panel)

**Step 3:** In the search box, type:
```
Claude Code
```

**Step 4:** Find the official extension by **Anthropic** (blue/red icon)

**Step 5:** Click **"Install"**

Wait for installation to complete (2-3 minutes).

### Configure VS Code:

**Step 1:** Press **`Ctrl + ,`** (opens Settings)

**Step 2:** Search for: `claude`

**Step 3:** You'll see Claude extension settings. Find and fill these fields:

#### Field 1: Claude: API Key
- Leave it **EMPTY** (don't put anything)

#### Field 2: Claude: API URL
- Paste: `http://localhost:11434/v1`

#### Field 3: Claude: Model
- Paste: `qwen3-coder:30b`

**Step 4:** Close Settings (Ctrl + K, Ctrl + W)

### Test in VS Code:

**Step 1:** Create a new file (Ctrl + N)

**Step 2:** Type some code or ask Claude a question in the Claude sidebar

**Step 3:** Claude should respond instantly!

✅ **VS Code extension is working!**

---

## Verification Checklist

Complete this checklist to ensure everything is set up correctly:

- [ ] Ollama installed (`ollama --version` works)
- [ ] Qwen model downloaded (`ollama list` shows qwen3-coder:30b)
- [ ] Node.js installed (`node --version` works)
- [ ] Claude Code installed (`claude --version` works)
- [ ] Environment variables set correctly
- [ ] Claude Code launches: `claude --model qwen3-coder:30b`
- [ ] Claude responds to "hello"
- [ ] VS Code extension installed (optional but recommended)
- [ ] VS Code settings configured correctly

---

## Next Steps

Once everything is verified:

1. **Start Building**: Create your first project!
2. **Read the FAQ**: See main README.md
3. **Share This Guide**: Help your friends set up too!

---

## Common Errors & Solutions

### Error: "ollama: command not found"

**Cause**: Ollama isn't in your PATH  
**Solution**: Restart PowerShell and try again

### Error: Claude Code won't launch

**Cause**: Environment variables not set  
**Solution**: Make sure you ran all 3 environment variable commands

### Error: "Connection refused on localhost:11434"

**Cause**: Ollama isn't running  
**Solution**: Make sure Ollama is running in the background

### Error: "Model not found"

**Cause**: Qwen wasn't fully downloaded  
**Solution**: Run `ollama pull qwen3-coder:30b` again

---

## Got Stuck?

See **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** for more detailed solutions!

---

**You're all set!** 🚀 Happy coding!
