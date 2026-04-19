# 🤖 Claude Code with Local Qwen - Complete Setup Guide

**Run Claude Code 100% locally on your machine with Qwen3-coder:30b — No API costs, No token limits, Completely offline!**

![Status](https://img.shields.io/badge/Status-Tested%20&%20Working-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Python](https://img.shields.io/badge/Claude%20Code-v2.1.114-orange)

---

## 📋 Table of Contents

- [What Is This?](#what-is-this)
- [System Requirements](#system-requirements)
- [Quick Start (15 minutes)](#quick-start-15-minutes)
- [Detailed Setup Guide](#detailed-setup-guide)
- [VS Code GUI Setup](#vs-code-gui-setup)
- [Troubleshooting](#troubleshooting)
- [Alternative Models](#alternative-models)
- [FAQ](#faq)

---

## What Is This?

This repository provides **step-by-step instructions** to set up **Claude Code** (Anthropic's AI coding tool) running **locally** on your machine with the **Qwen3-coder:30b** model.

### What You Get:

✅ **Claude Code** - Anthropic's powerful AI coding assistant  
✅ **Local Qwen3-coder:30b** - Running entirely on your laptop  
✅ **No API Costs** - Zero bills, unlimited usage  
✅ **No Token Limits** - Use it 24/7 without restrictions  
✅ **100% Offline** - Works without internet (after setup)  
✅ **Private** - Your code stays on your machine  
✅ **Beautiful GUI** - VS Code extension with full editor integration  

### Use Cases:

- 🏗️ Build web apps and APIs
- 🤖 Automate repetitive tasks
- 🔧 Debug and fix code
- 📚 Learn programming
- 🔐 Cybersecurity scripting
- 📱 Create full applications
- ⚡ Control your laptop like JARVIS

---

## System Requirements

### Hardware (Minimum):

- **RAM**: 16GB (minimum, 32GB+ recommended)
- **Storage**: 30GB free (for models and OS)
- **Processor**: Intel i7 or equivalent (modern CPU)
- **Internet**: Required during setup only

### Software:

- **OS**: Windows 10/11, macOS, or Linux
- **Node.js**: v18.0.0+ (for Claude Code)
- **Ollama**: Latest version

### Tested Configuration:

✅ **Dell Latitude 5320**  
✅ **Intel i7**  
✅ **16GB RAM**  
✅ **Windows 11**  

---

## Quick Start (15 minutes)

### Step 1: Install Ollama
Download from: https://ollama.ai

### Step 2: Download Qwen Model
Open PowerShell and run:
```powershell
ollama pull qwen3-coder:30b
```
⏱️ **Time**: 15-20 minutes on average internet

### Step 3: Install Claude Code
```powershell
npm install -g @anthropic-ai/claude-code
```

### Step 4: Configure for Local Use
```powershell
$env:ANTHROPIC_AUTH_TOKEN="ollama"
$env:ANTHROPIC_API_KEY=""
$env:ANTHROPIC_BASE_URL="http://localhost:11434/v1"
```

### Step 5: Launch
```powershell
claude --model qwen3-coder:30b
```

✅ **Done!** You now have Claude Code running locally!

---

## Detailed Setup Guide

### Full Step-by-Step Instructions

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for complete installation walkthrough with screenshots and troubleshooting for each step.

---

## VS Code GUI Setup

Once Claude Code is working in the terminal, you can add the beautiful VS Code extension:

### Installation:

1. **Open VS Code**
2. **Press `Ctrl + Shift + X`** (Extensions)
3. **Search**: `Claude Code`
4. **Install** the official Anthropic extension

### Configuration:

1. **Press `Ctrl + ,`** (Settings)
2. **Search**: `claude`
3. **Set these fields**:

| Setting | Value |
|---------|-------|
| Claude: API Key | (leave empty) |
| Claude: API URL | `http://localhost:11434/v1` |
| Claude: Model | `qwen3-coder:30b` |

✅ **Done!** Claude Code now works in VS Code with a beautiful GUI!

---

## Model Performance

### Qwen3-coder:30b (Recommended)

- **Performance Tier**: ⭐⭐⭐⭐ (Tier 2 - Excellent)
- **Capability**: ~85-90% as capable as Claude 3.5 Sonnet
- **Size**: ~20GB
- **Speed**: Fast on 16GB RAM with i7
- **Best For**: Complex apps, automation, coding tasks

### Alternative Models:

**Qwen2.5-coder:7b** (Lightweight)
- Size: ~4.7GB
- Capability: ~75-80% as capable
- Speed: Faster, lighter
- Best For: Quick tasks, limited hardware

See **[ALTERNATIVES.md](./ALTERNATIVES.md)** for other model options.

---

## Troubleshooting

### Issue: "ollama: command not found"

**Solution**: Ollama isn't in your PATH. Restart PowerShell or your computer.

### Issue: Claude Code won't connect to Qwen

**Solution**: Verify Ollama is running and check environment variables are set correctly:
```powershell
$env:ANTHROPIC_BASE_URL
```
Should output: `http://localhost:11434/v1`

### Issue: "Port 11434 already in use"

**Solution**: Ollama is already running in the background. Check:
```powershell
netstat -ano | findstr :11434
```

### Issue: Slow responses from Qwen

**Solution**: Your system is under heavy load. Close other applications or restart Ollama.

See **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** for more solutions.

---

## Alternative Models

You don't have to use Qwen3-coder:30b! Here are other options:

### Option A: Lighter Alternative
```powershell
ollama pull qwen2.5-coder:7b
claude --model qwen2.5-coder:7b
```
✅ Smaller (4.7GB)  
✅ Faster  
✅ Still excellent  

### Option B: Different Architecture
```powershell
ollama pull llama2:70b
claude --model llama2:70b
```

### Option C: Cloud Models (if internet available)
```powershell
ollama pull gpt-oss:20b-cloud
claude --model gpt-oss:20b-cloud
```

See **[ALTERNATIVES.md](./ALTERNATIVES.md)** for complete list and recommendations.

---

## Working Offline

Once setup is complete, Claude Code works **100% offline**:

✅ **Turn off WiFi**  
✅ **Enable Airplane Mode**  
✅ **Everything still works!**

Why? Because `localhost:11434` points to YOUR machine, not the cloud.

---

## FAQ

**Q: Will this cost money?**  
A: Zero cost! Everything runs locally.

**Q: Can I use this for commercial projects?**  
A: Yes! It's completely private and yours to use.

**Q: What if I need more powerful models later?**  
A: You can upgrade to Claude API (paid) when you have income.

**Q: How do I uninstall?**  
A: 
```powershell
npm uninstall -g @anthropic-ai/claude-code
ollama rm qwen3-coder:30b
```

**Q: Can my friend use this guide?**  
A: Yes! Share this entire repository. It's designed for that.

**Q: What if I get stuck?**  
A: See **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** or open an issue.

---

## Next Steps

1. **Follow [SETUP_GUIDE.md](./SETUP_GUIDE.md)** for detailed installation
2. **Install VS Code extension** for GUI
3. **Start building projects!** 🚀
4. **Share this repo** with friends

---

## Contributing

Found an issue or improvement? Let me know!

---

## License

MIT License - Free to use and share

---

## Support

- 📖 Read the guides
- 🐛 Check troubleshooting
- 🤝 Share with friends
- ⭐ Star this repo!

---

**Happy coding!** 🚀

Made with ❤️ for developers building locally.
