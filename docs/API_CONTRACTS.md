API Contracts — AcademIQ Hub (minimal REST contract)

Auth
- All protected endpoints expect `Authorization: Bearer <token>` header.
- Token format: JWT (preferred). Frontend sends token from `AuthContext`.

Common response envelope
- Success: 200 OK with JSON object as defined per endpoint.
- Error: non-2xx with shape { error: string, code?: string, details?: any }

Endpoints (suggested)

1) POST /api/auth/login
- Body: { email: string, password: string }
- Response: { token: string, user: { id, name, email, role } }

2) GET /api/users/me
- Auth required
- Response: { id, name, email, role, avatarUrl? }

3) GET /api/projects
- Query params: page, limit, q (search), status
- Response: { items: Project[], total }
- Project: { id, title, authors, summary, imageUrl?, status }

4) GET /api/projects/:id
- Response: Project with full metadata and list of files

5) POST /api/uploads
- Multipart form-data file upload
- Response: { fileId: string, url: string, filename: string, size: number }

6) POST /api/submissions
- Body: { title, authors, files: [fileId], type, metadata }
- Response: created submission object

7) GET /api/reservations (Admin/Moderator)
- Response: { items: Reservation[], total }
- Reservation: { id, projectId, reservedByUserId, reservedAt, expiresAt }

8) GET /api/system/stats (Admin)
- Response: { totalUsers, activeSessions, pendingVerifications, storageUsed }

9) GET /api/system/logs (Admin)
- Query: page, limit
- Response: { items: AuditLog[], total }
- AuditLog: { id, time, action, actorId?, type }

10) POST /api/moderation/:id/verify
- Body: { action: 'approve'|'reject', note?: string }
- Response: updated resource

OpenAPI stub (YAML)
---
openapi: 3.0.0
info:
  title: AcademIQ Hub API
  version: 1.0.0
paths:
  /api/auth/login:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: OK

(Expand this file as backend evolves and keep in sync with frontend.)
