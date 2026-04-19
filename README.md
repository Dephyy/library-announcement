# Library System Monorepo

This repository is organized as a monorepo for a production-style library announcement and document management system.

## Structure

- `frontend/`: Next.js app (UI + client experience)
- `backend/`: Django API service
- `infrastructure/`: deployment and environment infrastructure assets
- `docs/`: architecture and implementation documentation

## Local-first workflow

This project is intentionally configured for localhost development first.

- No GitHub integration is required for local development.
- Frontend and backend communicate through local environment variables.
- Deployment settings are deferred until after local validation.

## Step 1 completion goals

- Monorepo directories exist
- Frontend can boot and expose health endpoint
- Backend can boot and expose health endpoint
- Shared environment templates are defined

## Run locally (Windows)

- Double-click `run-local.bat` in the repository root, or run `.\run-local.bat` in PowerShell.
- It starts:
  - Django backend on `http://localhost:8000`
  - Next.js frontend on `http://localhost:3000` (or next available port)
- Stop services with `.\stop-local.bat`.

## Seed demo data

Run this command from `backend/` to load forum-style demo content:

- `.\.venv\Scripts\python manage.py seed_data --reset`

This seeds:

- local users (`admin`, `librarian`, sample students)
- forum posts with threaded comments
- document repository records

## Local test credentials

- Admin: `admin` / `Admin@123`
- Librarian: `librarian` / `Lib@123`

## Route map for testing

- Public:
  - `/`
  - `/announcements`
  - `/announcements/[id]`
  - `/documents`
  - `/login`
- Protected:
  - `/portal`
  - `/portal/posts`
  - `/portal/documents`

## Rate limiting (DRF throttling)

The backend uses Django REST Framework throttling for `/api/*` routes.

- `API_RATE_LIMIT_ENABLED` (default: `true`)
- `API_THROTTLE_ANON_RATE` (default: `120/min`)
- `API_THROTTLE_USER_RATE` (default: `240/min`)
