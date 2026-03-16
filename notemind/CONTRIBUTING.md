# Contributing to NoteMind

Thank you for your interest in contributing. Here is how to get involved.

## Getting started

```bash
git clone https://github.com/YOUR_USERNAME/notemind.git
cd notemind
```

Set up the Python server locally:
```bash
cd server
pip install -r requirements.txt
```

Load the extension in Chrome:
1. Go to `chrome://extensions/`
2. Enable Developer mode
3. Click Load unpacked → select the `extension/` folder

## How to contribute

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test the extension manually in Chrome
5. Commit: `git commit -m "describe your change"`
6. Push: `git push origin feature/your-feature`
7. Open a pull request

## What we welcome

- Bug fixes
- Accuracy improvements to speaker assignment
- Support for additional languages
- UI improvements
- New export formats (Google Docs, Notion, Markdown)
- Firefox/Edge compatibility
- Desktop app (Electron) work

## Code style

- Python: follow PEP 8, max line length 120
- JavaScript: plain ES2020, no build step required
- CSS: BEM-style class names, CSS variables for all colours

## Reporting bugs

Open an issue and include:
- Your OS and Chrome version
- Whether the server is running (check the terminal output)
- The exact error message if any
- Steps to reproduce

## Questions

Open a GitHub Discussion or an issue tagged `question`.
