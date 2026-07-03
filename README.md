# Three.js Learning Playground

A hands-on repo for learning **Three.js** fundamentals using **Vite** as the dev server/bundler. This project covers geometry, materials, lighting, PBR textures, camera controls, and a live debug GUI.

## 🛠️ Tech Stack

- [Vite](https://vite.dev) — dev server & bundler
- [Three.js](https://threejs.org) — 3D rendering (WebGL)
- [lil-gui](https://lil-gui.georgealways.com) — real-time debug/tweak panel
- Tailwind CSS — utility-first styling (for surrounding page UI, not the 3D canvas itself)

## 📦 Getting Started

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## 📁 Project Structure

```
public/            # static assets served as-is (raw string paths work here)
src/
  assets/
    textures/      # PBR texture maps (imported via ES modules, see below)
  main.js          # all Three.js scene code
  style.css        # global styles + Tailwind import
index.html
```

## 🎯 Topics Covered

### 1. Scene Basics
- `THREE.Scene`, `THREE.PerspectiveCamera`, `THREE.WebGLRenderer`
- Rendering to a `<canvas>` and keeping it responsive with a `resize` event listener

### 2. Geometries
Explored `BoxGeometry`, `SphereGeometry`, and `CylinderGeometry` — swapping shapes while keeping the same material/lighting setup.

### 3. Materials
- `MeshBasicMaterial` — flat, unlit, cheap (ignores all scene lighting)
- `MeshStandardMaterial` — PBR material that **requires lighting** to be visible; supports realistic properties like `roughness`, `metalness`, and texture maps

### 4. Lighting
Since `MeshStandardMaterial` needs light to render anything, the scene uses a mix of:
- `DirectionalLight` — simulates a distant light source (like the sun), casts light in one direction
- `AmbientLight` — soft, uniform light with no direction, lights the whole scene evenly
- `PointLight` — light radiating from a single point in space, with a `distance` param controlling how far its reach extends before cutting off
- Light Helpers (`DirectionalLightHelper`, `PointLightHelper`) — visualize where lights are positioned and aimed, used for debugging only

### 5. Textures (PBR Texture Maps)
Learned how a single texture pack breaks down into multiple maps, each controlling a different physical property:

| Map | Purpose |
|---|---|
| `color` (map) | The base color/pattern of the surface |
| `normal` | Fakes small bumps/details using lighting tricks, no real geometry change |
| `roughness` | Controls shiny vs. matte areas |
| `ao` (ambient occlusion) | Fake shadows in tiny crevices/folds |
| `height` (displacement) | Actually pushes geometry in/out based on brightness values |

**Important Vite gotcha:** files inside `src/` must be loaded via `import`, not plain string paths — Vite only rewrites `import` statements, not raw strings. Plain string paths only work for files inside `public/` (or the project root, in dev mode only — this breaks in production builds).

```js
import colorImg from './assets/textures/color.jpg'
const texture = new THREE.TextureLoader().load(colorImg)
```

### 6. Camera Controls — `OrbitControls`
Added mouse-drag orbiting with damping for smooth motion. 

**Key learning:** `OrbitControls` always orbits around a fixed `target` point (default `(0,0,0)`), *not* around the object itself. Moving an object away from the origin makes it swing in a wide arc when orbiting, since the object is now far from the fixed rotation center. Fix:

```js
controls.target.copy(cube.position)
controls.update()
```

### 7. Live Debug GUI — `lil-gui`
Used to tweak values (material properties, mesh transforms, light intensity/position) in real time without editing code and refreshing. Organized into folders: **Material**, **Mesh**, **Directional Light**, **Ambient Light**, **Point Light**.

```js
const gui = new lil.GUI()
const materialFolder = gui.addFolder('Material')
materialFolder.add(material, 'roughness', 0, 1, 0.01)
```

## 📝 Notes / Gotchas Learned

- `renderer.setSize(w, h)` writes an **inline pixel style** on the canvas by default, which overrides CSS sizing rules. Pass `false` as a 3rd argument to avoid this: `renderer.setSize(w, h, false)`.
- `displacementMap` is very sensitive — low-segment geometry + default `displacementScale` (1) can badly distort a mesh. Use more geometry segments and a small scale (e.g. `0.05`).
- `class` (not `className`) is the correct attribute in plain HTML — `className` is React/JSX-only.
- Always use the **OpenGL** normal map variant (not DirectX) for Three.js.

## 🚧 Status

Actively learning/experimenting — code is intentionally left with commented-out sections showing earlier steps and alternate geometries/materials tried along the way.
