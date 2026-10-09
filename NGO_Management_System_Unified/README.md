# NGO Management System – Frontend (Project Management module)

## Run
```
pnpm install
pnpm dev      # development
pnpm build    # production build
```

## What's new
- Routes: `/projects`, `/projects/create`, `/projects/:id` (10 tabs), `/projects/reports`
- `src/types/project.ts` – all interfaces
- `src/data/` – mock projects, Excel-derived department checklists
- `src/services/projectApi.ts` – mock REST layer (endpoint noted above each function)
- `src/hooks/`, `src/components/projects/`, `src/pages/projects/management/`
- `API_CONTRACT.md` – every endpoint, request/response shape and suggested DB entities

## Notes
- Data is in-memory mock data and resets on reload.
- Role switcher (Admin / Project Manager / Viewer) is a prototype placeholder for real auth.
