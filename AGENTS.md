# AI Assistant Guidelines for Footy Scheduler

This document provides instructions for AI assistants working on the Footy Scheduler codebase. Follow these guidelines to maintain consistency and quality.

## Project Overview

Footy Scheduler is a TypeScript-based football team schedule planner with a browser-based UI. The project emphasizes clean separation between domain logic and presentation.

## Architecture & File Organization

### Core Files
- **`main.ts`**: Pure scheduling algorithms and domain logic
  - Export all functions for reuse in tests and application code
  - No DOM manipulation or UI concerns
  - Keep functions pure and testable
  
- **`app.ts`**: Application layer and UI integration
  - Handles all DOM manipulation and event binding
  - Reads user inputs and renders results
  - Calls core scheduling functions from `main.ts`
  - Acts as the bridge between UI and domain logic

- **`index.html`**: Browser entrypoint
  - Loads the compiled bundle from `dist/main.js`
  - Contains the UI structure and styling

### Generated & Configuration Files
- **`dist/`**: TypeScript compiler output (never edit manually)
- **`package.json`**: NPM scripts, dependencies, and Jest configuration
- **`tsconfig.json`**: TypeScript strict mode compiler settings
- **`main.test.ts`**: Jest test suite for scheduling logic

## Development Workflow

### Initial Setup
```bash
npm install  # Install TypeScript, Jest, and dependencies
```

### Build Commands
```bash
npm run build      # Compile TypeScript to JavaScript (outputs to dist/)
npm run dev        # Build and start development server at http://localhost:8080
```

### Testing Commands
```bash
npm test           # Run Jest test suite once
npm run test:watch # Run tests in watch mode (reruns on file changes)
```

**Important**: Always run `npm run build` before committing to catch type errors and naming issues.

## Code Style Requirements

### Language Guidelines
- **Code and Comments**: Write all code, variable names, function names, comments, and documentation in **English**
- **User Interface**: Write all user-facing text (button labels, table headers, alert messages, form labels, etc.) in **Swedish**
- **Examples**:
  - ✅ Function name: `generateSchedule` (English)
  - ✅ Comment: `// Calculate total play time` (English)
  - ✅ Button text: `"Generera schema"` (Swedish)
  - ✅ Alert message: `"Ange minst två spelare"` (Swedish)
  - ❌ Function name: `genereraSchema` (Swedish - incorrect)
  - ❌ Alert message: `"Enter at least two players"` (English - incorrect)

### TypeScript Standards
- Use ES modules syntax (`import`/`export`)
- Use 2-space indentation
- Include trailing commas in multi-line objects and arrays
- Enable and respect all TypeScript strict mode settings

### Variable Declarations
- Prefer `const` by default
- Use `let` only when reassignment is necessary
- Never use `var`

### Naming Conventions
- **camelCase**: functions, variables, parameters
  - Examples: `calculateSchedule`, `teamName`, `matchCount`
- **PascalCase**: interfaces, types, classes
  - Examples: `Team`, `MatchSchedule`, `ScheduleConfig`
- **UPPER_CASE**: constants and configuration values
  - Examples: `MAX_TEAMS`, `DEFAULT_ROUNDS`

### Separation of Concerns
- **Domain logic**: Keep in `main.ts` (pure functions, no side effects)
- **UI logic**: Keep in `app.ts` (DOM manipulation, event handlers)
- Never mix these concerns in a single file

## Testing Guidelines

### Test File Organization
- Name test files with `*.test.ts` pattern
- Colocate test files near the modules they test
- Current test file: `main.test.ts` tests `main.ts`

### Writing Tests
- Use deterministic fixtures (avoid random data)
- Test edge cases and boundary conditions
- Mock DOM APIs when testing `app.ts` functionality
- Aim for high coverage of business logic

### Coverage Expectations
- Jest automatically collects coverage from all `.ts` files except `*.test.ts`
- Add tests for new features and bug fixes
- Include test results or coverage reports in PR descriptions

## Git & Version Control

### Commit Message Format
- Use short, imperative subjects (start with lowercase verb)
- Good examples:
  - `add export to excel functionality`
  - `fix schedule generation for odd team counts`
  - `refactor team assignment logic`
- Avoid:
  - Past tense: ~~`added export feature`~~
  - Capitalized: ~~`Add export feature`~~
  - Vague: ~~`update code`~~

### What to Commit
- Source files: `*.ts`, `*.html`, `*.json`, `*.md`
- Exclude generated files: `dist/`, `node_modules/`
- The `.gitignore` file handles most exclusions

### Pull Request Guidelines
1. **Title**: Clear, imperative description of the change
2. **Description should include**:
   - Intent: What problem does this solve?
   - Key changes: Which files/modules were modified?
   - Testing: Results of `npm test` or manual verification steps
   - Screenshots: For UI changes
   - Migration notes: If breaking changes or new dependencies
3. **Link related issues** when applicable
4. **Keep PRs focused**: One logical change per PR

## AI Assistant Specific Instructions

### Before Making Changes
1. **Always read existing code first** - Never propose changes to files you haven't read
2. **Understand the architecture** - Respect the separation between `main.ts` and `app.ts`
3. **Check test coverage** - Look at `main.test.ts` to understand expected behavior

### When Adding Features
1. Add domain logic to `main.ts` as pure functions
2. Export new functions for testing and app usage
3. Add corresponding tests to `main.test.ts`
4. Wire up UI integration in `app.ts`
5. Run `npm test` to verify tests pass
6. Run `npm run build` to check for type errors

### When Fixing Bugs
1. Write a failing test that reproduces the bug (if possible)
2. Fix the issue in the appropriate file (`main.ts` for logic, `app.ts` for UI)
3. Verify the test now passes
4. Run full test suite to check for regressions

### Code Quality Standards
- Follow all naming conventions strictly
- Maintain separation of concerns
- Write self-documenting code (prefer clear names over comments)
- Keep functions small and focused
- Avoid premature optimization
- Don't add features that aren't requested

### What NOT to Do
- Don't edit files in `dist/` (they're generated)
- Don't mix domain logic with UI code
- Don't use `var` for variable declarations
- Don't commit `node_modules/` or compiled assets
- Don't skip running tests before committing
- Don't add unnecessary dependencies without discussion

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Build project | `npm run build` |
| Run tests | `npm test` |
| Watch tests | `npm run test:watch` |
| Development server | `npm run dev` |
| Check types | `npm run build` (no separate type-check script) |

## Questions or Clarifications?

If you encounter unclear requirements or architectural decisions:
1. Check existing code patterns in the relevant files
2. Review test files for expected behavior examples
3. Ask the user for clarification rather than making assumptions
