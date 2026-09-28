# Testing

## Test Configuration

Tests use PHPUnit as configured by `phpunit.xml`. The test suite includes `tests/Feature/` and `tests/Unit/`. `RefreshDatabase` feature tests run against SQLite `:memory:` through PHPUnit environment overrides, not the current MySQL database. The workspace test task sets a temporary `APP_KEY` for the command process.

## Existing Tests

### Feature Tests

- `tests/Feature/CustomerAccountWorkflowTest.php`
  - `test_guest_can_browse_and_register_login_logout_as_a_customer`: public service/package API, active package + active service visibility, registration customer role, login, logout.
  - `test_customer_sees_only_owned_quote_requests_and_cannot_change_status`: owner-scoped list, quote submission with Pending default, denial of customer admin/status APIs.
- `tests/Feature/CustomerFeaturesApiTest.php`
  - `test_customer_favorites_are_private_and_admin_cannot_use_customer_routes`: customer favorites add/list/remove and per-user isolation; admin denied from customer routes.
  - `test_customer_can_review_only_their_completed_quote_and_role_cannot_be_changed`: completed quote eligibility, other-user quote rejection, review creation hidden by default, profile role remains customer during profile updates, password change.
  - `test_admin_can_approve_reviews_and_status_changes_notify_the_customer`: database notification creation/read state, customer listing, review visibility/publication/deletion.
- `tests/Feature/AdminDashboardApiTest.php`
  - `test_admin_can_manage_services_and_packages`: admin creates/updates/toggles service/package, nullable package price, feature array and counts.
  - `test_admin_can_view_quote_details_and_advance_status`: admin sees quote relations and can progress status; skip/reverse rejected.
  - `test_customers_and_guests_cannot_access_admin_apis`: authenticated customer gets 403.
  - `test_guests_cannot_access_admin_apis`: guest gets 401.
- `tests/Feature/ExampleTest.php`
  - `test_the_application_returns_a_successful_response`: Laravel root route returns 200.

### Unit Tests

- `tests/Unit/ExampleTest.php`
  - `test_that_true_is_true`: basic PHPUnit assertion; does not exercise NOVA business logic.

## Current Verified Result

The complete suite was run in this workspace while preparing these docs:

```text
Tests: 11 passed (96 assertions)
```

## Run Commands

With PHP on PATH (current PHP executable is `C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe`):

```powershell
$env:Path = 'C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64;' + $env:Path
$env:APP_KEY = 'base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
php artisan test --compact
```

Run one file or one test method:

```powershell
php artisan test --compact tests/Feature/CustomerAccountWorkflowTest.php
php artisan test --compact --filter=test_customer_sees_only_owned_quote_requests_and_cannot_change_status
```

Frontend production build:

```powershell
npm.cmd run build --prefix frontend
```

The build was verified separately during the previous implementation work; the current documentation-only task did not change frontend source. Browser-driven/manual UI interaction was not performed as part of this documentation task.

`frontend/package.json` currently has no `test` script. The available scripts are `dev`, `build`, `preview`, and `format`.
