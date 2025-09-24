# Component Organization

This directory contains all Vue components organized by functionality and purpose.

## Structure

```
components/
├── index.ts              # Barrel exports for easy importing
├── bl4/                  # BL4 Save Editor specific components
│   ├── SaveFileEditor.vue
│   ├── SaveFolderUpload.vue
│   └── SteamIdInput.vue
├── cards/                # Card-style display components
│   ├── ArgoCDCard.vue
│   ├── InfoCard.vue
│   └── ProjectCard.vue
├── common/               # Shared utility components
│   ├── MarkdownRenderer.vue
│   └── Terminal.vue
├── layout/               # Layout and navigation components
│   ├── FloatingThemeToggle.vue
│   ├── Navigation.vue
│   └── ThemeToggle.vue
├── markdown/             # Components used within markdown content
│   ├── Callout.vue
│   └── CustomComponent.vue
└── ui/                   # Reusable UI components
    └── button/
        ├── Button.vue
        └── index.ts
```

## Import Patterns

### Direct imports (recommended):
```typescript
import Navigation from '@/components/layout/Navigation.vue'
import ProjectCard from '@/components/cards/ProjectCard.vue'
import SteamIdInput from '@/components/bl4/SteamIdInput.vue'
```

### Barrel imports (for multiple components):
```typescript
import { Navigation, ProjectCard, SteamIdInput } from '@/components'
```

## Categories

- **bl4/**: Components specific to the BL4 Save Editor functionality
- **cards/**: Components that display information in card format
- **common/**: Utility components used across multiple pages/features
- **layout/**: Components that handle page layout, navigation, and theming
- **markdown/**: Components that can be used within markdown content
- **ui/**: Generic, reusable UI components that follow the design system

## Adding New Components

When adding new components:

1. Place them in the appropriate category folder
2. Use `@/` imports for internal dependencies
3. Update the barrel export in `index.ts` if the component should be easily importable
4. Follow the existing naming conventions (PascalCase for files and component names)