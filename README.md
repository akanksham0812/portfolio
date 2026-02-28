# itsbd.framer.ai React Clone

React + Vite single-page portfolio inspired by `https://itsbd.framer.ai`.

## Run locally

```bash
npm install
npm run fetch:assets
npm run dev
```

## Build

```bash
npm run fetch:assets
npm run build
npm run preview
```



## Why images were broken

The original Framer image URLs can fail on some deployments. This project now expects local assets in `public/assets`.

Run this once to download and store all required images:

```bash
npm run fetch:assets
```

Then commit the downloaded files:

```bash
git add public/assets
git commit -m "Add local image assets"
```

## Deploy to GitHub Pages

1. Push this project to a GitHub repository.
2. In GitHub, open `Settings -> Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push to `main` branch. The workflow at `.github/workflows/deploy.yml` will deploy automatically.

## Password-Protected Project

- Protected case study password comes from `VITE_OPS_PROJECT_PASSWORD`.
- Local dev fallback (when running `npm run dev`) is `qwerty`.

Set GitHub repository secret (recommended):
1. Open `Settings -> Secrets and variables -> Actions -> Secrets`.
2. Create secret `VITE_OPS_PROJECT_PASSWORD`.
3. Set your desired password value.

Alternative:
- You can also set a repository variable with the same name under `Actions -> Variables`.

## Project Template System

Projects are now config-driven.

- Template helper: `src/projects/template/caseStudy.template.js`
- Per-project files: `src/projects/data/*.project.js`
- Project registry + access config: `src/projects/projects.config.js`
- Runtime compiler for routes/password flags: `src/projects/runtime.js`

### Add a new project

1. Create `src/projects/data/<your-project>.project.js` using `createCaseStudyProject(...)`.
2. Add the new entry in `src/projects/projects.config.js`:
   - `slug`
   - `routeAliases` (optional)
   - `template`
   - `access.passwordProtected` and optional `envKey`, `devFallbackPassword`
   - `data`
3. Add local images under `public/assets/projects/`.
4. Run:

```bash
npm run fetch:assets
npm run build
```         