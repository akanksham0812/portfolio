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
