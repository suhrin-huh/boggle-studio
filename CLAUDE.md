# Boggle Boggle Studio Project Rules

## Tech Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v4
- State: Zustand
- Features: react-webcam, Supabase Storage, Canvas API
- Linting/Formatting: ESLint 9, Prettier(prettier-plugin-tailwindcss)

## Development Commands

- Dev: `npm run dev --turbopack`
- Build: `npm run build`
- Lint: `npm run lint`

## Assistant Communication Guidelines

- Language: ALWAYS respond to the user in Korean (한국어), regardless of the prompt's language. Explanations, suggestions, and chat responses must be in Korean.
- Code Comments: Write code comments in Korean to maintain context for the user.

## 1. Directory Structure

- `src/app/`: Next.js App Router (Routing, Layouts)
- `src/components/`: Globally shared UI components only
- `src/hooks/`: Business logic & Side effects (Custom Hooks)
- `src/store/`: Zustand global states
- `src/utils/`: Pure functions (Data processing, Canvas logic)
- `src/types/`: Shared TypeScript definitions
- `src/assets/`: Static resources (Images, Icons, Lottie)

## 2. Naming Conventions

- Components: Use `PascalCase` (e.g., `CaptureButton.tsx`, `FrameSelector.tsx`).
- Component Props: Use `PascalCase` + `Props` suffix (e.g., `interface CaptureButtonProps { ... }`).
- Hooks: Use `camelCase` starting with 'use' (e.g., `useCamera.ts`, `useTimer.ts`).
- Functions: Use `camelCase` with descriptive verbs (e.g., `generateFileName()`, `calculatePosition()`).
- Constants: Use `UPPER_SNAKE_CASE` (e.g., `MAX_PHOTO_COUNT`, `DEFAULT_FRAME_COLOR`).
- Utils / Files: Use `camelCase` (e.g., `canvasHelper.ts`, `dateFormatter.ts`).
- Styles / Assets: Use `kebab-case` (e.g., `globals.css`, `logo-main.png`, `icon-camera.svg`).
- Types / Interfaces: Use `PascalCase` (e.g., `interface UserData`, `type FrameType`).

## Design Patterns & Component Rules

- Functional Components: Write all components as arrow functions (`const Component = () => { ... }`).
- Separation of Concerns: Keep UI rendering logic inside components. Extract complex state changes and business logic into `hooks/`. Move heavy Canvas compositing logic to pure functions in `utils/`.
- Props Handling: Destructure props immediately in the function signature for better readability.
- Early Return: Minimize code depth (indentation) by using the Early Return pattern for edge cases and condition checks at the top of the function.

## Styling & UI (Tailwind CSS v4)

- Utility-First & Reusability: Strictly prioritize Tailwind CSS v4 utility classes. Leverage v4's CSS-first configuration by defining reusable design systems and theme variables inside a SINGLE `@theme` block at the top of `globals.css` to prevent scattered configurations. Define custom utilities using `@utility` blocks.
- Complex & Conditional Styling: If a combination of utility classes becomes too long or complex, DO NOT clutter the JSX. Abstract these complex styles into reusable classes within `globals.css`. Use `clsx` or `tailwind-merge` ONLY for handling dynamic, state-based class toggling.

## TypeScript & State Management

- Strict Typing: The use of `any` is strictly prohibited. Explicitly define types for all function parameters and return values.
- Zustand Pattern: - Use `useProjectStore` as the Single Source of Truth (SSOT) for shared page data.
  - Always use the selector pattern (e.g., `const data = useProjectStore(state => state.data)`) to prevent unnecessary re-renders.
- File Output Naming: The final composited image must strictly follow the format: `BoggleBoggle_[Text]_[YYYYMMDDHHmmss]_[Random4Chars].png`.

## Error Handling & UX (Essential)

- Async Logic: Wrap all asynchronous operations (`async/await`) in `try-catch` blocks. Always provide clear Loading and Error UI feedback to the user.
- Optimization: Manage memory references carefully during Canvas operations. Ensure proper `useEffect` cleanup to prevent memory leaks.
