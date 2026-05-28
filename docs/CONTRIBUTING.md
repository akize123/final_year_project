Contributing & Code Style (short)

- Keep the existing project structure; avoid renaming `src` folders or exported component names.
- Commit messages: short subject + optional body.
- Branches: `feat/*`, `fix/*`, `chore/*`.
- Run tests and `npx tsc --noEmit` before opening PR.
- Format with Prettier and run `npm run lint`.

PR checklist
- Type-checks pass
- Linter passes
- No structural renames without team agreement
- Update `docs/API_CONTRACTS.md` for backend/contract changes
