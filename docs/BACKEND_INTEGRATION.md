Backend Integration Guide

Goal
Provide concrete examples backend developers can implement without modifying frontend structure.

Auth
- Issue JWTs at `/api/auth/login` and ensure `/api/users/me` returns the same user object used by the frontend `AuthContext`.

Headers
- Protected endpoints require `Authorization: Bearer <token>`.
- Responses should use `application/json`.

Examples

GET /api/system/stats
Response 200
{
  "totalUsers": 1245,
  "activeSessions": 84,
  "pendingVerifications": 42,
  "storageUsed": 78
}

POST /api/uploads (multipart/form-data)
- form field name: `file`
Response 201
{
  "fileId": "abc123",
  "url": "https://cdn.example.com/abc123",
  "filename": "paper.pdf",
  "size": 234567
}

GET /api/projects
Response 200
{
  "items": [ { "id": "p1", "title": "...", "imageUrl": "..." } ],
  "total": 12
}

Reservations (Moderator)
- GET `/api/reservations` returns list the moderator UI expects (see `src/pages/...` usage).

Error handling
- Use consistent error shape: { error: string, code?: string }

Versioning
- Prefix unstable changes under `/api/v2/...` and coordinate update with frontend.

Mocking during integration
- Backend can expose a Swagger UI or a `/mocks` JSON server; set `VITE_API_BASE_URL` to the mock URL during frontend dev.
