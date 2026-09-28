# Recent Changes and Tooling State

## Package Visibility Fix

The current `app/Http/Controllers/Api/PackageController.php` query applies both:

- `where('is_active', true)` to the package itself.
- `whereHas('service', ...)` requiring the related service to have `is_active=true`.

Therefore the public catalog excludes active packages whose parent service is inactive. The regression case is in `tests/Feature/CustomerAccountWorkflowTest.php`, in `test_guest_can_browse_and_register_login_logout_as_a_customer`: it creates an active service/package, an inactive service with active package, and inactive package; it asserts only the valid active package appears from `GET /api/packages`.

## Verification

The current Laravel full-suite run during this documentation task passed with 11 tests and 96 assertions. The package visibility test is included. No database migration was run for this documentation work.

## Files and Tooling Checked

- `AGENTS.md`: exists and contains Laravel Boost project guidance.
- `boost.json`: exists; configures Boost guidelines for the `copilot` agent.
- `composer.json`: includes `laravel/boost` under `require-dev` and Laravel/Pint/PHPUnit dependencies.
- Laravel Pint is installed through Composer; the source PHP files were formatted during the prior code change. No PHP files are modified by this documentation task.
- Laravel Boost package is installed; installed version observed in this workspace was 2.9.1.
- `tests/Feature/CustomerAccountWorkflowTest.php`: contains the regression coverage described above.

## Documentation Scope

This documentation task creates files under `docs/` only. It does not modify application code, tests, `.env`, migrations, or database content. No packages were installed as part of this documentation task.
