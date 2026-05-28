Project Blueprint — AcademIQ Hub

Purpose
- Describe architecture, folder responsibilities, and backend contracts so backend work can continue without changing the frontend structure.

Principles
- Non-invasive: do not change current folder/file structure. Add docs only.
- Clear contracts: endpoints, auth expectations, request/response shapes.
- Local-developer friendly: scripts, ports, and env variables documented.

Frontend overview (key folders)
- `src/pages/` — app pages and per-role pages (Dashboard, ResearchShowcase, DocumentVerification, etc.).
- `src/components/` — UI components and dashboard widgets. Keep component API stable for backend.
- `src/contexts/` — Auth + Locale contexts; backend must honor auth tokens used here.
- `src/lib/utils.ts` — shared helpers (avoid structural changes).

Routing and role mapping
- Routing is handled in `src/pages/DashboardPage.tsx` where `user.role` selects dashboard components.
- Do not rename these exports or routes; backend endpoints must follow the API contract in `docs/API_CONTRACTS.md`.

Data flow
- Frontend expects JSON REST endpoints (or GraphQL if introduced later) returning typed objects (see API_CONTRACTS).
- File uploads are handled via standard multipart/form-data to a file upload endpoint; frontend uploads then references file ID in subsequent requests.

Where to extend (backend tasks)
- Implement REST API matching the contract in `docs/API_CONTRACTS.md`.
- Provide a local mock server or Swagger UI during integration if helpful.

Files added
- `docs/API_CONTRACTS.md` — OpenAPI-style contract and example responses.
- `docs/DEV_SETUP.md` — how to run frontend locally, ports, envs.
- `docs/BACKEND_INTEGRATION.md` — per-endpoint examples and auth.
- `docs/DB_SCHEMA.md` — suggested DB tables and columns.
- `docs/CONTRIBUTING.md` — short code-style and PR guidance.

Notes for backend developer
- Do not change import paths or exported component names in `src`.
- Add new endpoints; do not rename existing endpoints if frontend already wired to them.
- If you need to change a response shape, coordinate and update `docs/API_CONTRACTS.md` first.
