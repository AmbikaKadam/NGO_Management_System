# Backend API

FastAPI service for authentication and persistent NGO data, backed by PostgreSQL, SQLAlchemy, Alembic, revocable JWT sessions, Argon2 password hashing, and role-based access control.

## Local setup

1. Install PostgreSQL for Windows and make sure its service is running. You can create the database and user in pgAdmin, or from a terminal with PostgreSQL's `psql` available:

```powershell
psql -h localhost -U postgres -d postgres
```

In the `psql` prompt, create a dedicated application login and database (replace the example password):

```sql
CREATE ROLE ngo_app LOGIN PASSWORD 'replace-with-a-strong-password';
CREATE DATABASE ngo_management OWNER ngo_app;
```

Exit `psql`, then run these commands from the repository root to initialize the schema and department data:

```powershell
psql -h localhost -U ngo_app -d ngo_management -v ON_ERROR_STOP=1 -f database\schema.sql
psql -h localhost -U ngo_app -d ngo_management -v ON_ERROR_STOP=1 -f database\seed.sql
```

2. Create the backend environment and install its dependencies:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
Copy-Item .env.example .env
```

Edit `backend\.env` and set `DATABASE_URL` to your PostgreSQL connection, for example:

```dotenv
DATABASE_URL=postgresql+psycopg://ngo_app:replace-with-a-strong-password@localhost:5432/ngo_management
```

Use a URL-safe database password (or percent-encode special characters in it). Generate a unique JWT secret in PowerShell:

```powershell
py -c "import secrets; print(secrets.token_urlsafe(48))"
```

Copy the output into `JWT_SECRET` in `.env`. Keep this file private and never commit it. Apply the backend migrations and start FastAPI:

```powershell
alembic upgrade head
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Verify the API and database connection in another PowerShell window:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/health
```

It should return `status: ok`. OpenAPI docs are at `http://127.0.0.1:8000/docs`.

3. In another terminal at the repository root, run the frontend:

```powershell
npm run dev --prefix frontend
```

Open `http://localhost:5174`. Register the first user, then promote that account to Admin in pgAdmin or `psql`:

```sql
UPDATE users SET role = 'Admin' WHERE email = 'your-admin-email@example.org';
```

Sign out and back in after changing the role. For later starts, start PostgreSQL, then run the backend command from `backend\` and the frontend command from the repository root. Localhost is for development; public production access requires deployment behind HTTPS with production environment settings.

## API

- Authentication: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`.
- Administration: `GET /api/admin/users` lists office accounts and `PATCH /api/admin/users/{user_id}/role` assigns one of the supported roles (`Admin`, `Project Manager`, `Staff`, `Volunteer`, or `Board`). Both endpoints require Admin access. Administrators cannot change their own role or demote the last active administrator.
- Dashboard: `GET /api/dashboard` returns persisted project, donation, volunteer assignment, beneficiary, event, task, proposal, and campaign summaries for Admin, Project Manager, and Staff roles.
- Feature modules are separated by page/domain in `app/api/`: `projects.py`, `beneficiaries.py`, `donors.py`, `events.py`, `people.py`, and `communications.py`. Each module owns its resource routes while sharing validation, persistence, and audit helpers from `records.py`. Authentication and administration remain in `auth.py` and `admin.py`.
- Data resources: authenticated JSON endpoints at `/api/{resource}` and `/api/{resource}/{id}`. Supported resource names include `projects`, `proposals`, `tasks`, `milestones`, `expenses`, `beneficiaries`, `donors`, `campaigns`, `contributions`, `events`, `staff`, `volunteers`, `intern-applications`, `communications`, `resources`, and related project planning tables. See each feature module and `app/api/records.py` for resource routes and per-resource write roles.
- Reports: `GET /api/reports/{progress|budget|impact|department|stakeholder}` returns report data; `/export?format=csv` downloads its table as CSV. The frontend Print / PDF action delegates to the browser print dialog. Native PDF/XLSX generation is not currently provided.

Resource lists use `limit` (1–200, default 50), `offset`, `search`, `sort`, `order=asc|desc`, and exact filters by column name in camelCase. Responses are `{ "items": [], "total": 0, "limit": 50, "offset": 0 }`. Create accepts `POST` with a JSON object, updates use `PATCH`, and deletes use `DELETE`. API field names are camelCase; database columns remain snake_case. Writes are recorded in `audit_logs`. Invalid inputs return 422, permission failures 403, missing records 404, and database constraint conflicts 409.

Public registration always creates a `Volunteer` account. Promote the first administrator only through a trusted database/bootstrap process:

```sql
UPDATE users SET role = 'Admin' WHERE email = 'admin@example.org';
```

Donor, beneficiary, staff, and operational data endpoints are limited to Admin, Project Manager, or Staff for reads; writes have additional per-resource restrictions. A signed-in user cannot assign their own role.

## Production deployment

- Use a managed PostgreSQL instance, least-privilege database credentials, TLS for database connections, regular backups, and tested restore procedures.
- Set `SESSION_COOKIE_SECURE=true`, `APP_ORIGIN` to the exact HTTPS frontend origin, a unique randomly generated `JWT_SECRET`, and a production `DATABASE_URL`. Never deploy `.env.example`.
- Terminate HTTPS at a trusted reverse proxy, restrict network access to the API/database, and configure proxy headers only for trusted proxies.
- Run migrations and apply schema/seed changes as a deployment step; do not run schema editing or seed commands on every app startup.
- Configure centralized logs, error monitoring, resource limits, and operational alerts. `/api/health` checks database connectivity.
- API persistence is implemented, and the dashboard, project report view, and events page use the API. Most other React feature pages still use mock data or browser storage. Connect those services and complete end-to-end acceptance testing before treating the full application as production-ready.

Run backend tests from the repository root with `pytest backend/tests`.
