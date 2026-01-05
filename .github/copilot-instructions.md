# Copilot / AI Agent Instructions for PAYG

Short, focused guidance to help an AI contributor be productive immediately.

- **Project type:** React single-page app bootstrapped with `react-scripts` (see `package.json` scripts: `start`, `build`).
- **Where to run:** `npm install` then `npm start` to run the dev server locally.

- **High-level architecture:**
  - Frontend-only client that talks to an external REST API via modules in `src/api/*`.
  - Auth is client-side JWT stored in localStorage using `src/utils/token.js` and exposed via `src/contexts/AuthContext.jsx`.
  - Routing and protected routes live in `src/routes/AppRoutes.jsx` (uses `react-router-dom` v7 `Routes` + `Route`).
  - Pages live in `src/pages/*`; UI building blocks are in `src/components/*`.

- **Important patterns and conventions:**
  - API modules use `axios` and a project-level `API_BASE` in each `src/api/*.js`. Many files use a CORS proxy URL (e.g. `https://corsproxy.io/?http://...`) for local dev — remove the proxy for production deployments.
  - Auth flow: call `login()` from `src/api/auth.js`, on success `AuthContext` stores token via `setToken()` in `src/utils/token.js`. Use `getToken()` for `Authorization` header in `src/api/*`.
  - File uploads use `FormData` and `Content-Type: multipart/form-data` (see `src/api/sermons.js` and `src/api/images.js`). Ensure the file field name matches the API (`image`).
  - Private pages are guarded by `PrivateRoute` in `AppRoutes.jsx` which checks `token` from `AuthContext` and redirects to `/login` when not present.

- **Local dev gotchas:**
  - Tailwind appears referenced two ways: `tailwindcss` is in `devDependencies` and `public/index.html` includes the CDN script. When editing global styles check `index.css` and confirm whether to rely on the CDN or build-time Tailwind.
  - No test harness or CI workflow present in the repo — run `npm run test` (default `react-scripts test`) if adding tests.

- **Where to look for common tasks:**
  - Authentication: `src/contexts/AuthContext.jsx`, `src/api/auth.js`, `src/utils/token.js`.
  - Network calls and headers: `src/api/*.js` (pattern: import axios; use `getToken()` for auth headers).
  - Forms and uploads: `src/api/sermons.js`, `src/api/images.js`, `src/components/*Form.jsx` (look for `SermonForm.jsx`, `ThemeForm.jsx`, etc.).
  - Routes and guards: `src/routes/AppRoutes.jsx`.

- **Code style & small conventions to follow:**
  - Prefer using existing API modules when changing network behavior rather than inlining axios calls in components.
  - Keep token management centralized: read/write via `src/utils/token.js` and flow through `AuthContext`.
  - When adding new endpoints, follow the existing pattern: `export async function name(...) { return axios.<method>(url, ...); }`.

- **Security / production notes for PRs:**
  - Remove the dev CORS proxy before shipping; ensure `API_BASE` points to the real API host or is configurable via env.
  - Do not commit secrets or tokens. The project stores JWT in localStorage; review components for any accidental logging of tokens.

- **If you need more context from the repo:**
  - Start by reading `src/contexts/AuthContext.jsx`, `src/api/auth.js`, and `src/routes/AppRoutes.jsx` — they capture auth, API patterns, and routing decisions.

If anything above is unclear or you'd like me to include more examples (e.g., a suggested env var pattern or a small refactor to centralize API_BASE), tell me what to add and I'll iterate.
