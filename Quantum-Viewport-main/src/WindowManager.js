
class WindowManager {
    constructor() {
        this.windows = [];
        this.count = 1;
        this.id = 0;
        this.winShape = { x: 0, y: 0, w: 0, h: 0 };
        this.winData = [];
        this.winShapeChangeCallback = null;
        this.winChangeCallback = null;
    }

    init() {
        this._setupLocalStorage();
        this._addEventListeners();
    }

    setWinShapeChangeCallback(callback) {
        this.winShapeChangeCallback = callback;
    }

    setWinChangeCallback(callback) {
        this.winChangeCallback = callback;
    }

    setCustomData(data) {
        this.winData = data;
    }

    _setupLocalStorage() {
        const storedId = sessionStorage.getItem("winId");
        if (storedId) {
            this.id = parseInt(storedId);
        } else {
            this.id = Date.now() + Math.random(); // Simple unique ID
            sessionStorage.setItem("winId", this.id);
        }
    }

    _addEventListeners() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'windows') {
                const newWindows = JSON.parse(event.newValue);
                this.count = newWindows.length;
                this.windows = newWindows;
                if (this.winChangeCallback) this.winChangeCallback();
            }
        });

        window.addEventListener('beforeunload', () => {
            const index = this.getWinIndex();
            if (index !== -1) {
                const wins = this.getWindows();
                wins.splice(index, 1);
                localStorage.setItem("windows", JSON.stringify(wins));
            }
        });
    }

    getWindows() {
        return JSON.parse(localStorage.getItem("windows") || "[]");
    }

    update() {
        const wins = this.getWindows();
        const index = wins.findIndex((w) => w.id === this.id);

        // Detect shape change
        const newShape = {
            x: window.screenX,
            y: window.screenY,
            w: window.innerWidth,
            h: window.innerHeight,
        };

        if (this.winShape.x !== newShape.x || this.winShape.y !== newShape.y || this.winShape.w !== newShape.w || this.winShape.h !== newShape.h) {
            this.winShape = newShape;
            if (this.winShapeChangeCallback) this.winShapeChangeCallback();
        }

        const winData = {
            id: this.id,
            shape: this.winShape,
            meta: this.winData,
            updated: Date.now()
        };

        if (index !== -1) {
            wins[index] = winData;
        } else {
            wins.push(winData);
        }

        // Prune stalled windows (older than 2 seconds)
        const now = Date.now();
        // Keep windows that have updated recently OR are ourself
        const activeWins = wins.filter(w => (now - w.updated) < 2000 || w.id === this.id);

        // Sort by ID to keep order consistent
        activeWins.sort((a, b) => a.id - b.id);

        localStorage.setItem("windows", JSON.stringify(activeWins));
        this.windows = activeWins;
        this.count = activeWins.length;
    }

    getWinIndex() {
        return this.windows.findIndex((w) => w.id === this.id);
    }
}

export default WindowManager;
