# 🌌 Quantum Viewport: Multi-Window 3D Galaxy

> A distributed 3D rendering experiment where multiple browser windows act as dynamic viewports into a shared, synchronized galaxy.

![Project Demo](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)

## 🚀 Concept

What if your browser window wasn't the container of the world, but just a moving camera *over* it?

**Quantum Viewport** creates a single, persistent 3D galaxy that exists "behind" your screen. By opening multiple windows and moving them around your monitor, you pan around this shared space.

When windows get close to each other, they establish **Gravitational Tethers**, visualizing the networking and proximity between your active viewports.

## ✨ Features

- **Multi-Window Synchronization**: Uses `LocalStorage` events to sync state instantly between windows without a backend server.
- **Dynamic Window Tracking**: Real-time updates of window position (`screenX`, `screenY`) to adjust the 3D camera offset.
- **Particle Galaxy**: A procedural spiral galaxy with 15k+ particles.
- **Proximity Effects**: Visual connections drawn between windows when they physically approach each other on your screen.
- **Three.js Core**: High-performance WebGL rendering.

## 🛠️ Technology Stack

- **Three.js**: 3D Rendering Engine.
- **Vanilla JavaScript**: No framework overhead.
- **LocalStorage API**: For cross-window state management.
- **Vite** (Optional): For development tooling.

## 📦 How to Run

Since this project relies on modern browser module imports, it must be served via a local web server (opening `index.html` directly won't work due to CORS policies).

### Option 1: Python (Easiest)
If you have Python installed:
```bash
# Navigate to the project folder
cd "path/to/project"

# Start a simple HTTP server
python -m http.server 8000
```
Then open **[http://localhost:8000](http://localhost:8000)** in Chrome/Firefox.

### Option 2: Node.js / VS Code
If you use VS Code, install the "Live Server" extension and click "Go Live".
Or use `http-server`:
```bash
npx http-server .
```

## 🎮 Usage

1. Open the URL in a browser window.
2. **Open a second window** (Ctrl+N) to the same URL.
3. Place them side-by-side or move them around.
4. Watch the galaxy remain static while your windows act as moving lenses!
5. Move windows close together to see the **Gravitational Link**.

## 📝 License

MIT

