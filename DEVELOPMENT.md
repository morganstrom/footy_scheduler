# Development Guide - Footy Scheduler

This document explains the architecture and development workflow for the footy scheduler application.

## Architecture Overview

The application uses **ES Modules** architecture with a clean separation of concerns:

```
footy_scheduler/
├── main.ts                 # Core business logic (pure functions)
├── app.ts                  # DOM interactions and UI logic
├── main.test.ts            # Unit tests for core functions
├── index.template.html     # HTML template (source)
├── index.html              # Generated HTML (gitignored)
├── config.js               # Build script for HTML generation
├── .env                    # Local environment config (gitignored)
├── .env.example            # Environment config template
├── dist/                   # Compiled JavaScript files
│   ├── main.js             # Compiled core functions
│   └── app.js              # Compiled app logic (entry point)
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment
└── package.json            # Dependencies and scripts
```

## Language Guidelines

**IMPORTANT**: This project uses a bilingual approach:

- **Code and Comments**: Write all code, variable names, function names, comments, and documentation in **English**
  - ✅ `function generateSchedule()` (English)
  - ✅ `// Calculate total play time` (English)
  - ❌ `function genereraSchema()` (Swedish - incorrect)

- **User Interface**: Write all user-facing text (button labels, table headers, alert messages, form labels, etc.) in **Swedish**
  - ✅ Button text: `"Generera schema"` (Swedish)
  - ✅ Alert: `alert("Ange minst två spelare")` (Swedish)
  - ❌ Button text: `"Generate schedule"` (English - incorrect)

This separation ensures:
- International developers can understand and maintain the code
- Swedish end-users have a localized interface
- Clear distinction between implementation and presentation

## File Structure Explained

### Core Application Files

#### `main.ts` - Core Functions (Testable)
- Contains **pure business logic** with no DOM dependencies
- Exports core functions: `generateSchedule()`, `shuffleArray()`
- Exports TypeScript interfaces: `Player`, `ScheduleAssignment`, `ScheduleResult`
- **Zero side effects** - perfect for unit testing
- Can be imported by other modules

#### `app.ts` - Application Logic (DOM-dependent)
- Imports core functions from `main.ts`
- Handles all DOM interactions and event listeners
- Contains UI-specific functions like `renderSchedule()`
- Manages application state (team assignments, form handling)
- **Browser-only code** - not suitable for testing

#### `main.test.ts` - Unit Tests
- Tests only the core functions from `main.ts`
- Uses Jest with TypeScript support
- Focuses on business logic validation
- Independent of DOM/browser environment

### Configuration & Build System

#### `index.template.html` - HTML Template (Source)
- Source file for the HTML entry point
- Contains `{{BASE_PATH}}` placeholders for environment-specific paths
- Edit this file when making HTML changes
- Processed by `config.js` to generate `index.html`

#### `index.html` - Generated HTML (Do Not Edit)
- Generated automatically by the build system
- **Gitignored** - never commit this file
- Created by `config.js` from `index.template.html`
- Contains environment-specific paths for local or GitHub Pages deployment

#### `config.js` - Build Configuration Script
- Reads environment variables from `.env` file
- Processes `index.template.html` and replaces `{{BASE_PATH}}` placeholders
- Generates `index.html` with correct paths for the target environment
- Supports both local development and GitHub Pages deployments

#### `.env` - Local Environment Configuration
- **Gitignored** - contains local development settings
- Sets `BASE_PATH=/` for local development
- See `.env.example` for the template and available options

## Development Workflow

### 1. Install Dependencies
```bash
npm install
```

### 2. Configuration & Build

#### Generate HTML from Template
```bash
npm run config
```
- Reads `.env` file (uses `BASE_PATH=/` for local development)
- Processes `index.template.html`
- Generates `index.html` with local paths

#### Build Entire Project
```bash
npm run build
```
- Runs `npm run config` to generate HTML
- Compiles TypeScript: `main.ts` → `dist/main.js`, `app.ts` → `dist/app.js`
- Prepares project for local use

