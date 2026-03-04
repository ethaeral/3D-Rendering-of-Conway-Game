# 3D Rendering of Conway's Game of Life

## Demo
https://rainbowoflife.vercel.app/

![ScreenShot of rainbowoflife](./rainbowoflife.png)

## Features
- **Two renderers:** DOM (CSS 3D) or WebGL (React Three Fiber + Three.js) for better performance on large grids
- Rotate animation
- Automate Game of Life rules (runs in a Web Worker so the UI stays responsive)
- Toggle outlines
- Customize grid size (slider)

## Get Started
```bash
npm i
npm start
```

## Conway's Game of Life
https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life

## Dependencies
- React
- Styled Components
- React Three Fiber & Three.js (WebGL view; uses Three.js OrbitControls directly, not @react-three/drei). Fiber is a React renderer and pairs with a major React version: **@react-three/fiber@8** ↔ React 18, **@react-three/fiber@9** ↔ React 19.
- Comlink (Web Worker for Conway step)
- Vite, TypeScript
