# Library Announcement & Document System

Monorepo for a **library announcements forum**, **document repository**, and **staff portal**. The public site is a Next.js “Atheneum” shell; the API is a Django REST service with SQLite and local file storage for development.

## Repository layout

| Path | Purpose |
|------|---------|
| `frontend/` | Next.js App Router UI, portal routes, and thin API routes that proxy to the backend |
| `backend/` | Django 5.x + Django REST Framework API, SQLite DB, seeded demo data |
| `docs/` | Additional architecture notes (e.g. `docs/architecture.md`) |

## What the system does

### Public (unauthenticated)

- **Home** (`/`) — Featured announcement feed with **search** (`q`), **sort** (`new` \| `top` \| `hot`), and **pagination** (`limit`, `offset`).
- **Announcements** (`/announcements`, `/announcements/[id]`) — Full list and post detail.
- **Forum-style interaction** — **Up/down votes** on posts (stored as a net score; intended for local/demo use, not per-user deduplication). **Comments** on posts with a display **author name** and body.
- **Documents** (`/documents`) — Searchable list of uploaded documents with metadata (title, category, keywords, file link).
- **Notifications** — UI pulls **library notifications** from the backend (demo content when seeded).
- **Health** — `GET /health` on the frontend returns `{ "status": "ok" }`.

### Portal (authenticated in the Next.js app)

Routes under `/portal/*` require an **HTTP-only cookie** (`library_portal_auth`). Middleware redirects unauthenticated users to `/login`.

- **`/portal`** — Dashboard: backend health check, snapshot counts of posts and documents, navigation to management pages.
- **`/portal/posts`** — Create new announcement posts (submitted via a server route to the Django API).
- **`/portal/documents`** — Upload documents (PDF, PNG, or JPEG per backend rules), with category/keywords; uses presigned-style **upload URL** flow against the local backend and registers metadata afterward.

**Portal login (local development)** is implemented in the frontend (`/api/local-auth/login`): only **`admin`** and **`librarian`** match the built-in allowlist. The cookie stores `role:username` (e.g. `ADMIN:admin`). This is separate from Django session auth; the backend `/api/auth/session/` reflects **Django** users when session auth is used (e.g. from the admin site).

### Backend API (Django)

Base path: `http://localhost:8000/api/` (override with `NEXT_PUBLIC_API_URL` on the frontend).

| Area | Endpoints (summary) |
|------|---------------------|
| Health | `GET /api/health/` |
| Posts | `GET/POST /api/posts/`, `GET /api/posts/<id>/`, `POST /api/posts/<id>/vote/`, `GET/POST /api/posts/<id>/comments/` |
| Documents | `GET/POST /api/documents/`, `POST /api/documents/upload-url/`, `PUT /api/documents/local-upload/<object_name>` (local dev upload) |
| Notifications | `GET /api/notifications/` |
| Session | `GET /api/auth/session/` |

Uploaded files are served under `/uploads/…` in development (see Django `urls.py` and `document_service`).

## Local-first workflow

- No GitHub integration is required for local development.
- Frontend and backend talk over `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000/api`).
- Production deployment concerns are out of scope for the default README; treat current settings as **development-oriented**.

## Run locally (Windows)

1. Create the backend venv if needed: `python -m venv backend\.venv`
2. From the repo root, run **`run-local.bat`** (or `.\run-local.bat` in PowerShell).

It will:

- Start Django on `http://localhost:8000` (health: `http://localhost:8000/api/health/`)
- Start Next.js on the first free port in **3000–3010** and open it in the browser
- Open the backend health URL

Stop services with **`stop-local.bat`**.

### Frontend environment

- `NEXT_PUBLIC_API_URL` — Base URL for the Django API (include the `/api` suffix), e.g. `http://localhost:8000/api`. If unset, the app uses that default.

## Seed demo data

From `backend/`:

```bash
.\.venv\Scripts\python manage.py seed_data --reset
```

`--reset` clears existing posts, comments, notifications, and documents, then reseeds.

Seeded content includes:

- Django users: **admin**, **librarian**, **student1**, **student2** (default passwords: `Admin@123`, `Lib@123`, `Student@123` for both students)
- Forum posts with threaded comments
- `LibraryNotification` rows for the notifications UI
- Sample `Document` records

## Credentials (local testing)

**Portal login (Next.js allowlist)** — use these on `/login`:

- **Admin:** `admin` / `Admin@123`
- **Librarian:** `librarian` / `Lib@123`

Seeded **student** accounts exist in the database for data realism; they are **not** enabled for the simplified portal login unless you extend `LOCAL_USERS` in the login route.

Django **admin** (`http://localhost:8000/admin/`) requires a **staff/superuser** account. Create one with `python manage.py createsuperuser` from `backend/` if you have not already.

## Route map (frontend)

| Area | Paths |
|------|--------|
| Public | `/`, `/announcements`, `/announcements/[id]`, `/documents`, `/login` |
| Portal (cookie required) | `/portal`, `/portal/posts`, `/portal/documents` |

## Rate limiting (DRF throttling)

The backend applies Django REST Framework throttling to `/api/*` when enabled:

- `API_RATE_LIMIT_ENABLED` (default: `true`)
- `API_THROTTLE_ANON_RATE` (default: `120/min`)
- `API_THROTTLE_USER_RATE` (default: `240/min`)

## Security note (local development)

The repository ships with **development defaults** (e.g. `DEBUG = True`, a committed `SECRET_KEY` in settings). Replace secrets, disable debug, enforce HTTPS, and harden authentication before any real deployment.
