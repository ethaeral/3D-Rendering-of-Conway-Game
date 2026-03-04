# Project Structure (Bulletproof React)

This project follows the [bulletproof-react](https://github.com/alan2207/bulletproof-react/tree/master/docs) architecture.

```
src
├── app                    # Application layer
│   ├── app-styles.ts      # App-level layout styles
│   ├── app.tsx            # Main application component
│   └── provider.tsx        # Global providers & entry component
├── assets                  # Static assets (images, fonts, etc.)
├── components              # Shared components used across the app
│   ├── ui/                # shadcn-style UI primitives (button, switch, slider, label)
│   └── switch.tsx         # Shared switch control wrapper
├── config                  # Global configuration
│   └── conway.ts          # Conway game constants (grid min/max)
├── features               # Feature-based modules
│   └── conway/            # 3D Conway Game of Life feature
│       ├── components/    # Feature-specific components
│       │   ├── main.tsx
│       │   ├── matrix.tsx
│       │   ├── row.tsx
│       │   ├── unit.tsx
│       │   ├── face.tsx
│       │   ├── drag-wrapper.tsx
│       │   └── game-styles.ts
│       ├── types/
│       │   └── index.ts
│       └── utils/
│           ├── helpers.ts
│           ├── unit-structure.ts
│           └── 3d-matrix-structure.ts
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
- **Feature isolation**: Conway logic lives under `features/conway`. No cross-feature imports.
- **Unidirectional flow**: Shared code → features → app. App composes features; features use shared components, hooks, lib, types, utils.
- **Direct imports**: Import from specific files; avoid barrel files for better tree-shaking.

## References

- [Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
- [Project Standards](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-standards.md)
