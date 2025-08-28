# My Resume / Dashboard App

This repository contains a small React application built with Vite. It provides user authentication, a dashboard, resume creation and viewing, and a few utility pages (calculators, portfolio, etc.). The app uses Firebase for authentication and can optionally use Firebase Hosting or other static hosts for deployment.

## Quick overview

- Tech: React, Vite, JavaScript, Firebase
- Dev tooling: Vite dev server, npm scripts
- Location: `src/` contains pages and components; `public/` contains static assets

## Features

- Sign up, Login, and Forgot Password flows
- Dashboard layout with sidebar navigation
- Create and download a resume (PDF asset included)
- Simple and scientific calculator pages
- Portfolio and welcome pages

## Prerequisites

- Node.js (v16+ recommended)
- npm (or yarn/pnpm)

## Setup (Windows PowerShell)

From the project root (`test/`) run:

```powershell
npm install
```

Start the dev server:

```powershell
npm run dev
```

Build for production:

```powershell
npm run build
```

Preview the production build locally:

```powershell
npm run preview
```

## Environment / Firebase

The Firebase initializer is at `src/lib/firebase.js`. This repository does not include production Firebase credentials. To enable Firebase features (Auth, Storage, Firestore):

1. Create a Firebase project in the Firebase console.
2. Copy the config object and add it to `src/lib/firebase.js` or read values from environment variables and import them in that file.
3. Enable Authentication providers you need (Email/Password, Google, etc.).

Security note: do not commit secret keys. Use a `.env` file that is excluded from version control or your CI/CD secrets.

## Project structure (key files)

- `index.html` — Vite HTML entry
- `src/main.jsx` — application bootstrap
- `src/App.jsx` — top-level routes and layout
- `src/pages/` — page components (Dashboard, Login, SignUp, CreateResume, Calculator, etc.)
- `src/components/` — reusable UI components (e.g., `AuthInput.jsx`)
- `src/lib/firebase.js` — Firebase initialization
- `public/` — static assets (profile images, PDF resume)

## Scripts (from `package.json`)

- `npm run dev` — run the Vite dev server
- `npm run build` — build production files into `dist/`
- `npm run preview` — locally preview production build

## Deployment

You can deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, Firebase Hosting).

If using Firebase Hosting:

1. Install the Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase init hosting` and set the public folder to `dist`
3. Deploy with `firebase deploy --only hosting`

For Vercel or Netlify, follow their standard build steps (install, build, publish `dist/`).

## TODO / Suggestions

- Add a `.env.example` with the Firebase variables to document required keys.
- Add basic unit tests (Vitest or Jest) for critical components.
- Consider migrating to TypeScript for stronger typing and maintainability.
- Add a `LICENSE` file (e.g., MIT) if you plan to open-source the project.

## Contributing

Contributions are welcome. Please open issues or PRs against this repository. Keep changes small and describe the intent in the PR.

## License

Add a `LICENSE` file to declare the project license. If unsure, MIT is commonly used.

---

Requirements coverage:

- Create a README for the app: Done — updated `README.md` with setup, scripts, Firebase notes, project structure, and deployment instructions.

Next steps I can take if you want:

- Add a `.env.example` with recommended Firebase keys.
- Add a `LICENSE` file and/or `CONTRIBUTING.md`.
- Create a small GitHub Actions workflow to build and deploy the app.

