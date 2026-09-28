# Developer Handoff

## Start Here

1. `docs/01-PROJECT-OVERVIEW.md`
2. `docs/02-SETUP-AND-RUN.md`
3. `docs/03-BACKEND-ARCHITECTURE.md`
4. `docs/07-FRONTEND-ARCHITECTURE.md`
5. `docs/04-API-DOCUMENTATION.md`
6. `docs/08-FEATURES-MAP.md`
7. `docs/06-DATABASE.md`

## If You Change Backend Behavior

Read the relevant controller in `app/Http/Controllers/Api/`, model in `app/Models/`, role middleware in `app/Http/Middleware/`, route definition in `routes/api.php`, and migration(s) in `database/migrations/`. Add/update a focused feature test under `tests/Feature/`. Avoid editing `.env` or applying migrations to shared data without an approved environment plan.

## If You Change an API

- Route registration: `routes/api.php`.
- Behavior/input validation/JSON response: owning controller under `app/Http/Controllers/Api/` or `Api/Admin/`.
- Persistence/relationships: `app/Models/` and migrations.
- API tests: `tests/Feature/`.
- Contract inventory: update `docs/04-API-DOCUMENTATION.md`.

There are no separate Form Request or API Resource classes in the current source tree; validation and response serialization are in controllers/Eloquent JSON.

## If You Change Customer UI

- Page: `frontend/src/pages/`.
- Shared Navbar/Footer: `frontend/src/components/shared.tsx`.
- Route protection: `frontend/src/components/ProtectedRoute.tsx` and `frontend/src/App.tsx`.
- Auth: `frontend/src/context/AuthContext.tsx`.
- Favorites: `frontend/src/context/FavoritesContext.tsx`.
- HTTP client: `frontend/src/services/api.ts`.

## If You Change Admin

- UI sections and API calls are in `frontend/src/pages/AdminDashboardPage.tsx`.
- Admin route is in `frontend/src/App.tsx`.
- API URLs/controller mapping are in `routes/api.php` and `app/Http/Controllers/Api/Admin/`.
- Backend role protection is `app/Http/Middleware/AdminMiddleware.php`, registered in `bootstrap/app.php`.
- Test Admin/customer/guest permission cases in `tests/Feature/AdminDashboardApiTest.php` and `tests/Feature/CustomerFeaturesApiTest.php`.

## Suggested Feature Path

Follow the current code structure rather than assuming layers that do not exist:

```text
Migration (if persistence changes)
→ Eloquent Model/relation (if needed)
→ Controller validation and behavior
→ routes/api.php + middleware
→ Feature test
→ frontend/src/services/api.ts usage
→ existing Context or page state as appropriate
→ frontend route/page/component
→ docs/API and feature maps
```

Frontend API calls currently live in consuming pages/contexts and use the shared Axios client; there is not a separate generated API-client layer.

## Operational Notes

- Local current DB config is MySQL `nova_db`; `.env.example` defaults to SQLite. Never assume environment parity.
- PHPUnit uses SQLite `:memory:`.
- Current API base is fixed at `http://127.0.0.1:8000/api`.
- Seeders cover services and packages only; no seeded administrator.
- `npm.cmd run build --prefix frontend` and `php artisan test --compact` are the main verification commands.
