# 🌌 3D Animated Developer Portfolio

An immersive, single-page developer portfolio featuring a scroll-driven 3D scene built with **Three.js** — no build step required.

## ✨ Features

- **Scroll-driven 3D camera** — the camera flies through a WebGL scene as you scroll (starfield, wireframe icosahedron, torus knot, floating geometry, neon grid)
- **Mouse parallax** — the whole scene subtly reacts to cursor movement
- **Typed-text hero** with rotating phrases and a glitch hover effect on the name
- **3D tilt cards** for skills & projects
- **Terminal-style about card**, reveal-on-scroll animations, animated skill bars
- **Fully responsive** with a mobile slide-in menu
- **Zero build tooling** — plain HTML/CSS/JS with Three.js loaded via import map

## 🚀 Run locally

Any static server works:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then open http://localhost:8000

## 🗂 Structure

```
├── index.html      # Page markup
├── css/style.css   # Styling & CSS animations
└── js/main.js      # Three.js scene + UI interactions
```

## 🛠 Customize

- Change name/text in `index.html`
- Tweak colors via CSS variables in `css/style.css` (`--accent`, `--bg`, …)
- Adjust the 3D scene (objects, camera path, particles) in `js/main.js`
