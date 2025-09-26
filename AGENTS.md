# Repository Guidelines

## Project Structure & Module Organization
- `main.ts`: core scheduling algorithms exported for reuse and tests.
- `app.ts`: UI wiring that reads inputs, renders results, and calls the core.
- `index.html`: browser entrypoint; expects the compiled bundle under `dist/main.js`.
- `dist/`: generated JavaScript from the TypeScript compiler—never edit by hand.
- `main.test.ts`: Jest suite covering scheduling helpers; add more specs here.
- Config lives in `package.json` (scripts, Jest) and `tsconfig.json` (strict TS build).

## Build, Test, and Development Commands
- `npm install`: install TypeScript, Jest, and local tooling.
- `npm run build`: run `tsc` with strict settings, emitting JS into `dist/`.
- `npm run dev`: build then launch `http-server` on `http://localhost:8080`.
- `npm test`: run the Jest suite once via `ts-jest` in a jsdom environment.
- `npm run test:watch`: rerun affected specs on file save for rapid feedback.

## Coding Style & Naming Conventions
- Stick to TypeScript ES modules with two-space indentation and trailing commas.
- Use `const` by default; reserve `let` for reassignment and avoid `var`.
- Follow camelCase for functions/variables, PascalCase for interfaces/types, UPPER_CASE for constants.
- Keep pure scheduling logic in `main.ts`; confine DOM mutations to `app.ts`.
- Run `npm run build` before committing to catch type and casing regressions.

## Testing Guidelines
- Name specs `*.test.ts`; colocate near related modules when adding new files.
- Jest collects coverage from non-test `.ts` files—add tests for new branches and edge cases.
- Prefer deterministic fixtures; mock DOM APIs when verifying `app.ts` behavior.
- Document `npm test` results (or equivalent evidence) in PR discussions.

## Commit & Pull Request Guidelines
- Write short, imperative commit subjects (`add export to excel functionality`, `update tags`).
- Keep commits scoped; exclude compiled assets and `node_modules/` from diffs.
- PRs should summarize intent, list key changes, and note test or manual verification.
- Link issues when relevant, attach UI screenshots for visible changes, and call out migration steps.
