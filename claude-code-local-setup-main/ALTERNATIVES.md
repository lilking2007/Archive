# 🎯 Alternative Models & Options

**Don't have to use Qwen3-coder:30b? Here are all your options!**

---

## Model Comparison Chart

| Model | Size | Speed | Quality | Best For | Command |
|-------|------|-------|---------|----------|---------|
| **Qwen3-coder:30b** | 20GB | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Complex coding, apps | `claude --model qwen3-coder:30b` |
| **Qwen2.5-coder:7b** | 4.7GB | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Quick tasks, limited RAM | `claude --model qwen2.5-coder:7b` |
| **Llama2:70b** | 40GB | ⭐⭐ | ⭐⭐⭐⭐ | General purpose | `claude --model llama2:70b` |
| **Mistral:7b** | 4GB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Lightweight, fast | `claude --model mistral:7b` |
| **DeepSeek-Coder** | 6GB | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Coding focus | `ollama pull deepseek-coder` |

---

## Recommended Options by Use Case

### 💻 You Have 16GB+ RAM (RECOMMENDED)

**→ Use: Qwen3-coder:30b**

This is the best overall model for:
- Building complex applications
- Professional coding tasks
- Advanced debugging
- Long projects

```powershell
ollama pull qwen3-coder:30b
claude --model qwen3-coder:30b
```

---

### 💾 You Have 8-12GB RAM

**→ Use: Qwen2.5-coder:7b**

Excellent balance of:
- Fast downloads (4.7GB)
- Fast responses (⭐⭐⭐⭐)
- High quality (⭐⭐⭐⭐)
- Works smoothly on limited hardware

```powershell
ollama pull qwen2.5-coder:7b
claude --model qwen2.5-coder:7b
```

---

### ⚡ You Want Maximum Speed

**→ Use: Mistral:7b**

Fastest model available:
- Only 4GB
- Instant responses
- Still good quality
- Great for learning

```powershell
ollama pull mistral:7b
claude --model mistral:7b
```

---

### 🚀 You Have 32GB+ RAM & Need Maximum Power

**→ Use: Llama2:70b**

Most powerful available:
- 70 billion parameters
- Best reasoning
- Best quality
- Slowest (requires powerful CPU/GPU)

```powershell
ollama pull llama2:70b
claude --model llama2:70b
```

---

## How to Switch Models

### Step 1: Install Another Model

```powershell
ollama pull qwen2.5-coder:7b
```

### Step 2: List All Your Models

```powershell
ollama list
```

You'll see all downloaded models.

### Step 3: Use a Different Model

```powershell
claude --model qwen2.5-coder:7b
```

### Step 4: Or Update Environment for VS Code

If using VS Code, update the settings:

1. Press `Ctrl + ,`
2. Search: `claude`
3. Change **Claude: Model** to your new model name
4. Restart VS Code

---

## Detailed Model Reviews

### Qwen3-coder:30b ⭐⭐⭐⭐⭐ (BEST OVERALL)

**Download:**
```powershell
ollama pull qwen3-coder:30b
```

**Pros:**
- Excellent code generation
- Great debugging
- Handles complex problems
- Best accuracy
- Professional quality

**Cons:**
- 20GB download (slow internet = painful)
- Uses more RAM/CPU
- Slower responses (~5-10 seconds)

**Best For:** Professional projects, complex apps, serious developers

**Rating:** 9/10 overall

---

### Qwen2.5-coder:7b ⭐⭐⭐⭐ (BEST BALANCED)

**Download:**
```powershell
ollama pull qwen2.5-coder:7b
```

**Pros:**
- Only 4.7GB (fast download!)
- Quick responses
- Still high quality
- Works on limited hardware
- Good for learning

**Cons:**
- Not quite as powerful as 30b
- Some complex tasks may need help

**Best For:** Learning, quick tasks, limited hardware

**Rating:** 8/10 overall

---

### Mistral:7b ⭐⭐⭐ (FASTEST)

**Download:**
```powershell
ollama pull mistral:7b
```

**Pros:**
- Only 4GB!
- Blazing fast
- Great for casual use
- Lowest hardware requirements
- Good for scripting

**Cons:**
- Not specialized for coding
- Less accurate than coding-specific models

**Best For:** Casual coding, quick scripts, learning

**Rating:** 7/10 overall

---

### Llama2:70b ⭐⭐⭐⭐⭐ (MOST POWERFUL)

**Download:**
```powershell
ollama pull llama2:70b
```

**Pros:**
- Most powerful model available
- Best reasoning
- Excellent quality
- Open source
- Handles anything

**Cons:**
- 40GB (huge download)
- Slow responses
- Requires powerful hardware
- High CPU usage

**Best For:** Complex problems, research, heavy computing

**Rating:** 9/10 quality, 5/10 practicality

---

### DeepSeek-Coder ⭐⭐⭐⭐ (CODING FOCUSED)

**Download:**
```powershell
ollama pull deepseek-coder
```

**Pros:**
- Specialized for coding
- Good quality
- Reasonable size
- Fast responses

**Cons:**
- Less general purpose
- Smaller community

**Best For:** Pure coding tasks

**Rating:** 8/10 for coding

---

## Cloud Models (If Internet Available)

If you want to use cloud-based models through Ollama:

```powershell
ollama pull qwen3-coder:480b-cloud
claude --model qwen3-coder:480b-cloud
```

**Pros:**
- No local storage needed
- Most powerful models
- Always latest version

**Cons:**
- Requires internet
- May have usage limits
- Not truly "local"

---

## Comparison for Common Tasks

### Writing a Website

**Qwen3-coder:30b**: ⭐⭐⭐⭐⭐ (Best)  
**Qwen2.5-coder:7b**: ⭐⭐⭐⭐ (Great)  
**Mistral:7b**: ⭐⭐⭐ (Good)  

### Quick Bug Fix

**Qwen3-coder:30b**: ⭐⭐⭐⭐⭐  
**Qwen2.5-coder:7b**: ⭐⭐⭐⭐⭐ (Fast!)  
**Mistral:7b**: ⭐⭐⭐⭐⭐ (Fastest!)  

### Learning to Code

**Qwen2.5-coder:7b**: ⭐⭐⭐⭐⭐ (Best balance)  
**Mistral:7b**: ⭐⭐⭐⭐ (Fast & fun)  
**Qwen3-coder:30b**: ⭐⭐⭐ (Overkill)  

### Complex Application

**Qwen3-coder:30b**: ⭐⭐⭐⭐⭐ (Essential)  
**Llama2:70b**: ⭐⭐⭐⭐⭐ (Best)  
**Qwen2.5-coder:7b**: ⭐⭐⭐ (May struggle)  

---

## How to Remove Models

If you want to free up disk space:

```powershell
ollama rm qwen3-coder:30b
```

This removes the model from disk but you can reinstall anytime.

---

## Switching Models Mid-Session

You can change models without restarting:

1. Exit Claude Code (Ctrl + C)
2. Run: `claude --model mistral:7b`
3. You're now using Mistral!

---

## My Recommendations

**For Most People:** Qwen3-coder:30b or Qwen2.5-coder:7b

**For Laptops:** Qwen2.5-coder:7b

**For Learning:** Mistral:7b

**For Professional Work:** Qwen3-coder:30b

**For Maximum Power:** Llama2:70b

---

## Still Unsure?

**Start with Qwen2.5-coder:7b** (4.7GB) and upgrade later if needed!

It's a safe, fast, and high-quality option that works well for 90% of tasks.

---

Need more info? See main **[README.md](./README.md)**
