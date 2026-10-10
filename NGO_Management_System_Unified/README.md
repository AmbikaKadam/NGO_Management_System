# NGO Management System

A frontend-only NGO operations prototype built with React, TypeScript, and Vite. It combines project management, events, beneficiaries, donor management, birthday engagement, people management, reporting, and administration. There is no backend or production authentication; project services use mock data, and some modules persist prototype state in the browser.

## Requirements

- Node.js 22 (see `.mise.toml`)
- pnpm 10.34.3 (see `.mise.toml`)

## Development

```sh
pnpm install
pnpm dev       # Vite on http://localhost:5174 by default
pnpm build     # production build in dist/
pnpm preview   # preview the build on port 8443 by default
pnpm format    # format files with oxfmt
```

Set `PORT` to override the development or preview port. The dev server uses `5174` by default; preview uses `8443`.

## Sign-In

Open `/login` and use the demo sign-in flow to reach `/dashboard`. Credentials are not verified by a server. The app uses client-side routes and redirects unknown paths to `/login`.

## Modules

- Core operations: dashboard, projects, proposals, planning, events, beneficiaries, resources, occasions, engagement, outcomes, communications, reports, and administration.
- Birthday Project: `/birthday-project/dashboard`, `/profiles`, `/occasions`, `/engagement`, `/outcomes`, `/departments`, `/reports`, and `/action-workspace`.
- Donor Management: `/donor-management/admin/dashboard`, `/directory`, `/contributions`, `/campaigns`, `/communications`, `/followup`, and `/reports`.
- People Management: `/people-management`, `/people-management/hr`, `/people-management/interns`, and `/people-management/volunteers`.

Project management routes include `/projects`, `/projects/create`, `/projects/planning`, `/projects/proposals`, `/projects/reports`, and `/projects/:id`.

## Project Map

- `src/App.tsx` registers routes; `src/components/Layout.tsx` defines the shared application shell and navigation.
- `src/pages/` contains the feature modules; `src/components/` contains shared UI.
- `src/services/projectApi.ts`, `src/data/`, and `src/hooks/` provide the project mock API, seed data, and data hooks.
- `src/types/project.ts` defines project-domain types.
- `API_CONTRACT.md` documents the proposed project API and data model. It is a backend integration contract, not a live API.
- `.figma/make/` contains Figma Make development and deployment integration scripts.

## Data and Authentication

This repository contains no API server or database. Project data is mock data; changes may reset on reload. Browser-persisted prototype state is local to the current browser. The login flow and role controls are demonstrations, not security boundaries.
