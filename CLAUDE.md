# Boggle Studio Project Rules

## Tech Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v4
- State: Zustand
- Features: react-webcam, Supabase Storage, Canvas API
- Linting/Formatting: ESLint 9, Prettier (prettier-plugin-tailwindcss)

## Development Commands

- Dev: `npm run dev --turbopack`
- Build: `npm run build`
- Lint: `npm run lint`

## Assistant Communication Guidelines

- Language: ALWAYS respond to the user in Korean (한국어), regardless of the prompt's language. Explanations, suggestions, and chat responses must be in Korean.
- Code Comments: Write all code comments in Korean to maintain proper context for the user.

## Directory Structure

- `src/app/`: Next.js App Router (Pages & Routing only; UI components must be isolated within local `_components/` directories)
- `src/components`: Globally shared UI components
- `src/actions/`: Next.js Server Actions logic
- `src/hooks/`: Business logic & Side effects management (Custom Hooks)
- `src/store/`: Zustand global state stores (`useBoothStore.ts`)
- `src/utils/`: Pure function-based helper logic (Canvas, File, Video processing, etc.)
- `src/constants/`: Global configurations and static data (`booth.ts`)
- `src/types/`: Shared TypeScript type definitions

## Code Declaration & Naming Conventions

### Standard Declaration Pattern

To ensure consistency and prevent naming mismatches during imports, declaration patterns are strictly unified based on file types using Function Declarations:

- Components: Use export default function to simplify top-level page and container composition.

- Hooks & Utility Functions: Use Named Exports (export function) to strictly enforce identical naming across the codebase and allow multiple exports per file.

```typescript
/**
 * @description Brief and clear explanation of the component's purpose.
 * @param {ParamType} props - Description of the properties.
 * @returns {JSX.Element} Description of the returned value.
 */
// 1. Components (Default Export)
export default function ComponentName({ propA, propB }: ComponentNameProps) {
  if (!propA) return null; // Early Return pattern
  return <div>...</div>;
}

/**
 * @description Brief and clear explanation of the custom hook's purpose.
 * @param {ParamType} param - Description of the parameters.
 * @returns {ReturnType} Description of the returned state or methods.
 */
// 2. Hooks & Utilities (Named Export)
export function useExampleHook(param: ParamType): ReturnType {
  // Logic here
  return { data };
}
```

### Mandatory JSDoc Documentation

Every component, utility function, and custom hook must include a JSDoc comment at the top, explicitly describing its purpose, parameters (properties), and return values to ensure clear intent at a glance.

### Naming Conventions

Components: Use PascalCase (e.g., CameraBooth.tsx). Form component props as ComponentNameProps.

- Hooks: Use camelCase with a 'use' prefix (e.g., useCamera.ts).

- Functions / Utils: Use camelCase starting with descriptive verbs (e.g., generateFileName()).

- Constants: Use UPPER_SNAKE_CASE (e.g., MAX_PHOTO_COUNT).

- Types / Interfaces: Use PascalCase (e.g., type FrameType).

## Design Patterns & Coding Rules

### Separation of Concerns & Pure Functions

- UI Components: Focus strictly on rendering. Destructure props immediately in the function signature. Avoid deeply nested structures by actively utilizing the children prop (Component Composition).

- Hooks: Isolate business logic, state mutations, and side effects away from the UI.

- Utils: Write heavy operations (Canvas compositing, video processing, etc.) as independent, reusable pure functions that do not rely on or modify external state.

### State Management (Zustand)

- Treat useBoothStore as the Single Source of Truth (SSOT) for shared global data.

- Always implement the Selector Pattern (e.g., `const data = useBoothStore(state => state.data))` to prevent unnecessary re-renders.)

### Tailwind CSS v4 Styling

- Prioritize Tailwind CSS v4 utility classes. Define the design system configurations within a single @theme block at the top of globals.css.

- Abstract long or complex utility combinations into reusable classes using @utility blocks within globals.css to keep JSX clean. Use clsx or tailwind-merge only for dynamic, state-based class toggling.

## Workflow Automation

### Save Plan File Before Coding

When a plan/feature is requested, extract the work title from the user's message. Once the user approves the plan and gives the command to start (e.g., "작업 시작해", "구현해줘"):

1. Before writing any codebase changes, create a file
2. Generate a file at `at /plan/{work-title}-plan.md.` matching the layout in `.claude/plan-template.md.`
3. Write the full approved plan details exactly as generated during the planning phase.

### Generate Work Summary Before Pushing

When the user requests a remote repository push (e.g., "origin에 반영해줘", "push해줘"):

1. Analyze the git diff between `main` and the current working branch.

2. Generate a summary matching the layout in `.claude/work-summary-template.md.`

3. Save the summary to `/plan/{branch-name}-summary.md.`

4. Display the generated summary to the user for review, and proceed with the push only after receiving explicit confirmation.
