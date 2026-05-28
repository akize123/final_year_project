# AUCA Connect Publication Hub

## 1. Project Idea

AUCA Connect Publication Hub is a university-focused digital repository for academic output.  
It centralizes student projects, theses, and lecturer publications in one platform where users can:

- submit work for review,
- moderate and publish approved submissions,
- browse published content,
- reserve controlled access to memoirs/full documents,
- and monitor activity through role-based dashboards and admin reports.

The core goal is to improve visibility, quality control, and long-term access to AUCA academic knowledge.

## 2. Vision and Objectives

- Build a trusted institutional archive for AUCA.
- Standardize submission and moderation workflows.
- Support transparent review and audit history.
- Encourage research continuity by making prior work searchable and reusable.
- Protect sensitive content using reservation and AUCA-only access rules.

## 3. Target Users

- Students
- Lecturers / Supervisors
- Moderators (review/quality gatekeepers)
- Administrators

## 4. Core Features

### 4.1 Authentication and Access Control

- Role-based login (`student`, `lecturer`, `moderator`, `admin`).
- Protected routes for authenticated areas.
- Demo accounts for each role.
- Login safety UX with failed-attempt lockout behavior.

### 4.2 Role-Based Dashboards

- Dynamic dashboard rendering based on signed-in user role.
- Student dashboard for submission progress and reservation shortcuts.
- Lecturer dashboard for publications and supervised activity.
- Moderator dashboard for queue insights and quick review actions.
- Admin dashboard for platform metrics and operations overview.

### 4.3 Repository Browsing and Discovery

- Search by title, abstract, or department.
- Tabs by content type:
  - Student Projects
  - Lecturer Publications
  - Theses
- Sort options (recent, views, title).
- Published-only listing in browse view.
- Detail cards with type, year, availability, abstract preview, and view stats.

### 4.4 Project / Publication Detail Page

- Full metadata view (authors, supervisor, department, level, dates).
- Keywords and technology stack.
- Metrics (views, reservations, access count).
- Optional GitHub section:
  - repository metadata,
  - stars/forks/languages,
  - final commit/tag snapshot,
  - README preview.
- Memoir/full document access with availability constraints.

### 4.5 Submission Workflows

#### Project Submission (Student)

3-step workflow:

1. Project metadata (title, abstract, department, category, keywords/tech stack, co-authors).
2. Memoir upload simulation (progress and verification feedback).
3. GitHub repository linking and final archive marking.

#### Publication Submission (Lecturer)

- Multi-step flow with metadata entry, document upload, optional DOI, and moderation submission.

### 4.6 Moderation and Publishing

- Moderation queue with status tabs (Pending, Published, Hidden, Archived, etc.).
- Actions:
  - Approve
  - Reject (with reason/template)
  - Request re-upload
  - Mark duplicate
  - Hide
  - Archive
- Expandable moderation history per item.

### 4.7 Reservation and Access Management

- Slot-based memoir reservation model.
- Availability states:
  - Available
  - Reserve to Access
  - Fully Reserved
  - AUCA Only
- Reservation request, cancellation, active/upcoming/completed states.
- Waitlist behavior when slots are full.

### 4.8 Notifications and Help

- In-app notification feed (approval, reservation, reminders, rejection/reupload, system events).
- Help page with policy guidance (hours, limits, submission steps, renewals, GitHub linking).

### 4.9 Admin Operations

- User management (status/role management actions).
- Reservation policy settings.
- Access schedule management.
- Reports by domain (moderation, GitHub integration, reservation analytics, audit log).
- Platform settings and backup trigger UI.

## 5. Functional Modules (Current UI Scope)

- Landing and login
- Dashboard module
- Browse repository module
- Detail view module
- Submission modules (project/publication)
- Moderation module
- Reservation module
- Notification module
- Help/support module
- Admin module

## 6. Routing Map

Public routes:

- `/`
- `/login`

Protected routes:

- `/dashboard`
- `/browse`
- `/projects/:id`
- `/publications/:id`
- `/my-submissions`
- `/my-publications`
- `/my-reservations`
- `/submit/project`
- `/submit/publication`
- `/supervised`
- `/moderation`
- `/notifications`
- `/help`
- `/admin/users`
- `/admin/reservations`
- `/admin/schedule`
- `/admin/reports`
- `/admin/settings`

## 7. Data Model Snapshot (Mock Data)

The current implementation uses front-end mock datasets for:

- Projects/publications/theses
- Users
- Reservations
- Notifications
- Moderation log
- Audit log

Key fields represented include:

- submission metadata,
- access/availability status,
- moderation status,
- GitHub archive info,
- role and department identity,
- reservation time windows.

## 8. Technology Stack

Frontend:

- React 18 + TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui + Radix primitives
- Recharts
- Lucide icons

Tooling and quality:

- ESLint
- Vitest
- Playwright (configured)

## 9. Current State and Limitations

Current project state is a working front-end prototype with realistic workflows and role-based UX.

Known limitations:

- No production backend/API integration yet.
- No persistent database connection yet.
- Authentication is mock/demo based.
- File upload and GitHub integration are simulated UI flows.
- Moderation/admin actions currently update UI state only.

## 10. Suggested Next Implementation Phase

1. Add backend services (auth, submissions, moderation, reservations, notifications).
2. Connect persistent storage (PostgreSQL or equivalent).
3. Integrate real document storage and retrieval.
4. Implement real GitHub OAuth + repository snapshot capture.
5. Add server-side audit logging and policy enforcement.
6. Add end-to-end tests for submission-to-publication lifecycle.

## 11. Local Development

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build
npm run test
npm run lint
```

## 12. Demo Accounts (Current Prototype)

- `student@auca.ac.rw`
- `lecturer@auca.ac.rw`
- `moderator@auca.ac.rw`
- `admin@auca.ac.rw`

Any password works in demo mode.
