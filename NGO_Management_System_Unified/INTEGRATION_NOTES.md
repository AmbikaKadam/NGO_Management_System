# NGO Management System – Unified Frontend

Frontend only. No backend, API, database or real authentication.

## Run
```
npm install        # or: pnpm install
npm run dev        # http://localhost:8443  (port from the original vite config)
npm run build      # production build
```
Entry page is `/login` (demo sign-in, nothing is verified). After valid input it opens `/dashboard`.

## Structure (what was merged)
- Base project: `NGO_Management_System_Frontend` (theme, layout, all original pages, routes).
- `src/pages/birthday-donor/` – `ngoModules.tsx` + `sharedData.ts` from the donor/birthday ZIP (unchanged).
- `src/pages/people-management/`, `src/components/people/`, `src/hooks/usePersistentState.ts` – People Management module (moved from `src/pages/people/` so it does not collide with the base project's `src/pages/people/`).
- `src/pages/Login.tsx` – the only new feature.

## Routes
Original routes of the base project are untouched. Added: `/login`, `/birthday-project/*`, `/donor-management/admin/*`, `/people-management[/hr|/interns|/volunteers]`. The base project's own `/people/*` and `/donors/*` pages are kept and now listed in the sidebar as "People (Core)" and "Donors (Core)".

## Dependencies
All three modules were aligned to the base project's versions (React 19, recharts 3, lucide-react 1.x, Tailwind 4, Vite 8). The People module originally used React 18 / recharts 2 / lucide 0.468; no code changes were needed for it to type-check on the newer versions.
