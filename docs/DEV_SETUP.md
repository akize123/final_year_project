Developer Setup — Frontend (AcademIQ Hub)

Prereqs
- Node.js 18+ recommended
- npm or pnpm

Install

```bash
npm install
```

Run dev server

```bash
npm run dev
# default Vite port (usually 5173) or configured to 8081 in this workspace
```

Type-check

```bash
npx tsc --noEmit
```

Lint

```bash
npm run lint
```

Env variables
- Frontend reads env from `.env` or `import.meta.env`.
- Common vars:
  - `VITE_API_BASE_URL` — base URL for backend (e.g., http://localhost:3000)
  - `VITE_ENABLE_MOCKS` — boolean for using local mock server

Notes
- Do not change folder structure. Coordinate any API-base URL changes with backend via `docs/API_CONTRACTS.md`.
