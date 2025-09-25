# Development Guide - Footy Scheduler

This document explains the architecture and development workflow for the footy scheduler application.

## Architecture Overview

The application uses **ES Modules** architecture with a clean separation of concerns:

```
footy_scheduler/
├── main.ts          # Core business logic (pure functions)
├── app.ts           # DOM interactions and UI logic
├── main.test.ts     # Unit tests for core functions
├── index.html       # HTML entry point
├── dist/            # Compiled JavaScript files
│   ├── main.js      # Compiled core functions
│   └── app.js       # Compiled app logic
└── package.json     # Dependencies and scripts
```

## File Structure Explained

### `main.ts` - Core Functions (Testable)
- Contains **pure business logic** with no DOM dependencies
- Exports core functions: `generateSchedule()`, `shuffleArray()`
- Exports TypeScript interfaces: `Player`, `ScheduleAssignment`, `ScheduleResult`
- **Zero side effects** - perfect for unit testing
- Can be imported by other modules

### `app.ts` - Application Logic (DOM-dependent)
- Imports core functions from `main.ts`
- Handles all DOM interactions and event listeners
- Contains UI-specific functions like `renderSchedule()`
- Manages application state (team assignments, form handling)
- **Browser-only code** - not suitable for testing

### `main.test.ts` - Unit Tests
- Tests only the core functions from `main.ts`
- Uses Jest with TypeScript support
- Focuses on business logic validation
- Independent of DOM/browser environment

## Development Workflow

### 1. Install Dependencies
```bash
npm install
```

### 2. Build TypeScript
```bash
npm run build
```
Compiles `main.ts` and `app.ts` to `dist/main.js` and `dist/app.js`

### 3. Run Tests
```bash
npm test              # Run once
npm run test:watch    # Watch mode
```

### 4. Development Server
```bash
npm run dev
```
- Builds the project
- Starts HTTP server on port 8080
- Opens browser automatically

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

This architecture provides a solid foundation for maintainable, testable JavaScript applications.
