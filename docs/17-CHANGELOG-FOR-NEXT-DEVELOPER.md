# Changelog for the Next Developer

## Baseline Found

The project already contained Laravel API authentication with customer/admin roles, public service/package/review endpoints, customer quote requests/favorites/reviews/profile/notifications, admin service/package/request/review/customer APIs, a React NOVA site, an admin dashboard page, and feature tests. These were reviewed in their existing files; they were not recreated for this documentation task.

## Reviewed

- Backend models, controllers, middleware, notification, routes, migrations, seeders, and PHPUnit test configuration.
- React route tree, auth/favorites contexts, shared Navbar, pages, API client, and image/storage references.
- Installed PHP package versions, frontend package versions, current non-secret DB connection fields, registered API route inventory, and full test suite result.

## Confirmed Existing Code Change

`app/Http/Controllers/Api/PackageController.php` now returns only packages whose own `is_active` is true and whose related service is also active. Regression coverage is in `tests/Feature/CustomerAccountWorkflowTest.php` and checks that inactive packages and packages belonging to inactive services do not appear in the public listing.

## Changes Made for This Handoff

- Created the documentation set under `docs/` (index plus 17 numbered guides).
- No application source, test, migration, database, `.env`, or dependency changes were made as part of this documentation task.

## Verification

- Ran current full Laravel suite: 11 tests passed, 96 assertions.
- Current backend/ frontend installed versions were inspected; a frontend production build had passed in the preceding implementation work. No browser-driven/manual UI test was performed as part of this documentation task.
- No migrations were executed.

## Notes for the Next Developer

- The `.env` in this workspace currently configures MySQL database `nova_db`; `.env.example` uses SQLite defaults. PHPUnit itself uses SQLite `:memory:`.
- React API host is hardcoded to `http://127.0.0.1:8000/api`.
- The database seeders do not create an admin account.
- Prices are nullable; seeded package prices are `null`.
- Laravel filesystem disks exist in config, but source code does not currently use Storage APIs for NOVA image uploads.
