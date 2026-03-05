# Project Structure (Bulletproof React)

This project follows the [bulletproof-react](https://github.com/alan2207/bulletproof-react/tree/master/docs) architecture.

```
src
├── app                    # Application layer
│   ├── app-styles.ts      # App-level layout styles
│   ├── app.tsx            # Main application component
│   ├── conway-layout.tsx  # Layout with sidebar + outlet
│   ├── app-sidebar.tsx    # Sidebar controls
│   ├── performance-bar.tsx
│   ├── provider.tsx      # Global providers & entry component
│   ├── routes.tsx        # Router configuration
│   ├── pages/            # Route targets (application routes)
│   │   └── conway-grid-outlet.tsx
│   └── use-performance-monitor.ts
├── assets                 # Static assets (images, fonts, etc.)
├── components             # Shared components used across the app (direct imports, no barrel)
│   ├── ui/               # shadcn-style UI primitives (button, switch, slider, label, sidebar)
│   └── switch.tsx        # Shared switch control wrapper
├── config                  # Global configuration
│   └── conway.ts          # Conway game constants (grid min/max)
├── features               # Feature-based modules (no cross-feature imports)
│   ├── conway/            # Conway core (no UI): types, worker, utils, simulation hook
│   │   ├── types/         # UnitType, Matrix3D
│   │   ├── worker/        # Rules, strategies, worker API
│   │   ├── utils/         # helpers, 3d-matrix, matrix-cache
│   │   └── hooks/         # use-conway-simulation
│   ├── grid/              # Grid UI: 2D view + 3D view (DOM cube, WebGL)
│   │   └── components/   # grid-2d-view, main, matrix, row, unit, face, drag-wrapper, grid-webgl, game-styles
│   └── boston-map/        # Boston parcels (V3); multiple algorithms (Conway, HighLife, etc.)
│       ├── api/           # parcels API
│       ├── components/    # boston-map-view, boston-map
│       ├── hooks/         # use-boston-map-simulation, use-parcel-data
│       ├── rules/         # presets, compute-next-state (map rules)
│       └── utils/         # parcel-topology (build adjacency from GeoJSON)
├── types                  # Shared types (used by multiple features)
│   └── cellular-automata.ts  # CellState, TopologyMap
├── hooks                   # Shared hooks
├── lib                     # Reusable libraries (e.g. cn utility)
│   └── utils.ts
├── stores                  # Global state stores
├── testing                 # Test utilities and mocks
├── utils                   # Shared utility functions
├── index.css               # Global styles (Tailwind + theme)
├── index.tsx               # Entry point
└── react-app-env.d.ts
```

## Conventions

- **File naming**: kebab-case (e.g. `drag-wrapper.tsx`, `game-styles.ts`).
- **Feature isolation**: No cross-feature imports. `conway` = core engine; `grid` = 2D/3D grid UI; `boston-map` = Boston parcel map (multiple algorithms). Shared types live in `src/types`. Grid and boston-map import from conway (core) only.
- **Unidirectional flow**: Shared code → features → app. App composes features; features use shared components, hooks, lib, types, utils.
- **Direct imports**: Import from specific files; avoid barrel files for better tree-shaking.

## SOLID / KISS / DRY

- **DRY**: Simulation state and step logic live in `useConwaySimulation`; matrix instances in `matrix-cache.ts`. Layout and legacy App both use the hook and cache (no duplicated `instantiateMtrx` / `implementChangeState`).
- **SRP**: Sidebar is split into single-purpose components: `VersionSelect`, `GenerationDisplay`, `SimulationToggles`, `ActionButtons`, `GridSizeControl`. Each receives only the props it needs (ISP).
- **KISS**: `ConwayLayout` only composes providers, sidebar, and outlet; all simulation logic is in the hook.

## References

- [Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
- [Project Standards](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-standards.md)