#### Build for GitHub Pages
```bash
npm run build:gh-pages
```
- Uses `BASE_PATH=/footy_scheduler/` instead of `/`
- Generates `index.html` with GitHub Pages paths
- Compiles TypeScript
- Used automatically by GitHub Actions on deployment

### 3. Run Tests
```bash
npm test              # Run once
npm run test:watch    # Watch mode
```

### 4. Development Server
```bash
npm run dev
```
- Runs `npm run build` (generates HTML + compiles TypeScript)
- Starts HTTP server on port 8080
- Opens browser automatically at http://localhost:8080

## Key Technical Details

### Import Paths
In `app.ts`, note the `.js` extension:
```typescript
import { generateSchedule } from './main.js';
//                                    ^^^^ .js not .ts
```
This is required because the import happens in the **compiled** JavaScript.

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "ES2020",     // ES modules output
    "moduleResolution": "node"
  }
}
```

### HTML Module Loading
```html
<script type="module" src="./dist/app.js"></script>
<!--    ^^^^^^^^^^^^^  Required for ES modules -->
```

## Testing Strategy

### What's Tested
- ✅ `generateSchedule()` - Core scheduling algorithm
- ✅ `shuffleArray()` - Array randomization utility
- ✅ Input validation and edge cases

### What's NOT Tested
- ❌ DOM manipulation (renderSchedule)
- ❌ Event handlers
- ❌ Form validation UI
- ❌ User interactions

## Adding New Features

### For Core Logic (main.ts):
1. Add pure functions with no DOM dependencies
2. Export the function
3. Add comprehensive unit tests
4. Import in `app.ts` if needed for UI

### For UI Features (app.ts):
1. Import required functions from `main.ts`
2. Add DOM event listeners and manipulation
3. Keep UI logic separate from business logic

## Browser Compatibility

ES Modules are supported in:
- ✅ Chrome 61+
- ✅ Firefox 60+
- ✅ Safari 10.1+
- ✅ Edge 16+

## Debugging

### In Browser DevTools:
- Modules appear as separate files in Sources tab
- Set breakpoints in original TypeScript (if sourcemaps enabled)
- Network tab shows module loading

### Common Issues:
1. **CORS errors**: Must serve over HTTP, not file://
2. **404 on imports**: Check file paths and `.js` extensions
3. **Module not found**: Ensure TypeScript compilation succeeded

## Performance Notes

- ES modules are loaded asynchronously
- Browser caches modules efficiently
- Only imported functions are executed
- Tree shaking eliminates unused code in production builds

## Deployment

### GitHub Pages (Automatic)

The project deploys automatically to GitHub Pages via GitHub Actions:

1. **Trigger**: Push to `main` branch
2. **Workflow**: `.github/workflows/deploy.yml`
3. **Process**:
   - Runs `npm run build:gh-pages` (sets `BASE_PATH=/footy_scheduler/`)
   - Generates `index.html` with correct GitHub Pages paths
   - Deploys to `gh-pages` branch
4. **Live URL**: https://[username].github.io/footy_scheduler/

### Local vs GitHub Pages Builds

| Environment | BASE_PATH | Command | index.html |
|-------------|-----------|---------|------------|
| Local | `/` | `npm run build` | Generated with local paths |
| GitHub Pages | `/footy_scheduler/` | `npm run build:gh-pages` | Generated with repo paths |

The configuration system ensures assets load correctly in both environments.

## Common Development Tasks

### Making HTML Changes
1. Edit `index.template.html` (not `index.html`)
2. Run `npm run build` to regenerate `index.html`
3. Test locally with `npm run dev`

### Adding TypeScript Features
1. Add logic to `main.ts` (pure functions) or `app.ts` (UI code)
2. Add tests to `main.test.ts` for business logic
3. Run `npm test` to verify tests pass
4. Run `npm run build` to compile and check for type errors

### Updating Dependencies
1. Update `package.json`
2. Run `npm install`
3. Test with `npm test` and `npm run dev`
4. Commit `package.json` and `package-lock.json`

This architecture provides a solid foundation for maintainable, testable JavaScript applications with flexible deployment options.
