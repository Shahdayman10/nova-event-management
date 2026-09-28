# NOVA Project Overview

## Project

**NOVA** is an event-planning and event-preparation website. It exposes a public catalog and information pages, and authenticated customer features for quote requests, favorites, profile updates, reviews, and notifications. An `admin` role uses a separate protected administration page and APIs.

This repository contains a Laravel API backend and a React single-page application under `frontend/`. The UI is routed by React Router; Laravel serves API routes in this implementation. `routes/web.php` currently contains only the Laravel welcome page.

## Technology

| Area | Verified value |
|---|---|
| Backend framework | Laravel Framework 13.31.0 (installed) |
| PHP | PHP 8.3.33 CLI in the current Laragon environment; Composer constraint `^8.3` |
| API authentication | Laravel Sanctum 4.3.3 personal access tokens |
| Frontend | React and React DOM 19.3.0; TypeScript |
| Frontend router | React Router DOM `^7.18.3` |
| Build/dev server | Vite 8.3.0 installed; package constraint `^8.0.5` |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite`, plus styles in `frontend/src/index.css` and shared page CSS classes |
| HTTP client | Axios `^1.20.0` |
| Current local DB config | `.env` currently selects MySQL at `127.0.0.1:3306`, database `nova_db`; credentials are deliberately not documented |
| Test DB config | PHPUnit sets SQLite `:memory:` in `phpunit.xml` |

Runtime checks in this workspace reported Node.js `v24.21.0` and npm `11.19.0`. Both `frontend/package-lock.json` and `frontend/pnpm-lock.yaml` exist. Their resolved versions differ (for example, the pnpm lock records React 19.2.4 and Vite 8.0.5 while the currently installed npm tree reports React 19.3.0 and Vite 8.3.0); the visible build task invokes `npm.cmd`.

## Architecture

- **Frontend:** `frontend/src/main.tsx` mounts `App`; `frontend/src/App.tsx` declares browser routes. Pages call a shared Axios instance in `frontend/src/services/api.ts`. Authentication state is managed by `AuthContext`; favorites state by `FavoritesContext`.
- **Backend:** Laravel controllers under `app/Http/Controllers/Api/` implement API behavior. `routes/api.php` registers the endpoints. Eloquent models in `app/Models/` express persistence and relations. `auth:sanctum`, `customer`, and `admin` middleware guard private endpoints.
- **Communication:** Axios uses the hard-coded base URL `http://127.0.0.1:8000/api`. If the backend host/port changes, this source value must be updated; there is no frontend environment-variable override in the inspected API service.
- **Authentication state:** The React app stores the bearer token and serialized user in local storage under `nova_token` and `nova_user`; Axios sends the token as `Authorization: Bearer ...`.

## Important Directories

```text
nova-backend/
├── app/
│   ├── Http/Controllers/Api/       # Public, customer, and admin API controllers
│   ├── Http/Middleware/            # Customer/admin role checks
│   ├── Models/                     # Eloquent models
│   └── Notifications/              # Database quote-status notification
├── bootstrap/app.php               # Middleware aliases and route bootstrap
├── config/                         # Laravel configuration, including DB/filesystems
├── database/
│   ├── migrations/                 # Schema migrations
│   ├── seeders/                    # Service and package catalog seeders
│   └── factories/                  # User factory for tests
├── routes/api.php                  # API route declarations
├── routes/web.php                  # Laravel welcome route
├── tests/                          # PHPUnit Feature and Unit suites
├── frontend/
│   ├── src/                        # React app source
│   ├── package.json                # Frontend scripts/dependencies
│   └── vite.config.ts              # React + Tailwind Vite plugins
└── docs/                           # Project handoff documentation
```

## Scope Notes

- The public reviews endpoint returns only reviews marked visible; no review seed data is defined in the database seeders.
- Package prices are nullable. The React package views display `Price on request` when the API returns `null`.
- `frontend/src/pages/GalleryPage.tsx` and several page sections define gallery imagery in frontend code rather than loading a gallery API.
- Current installed package versions and local DB connection values describe this workspace at documentation time; they are not deployment configuration guarantees.
