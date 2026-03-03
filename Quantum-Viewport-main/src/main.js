import WindowManager from './WindowManager.js';
import * as THREE from 'three';

const t = THREE;
let camera, scene, renderer, world;
let near, far;
let pixR = window.devicePixelRatio ? window.devicePixelRatio : 1;
let windowManager;
let galaxyParticles;
let connections = new t.Group();

// World Stats (Default to standard 1920x1080 center if detecting fails)
let worldCenter = { x: window.screen.availWidth / 2, y: window.screen.availHeight / 2 };

// Time
let lastTime = Date.now();

if (new URLSearchParams(window.location.search).get("clear")) {
    localStorage.clear();
} else {
    init();
}

function init() {
    // 1. Setup Window Manager
    windowManager = new WindowManager();
    windowManager.init();

    // 2. Setup Three.js
    setupScene();

    // 3. Start Loop
    render();
}

function setupScene() {
    // We use a system where 1 Unit = 1 Pixel
    // Origin (0,0) is Top-Left of the Monitor
    // Y increases Downwards

    // Orthographic Camera wrapping the current window viewport
    camera = new t.OrthographicCamera(
        0, window.innerWidth, 0, window.innerHeight, -1000, 1000
    );

    // We will manually position the Objects in front of the camera, 
    // instead of moving the camera to the world coordinates.
    // Why? Because Three.js OrthoCam 0,0 is usually center.
    // Easier approach:
    // Camera is static at 0,0 (Top-Left of Window).
    // We move the WORLD opposite to the Window Position.

    // Actually, let's stick to the previous robust model but debugged:
    // Camera stays at (0,0) looking at (0,0).
    // Camera Left=0, Right=Width, Top=0, Bottom=Height.
    // This perfectly maps to the window's coordinate system.

    scene = new t.Scene();
    scene.background = new t.Color(0x050510); // Deep Space
    scene.add(camera);

    renderer = new t.WebGLRenderer({ antialias: true, depthBuffer: true });
    renderer.setPixelRatio(pixR);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    world = new t.Group();
    scene.add(world);
    world.add(connections);

    // --- CREATE GALAXY ---
    createGalaxy();
}

function createGalaxy() {
    const particleCount = 15000; // Dense
    const geometry = new t.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const galaxyColorInside = new t.Color(0xff6030);
    const galaxyColorOutside = new t.Color(0x1b3984);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Radius
        const radius = Math.random() * Math.min(window.screen.availWidth, window.screen.availHeight) * 0.8;
        // Spiral Angle
        const spinAngle = radius * 0.002;
        // Randomness
        const branchAngle = (i % 3) * ((2 * Math.PI) / 3);

        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 100;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 100;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 100;

        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX; // X
        positions[i3 + 1] = Math.sin(branchAngle + spinAngle) * radius + randomY; // Y
        positions[i3 + 2] = randomZ; // Z (Depth)

        // Color
        const mixedColor = galaxyColorInside.clone();
        mixedColor.lerp(galaxyColorOutside, radius / 1000);

        colors[i3 + 0] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;

        sizes[i] = Math.random() * 2;
    }

    geometry.setAttribute('position', new t.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new t.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new t.BufferAttribute(sizes, 1)); // We'll need a custom shader for explicit sizing or just use pointsmaterial size attenuation

    // Basic Points Material
    const material = new t.PointsMaterial({
        size: 3,
        sizeAttenuation: true,
        depthWrite: false,
        blending: t.AdditiveBlending,
        vertexColors: true
    });

    galaxyParticles = new t.Points(geometry, material);
    // Center the galaxy in the middle of the available screen space
    galaxyParticles.position.set(worldCenter.x, worldCenter.y, 0);
    world.add(galaxyParticles);
}

function updateWorldPosition() {
    // The MAGIC:
    // If the window is at Screen(100, 100), we want to see the part of the world at World(100, 100).
    // Since our Camera is fixed at 0,0 locally, we move the World by (-100, -100).
    // Y-Axis: In screen space, +Y is Down. In our setup, we made Camera Top=0, Bottom=Height.
    // So +Y is Down in our camera too.
    // So we just shift World by -window.screenX, -window.screenY.

    world.position.x = -window.screenX;
    world.position.y = -window.screenY;
}

function render() {
    const now = Date.now();
    const delta = (now - lastTime) * 0.001;
    lastTime = now;

    windowManager.update();
    const wins = windowManager.getWindows();

    // 1. Sync World Position to Window
    updateWorldPosition();

    // 2. Animate Galaxy
    if (galaxyParticles) {
        galaxyParticles.rotation.z += delta * 0.05; // Slow rotation
    }

    // 3. Gravity / Connections Logic
    // Clear old lines
    for (let i = connections.children.length - 1; i >= 0; i--) {
        const mesh = connections.children[i];
        mesh.geometry.dispose();
        mesh.material.dispose();
        connections.remove(mesh);
    }

    // Identify current window center in World Space
    const myCX = window.screenX + window.innerWidth / 2;
    const myCY = window.screenY + window.innerHeight / 2;

    const gravityThreshold = 800; // Pixel distance to trigger "Gravity" effect

    wins.forEach(win => {
        // Skip self
        if (win.id === windowManager.id) return;

        const otherCX = win.shape.x + win.shape.w / 2;
        const otherCY = win.shape.y + win.shape.h / 2;

        const dx = otherCX - myCX;
        const dy = otherCY - myCY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < gravityThreshold) {
            // Draw Gravitational Tether
            const points = [];

            // Draw a curve between them? Or straight line? 
            // Straight line for Beam
            points.push(new t.Vector3(myCX, myCY, 0));
            points.push(new t.Vector3(otherCX, otherCY, 0));

            const lineGeo = new t.BufferGeometry().setFromPoints(points);
            const lineMat = new t.LineBasicMaterial({
                color: 0xff00ff, // Magenta Gravity
                linewidth: 2,
                transparent: true,
                opacity: 1.0 - (dist / gravityThreshold) // Fade out as getting farther
            });
            const line = new t.Line(lineGeo, lineMat);
            connections.add(line);
        }
    });

    // 4. Debug Output
    const debugDiv = document.getElementById('debug');
    if (debugDiv) {
        debugDiv.innerText = `
        Screen: ${window.screenX}, ${window.screenY}
        Size: ${window.innerWidth}x${window.innerHeight}
        Windows: ${wins.length}
        Galaxy: ${worldCenter.x}, ${worldCenter.y}
        Distance to Core: ${Math.round(Math.sqrt(Math.pow(myCX - worldCenter.x, 2) + Math.pow(myCY - worldCenter.y, 2)))}
        `;
    }

    // 5. Render
    // Update camera ortho to handle resize locally
    camera.right = window.innerWidth;
    camera.bottom = window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
