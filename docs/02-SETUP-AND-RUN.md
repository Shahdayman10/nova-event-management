# Setup and Run

## Workspace and Prerequisites

The current Windows workspace is `C:\laragon\www\nova-backend`.

Verified toolchain in this workspace:

- PHP CLI: `C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe` (PHP 8.3.33). `php` was not initially available through the shell `PATH`.
- Composer: `C:\laragon\bin\composer\composer.bat` (Composer 2.10.2). Composer needs the Laragon PHP directory on `PATH` to find PHP in this workspace.
- Node.js: v24.21.0; npm: 11.19.0.
- MySQL: `.env` currently selects `mysql`, host `127.0.0.1`, port `3306`, database `nova_db`. Username/password are machine-specific and must be read from the developer's local environment, not this guide.

The project manifest constrains PHP to `^8.3`; `composer.json` and `frontend/package.json` define dependency ranges. `vendor/` and `frontend/node_modules/` are present in the current workspace, but a fresh checkout must install dependencies.

## Environment

Laravel reads `.env` at the repository root. `.env.example` is a template and currently defaults to SQLite, while the current `.env` selects MySQL and `nova_db`. Do not replace an existing local `.env` blindly. For a new environment:

1. Copy `.env.example` to `.env` if no `.env` exists.
2. Set the database connection and credentials for the chosen local database.
3. Set `APP_URL` to the local backend URL, and generate an application key.
4. The React API client currently targets `http://127.0.0.1:8000/api` in `frontend/src/services/api.ts`.

Example PowerShell setup commands (run from the project root):

```powershell
$env:Path = 'C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64;C:\laragon\bin\composer;' + $env:Path
Copy-Item .env.example .env
php artisan key:generate
```

Only copy `.env.example` when creating a new environment. The command above does not edit the current machine's `.env` by itself unless explicitly run.

## Dependencies

From the project root:

```powershell
$env:Path = 'C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64;C:\laragon\bin\composer;' + $env:Path
composer install
npm.cmd install --prefix frontend
```

Both `frontend/package-lock.json` and `frontend/pnpm-lock.yaml` exist, but the visible workspace build task uses `npm.cmd`; the repository does not declare a `packageManager` field in `frontend/package.json`. The lockfiles record different resolved dependency versions, so choose one package manager consistently for a new checkout and avoid mixing installs.

## Database

The current `.env` specifies database `nova_db`. Ensure MySQL is running, create/configure the database, and set valid credentials in `.env` before connecting. `.env.example` instead defaults to SQLite.

For an empty, disposable development database only, migrations and catalog seeding can be run with:

```powershell
php artisan migrate --seed --no-interaction
```

This command changes the selected database. Do not run it against a shared or production database without following the deployment process. `DatabaseSeeder` invokes `ServiceSeeder` and then `PackageSeeder`; it does not create an admin user. The seeders use `updateOrCreate`, so seeding can update matching service/package catalog rows.

No migration or database-writing command was run while preparing this documentation.

## Run Both Applications

Start the Laravel backend in one terminal:

```powershell
$env:Path = 'C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64;' + $env:Path
php artisan serve --host=127.0.0.1 --port=8000
```

Start React/Vite in a second terminal, from the project root:

```powershell
npm.cmd run dev --prefix frontend -- --host 127.0.0.1 --port 5173
```

Open `http://127.0.0.1:5173/`. The React app calls the API at `http://127.0.0.1:8000/api`. The Laravel health route is `/up`.

The dev server port is supplied explicitly in the workspace task; Vite's default may differ if no port is specified.

## Useful Commands

```powershell
# API route inventory
php artisan route:list --path=api --except-vendor --no-interaction

# Full Laravel test suite
$env:APP_KEY = 'base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
php artisan test --compact

# Composer-defined test script (also clears Laravel config cache first)
composer test

# One feature test file
php artisan test --compact tests/Feature/CustomerAccountWorkflowTest.php

# Frontend production build
npm.cmd run build --prefix frontend

# Frontend formatter script
npm.cmd run format --prefix frontend

# Frontend dev server
npm.cmd run dev --prefix frontend -- --host 127.0.0.1 --port 5173
```

On the current PowerShell workspace tasks, tests set a temporary `APP_KEY` inline for the test process. PHPUnit uses an in-memory SQLite DB, so the test suite does not use the configured MySQL database.

The Composer `setup` script is defined in `composer.json`; it runs Composer install, key generation, `php artisan migrate --force`, npm install, and build. Because it performs a forced migration on the configured database, do not run it casually against an existing database.

The workspace task file `.vscode/tasks.json` includes frontend build/dev and Laravel test tasks. It contains duplicate task labels, and its admin provisioning task points to `_admin_setup_check.php`, which is absent from this workspace; do not treat that task as a verified setup command.
