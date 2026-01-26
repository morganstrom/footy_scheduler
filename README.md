# Footy Scheduler

Football team schedule planner for splitting teams and generating match schedules.

## Quick Start

### For End Users (Running Locally)

1. Install dependencies:
```bash
npm install
```

2. Run the application:
```bash
npm run dev
```

3. Open your browser at http://localhost:8080

That's it! The app will automatically build and serve.

### For Developers

If you're planning to modify or extend the code, see [DEVELOPMENT.md](DEVELOPMENT.md) for architecture details, coding standards, and development workflow.

## Configuration Setup

This project uses environment-based configuration to support both local development and GitHub Pages deployment.

### Files

- **`.env`** - Local environment configuration (gitignored)
- **`.env.example`** - Template for environment variables
- **`index.template.html`** - HTML template with `{{BASE_PATH}}` placeholders
- **`index.html`** - Generated HTML file (gitignored, generated at build time)
- **`config.js`** - Build script that generates `index.html` from template

### Local Development

1. Install dependencies:
```bash
npm install
```

2. The `.env` file is already configured for local development:
```
BASE_PATH=/
```

3. Build and run locally:
```bash
npm run dev
```

This will:
- Generate `index.html` with `BASE_PATH=/`
- Compile TypeScript
- Start local server at http://localhost:8080

### GitHub Pages Deployment

The project automatically deploys to GitHub Pages using GitHub Actions.

#### Workflow (`.github/workflows/deploy.yml`)

On push to `main` branch:
1. Runs `npm run build:gh-pages` which sets `BASE_PATH=/footy_scheduler/`
2. Generates `index.html` with correct paths for GitHub Pages
3. Deploys to GitHub Pages

#### Adding Secrets

To add secrets for future use:

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add your secret (e.g., `API_KEY`)
5. Reference in `.github/workflows/deploy.yml`:
```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
```

### Manual Build for GitHub Pages

To manually build for GitHub Pages:

```bash
npm run build:gh-pages
```

This generates `index.html` with `BASE_PATH=/footy_scheduler/`

## Scripts

- `npm run config` - Generate index.html from template using .env
- `npm run build` - Generate HTML and compile TypeScript (local)
- `npm run build:gh-pages` - Generate HTML for GitHub Pages and compile TypeScript
- `npm run dev` - Build and start local development server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
footy_scheduler/
├── .env                    # Local config (gitignored)
├── .env.example            # Config template
├── config.js               # Build configuration script
├── index.template.html     # HTML template (source)
├── index.html              # Generated HTML (gitignored)
├── main.ts                 # Core business logic
├── app.ts                  # UI and DOM interactions
├── main.test.ts            # Unit tests
├── dist/                   # Compiled JavaScript (gitignored)
│   ├── main.js             # Compiled core functions
│   └── app.js              # Compiled UI logic (entry point)
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions deployment
```

## How Configuration Works

1. **Template System**: `index.template.html` contains `{{BASE_PATH}}` placeholders
2. **Build Script**: `config.js` reads `.env`, replaces placeholders, generates `index.html`
3. **Environment Variables**:
   - Local: `BASE_PATH=/` (from `.env`)
   - GitHub Pages: `BASE_PATH=/footy_scheduler/` (from build script)
4. **HTML Generation**: The base tag and script paths are set correctly for each environment

### Example

Template (`index.template.html`):
```html
<base href="{{BASE_PATH}}" />
<script type="module" src="{{BASE_PATH}}dist/app.js"></script>
```

Generated locally (`BASE_PATH=/`):
```html
<base href="/" />
<script type="module" src="/dist/app.js"></script>
```

Generated for GitHub Pages (`BASE_PATH=/footy_scheduler/`):
```html
<base href="/footy_scheduler/" />
<script type="module" src="/footy_scheduler/dist/app.js"></script>
```
