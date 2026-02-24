# Project Template Guide

To add a new case-study project:

1. Create a file in `src/projects/data/` using `createCaseStudyProject(...)`.
2. Add your images in `public/assets/projects/`.
3. Register the project in `src/projects/projects.config.js`.

Password lock options in config:

- `passwordProtected: true|false`
- `envKey: "VITE_*"` (read from build-time environment)
- `devFallbackPassword: "qwerty"` (used only in local `npm run dev`)
