Suggested DB Schema (relational)

users
- id (uuid, pk)
- name
- email (unique)
- password_hash
- role (admin|moderator|lecturer|student)
- created_at

projects
- id (uuid, pk)
- title
- summary
- status (published|under_review|archived)
- created_by (fk users.id)
- created_at

files
- id (uuid, pk)
- project_id (fk projects.id)
- filename
- url
- size
- uploaded_by (fk users.id)
- uploaded_at

submissions
- id
- project_id
- submitter_id
- type
- metadata (json)
- status

reservations
- id
- project_id
- reserved_by
- reserved_at
- expires_at

audit_logs
- id
- time
- action
- actor_id
- details (json)

Notes
- Use indexes on `created_at`, `status`, and FK columns for performance.
- For large file storage use object storage (S3/GCS) and store `url` in DB.
