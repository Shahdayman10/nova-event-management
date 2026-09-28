# Database

## Connection Configuration

At documentation time, the current root `.env` selects MySQL (`DB_CONNECTION=mysql`, `DB_HOST=127.0.0.1`, `DB_PORT=3306`, `DB_DATABASE=nova_db`). Credentials are intentionally omitted. `.env.example` instead defaults to SQLite. PHPUnit overrides this with in-memory SQLite (`DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:`) in `phpunit.xml`.

The schema described below is derived from migration files. No migrations were run while preparing this document; this guide does not claim every migration is applied to the currently configured MySQL database.

## Migration Inventory

| Migration file | Tables / changes | Important columns, constraints and relations |
|---|---|---|
| `database/migrations/0001_01_01_000000_create_users_table.php` | `users`, `password_reset_tokens`, `sessions` | User: id, name, unique email, email verification timestamp, password, remember token, timestamps. Sessions has nullable indexed `user_id`; no FK is declared in this migration. |
| `database/migrations/0001_01_01_000001_create_cache_table.php` | `cache`, `cache_locks` | Cache keys, values, expiration; no NOVA business relation. |
| `database/migrations/0001_01_01_000002_create_jobs_table.php` | `jobs`, `job_batches`, `failed_jobs` | Laravel queue infrastructure. `failed_jobs.uuid` unique; queue index fields. |
| `database/migrations/2026_09_15_152546_create_services_table.php` | `services` | name, unique slug, nullable description/image, `is_active` default true, timestamps. |
| `database/migrations/2026_09_15_153303_create_packages_table.php` | `packages` | `service_id` FK to services with cascade delete; name, slug, nullable description, nullable decimal(10,2) price, nullable JSON features, nullable image, `is_active`; unique (`service_id`, `slug`). |
| `database/migrations/2026_09_15_154439_create_quote_requests_table.php` | `quote_requests` | `user_id` FK cascade delete; `service_id` FK restrict delete; nullable `package_id` FK null on delete; event_type, event_date, event_location, nullable message; enum status `pending`, `confirmed`, `completed`, default pending. |
| `database/migrations/2026_09_18_121538_create_personal_access_tokens_table.php` | `personal_access_tokens` | Sanctum polymorphic tokenable, token name, unique token hash, abilities, last-used/expires timestamps. |
| `database/migrations/2026_09_18_124341_add_role_to_users_table.php` | alters `users` | Adds string `role`, default `customer`, after password. Current app uses `customer` and `admin`. |
| `database/migrations/2026_09_26_000001_create_customer_features_tables.php` | `user_favorite_services`, `user_favorite_packages`, `reviews`, `notifications` | Favorite pivots have user and target FKs with cascade delete, timestamps, unique user-target pair. Review has user FK cascade; service FK restrict; unique quote request FK cascade; unsigned rating; comment; `is_visible` default false. Notifications uses UUID primary key, polymorphic notifiable, data, read_at, timestamps. |

## Table Summary

| Table | Purpose | Main relations |
|---|---|---|
| `users` | Customer/admin accounts | Has many quote requests/reviews; polymorphic notifications; favorite pivots; Sanctum tokens. |
| `services` | Publicly cataloged service offerings | Has many packages/quote requests/reviews; many-to-many users via `user_favorite_services`. |
| `packages` | Optional service packages and nullable price | Belongs to service; has many quote requests; many-to-many users via `user_favorite_packages`. |
| `quote_requests` | Customer event inquiries and status | Belongs to user/service/optional package; has one review. |
| `reviews` | Customer review connected to a completed quote | Belongs to user, service, quote request; unique quote_request_id. |
| `user_favorite_services` | User-service favorite join | user_id ↔ service_id. |
| `user_favorite_packages` | User-package favorite join | user_id ↔ package_id. |
| `notifications` | Laravel database notification storage | Polymorphic (`notifiable_type`, `notifiable_id`) typically to User. |
| `personal_access_tokens` | Sanctum API tokens | Polymorphic tokenable, normally User. |
| `password_reset_tokens`, `sessions`, `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs` | Laravel framework infrastructure | Relations/usage follow Laravel config; not NOVA feature entities. |

## Eloquent Relationships

- `User` → many `QuoteRequest` and `Review`; many-to-many `Service` through `user_favorite_services`; many-to-many `Package` through `user_favorite_packages`.
- `Service` → many `Package`, `QuoteRequest`, and `Review`; many-to-many favorite users.
- `Package` → belongs to `Service`; many `QuoteRequest`; many-to-many favorite users.
- `QuoteRequest` → belongs to `User`, `Service`, and optional `Package`; has one `Review`.
- `Review` → belongs to `User`, `Service`, and `QuoteRequest`.
- `Notification` has no NOVA model class; `User` uses Laravel's `Notifiable` trait and database notification relation.

## Status and Role Values

- `users.role`: string default `customer`; application role checks use `customer` or `admin`.
- `quote_requests.status`: DB enum/default `pending`; admin controller only accepts `pending`, `confirmed`, `completed` and allows one-step forward transitions.
- `reviews.is_visible`: boolean default false; only visible reviews appear through the public reviews endpoint.
- `services.is_active` and `packages.is_active`: boolean default true.

## Seed Data

`DatabaseSeeder` calls `ServiceSeeder` and `PackageSeeder`. These seeders define six named service categories and packages with `price => null`. `PackageSeeder` uses `updateOrCreate` per service/slug. No users, admin, reviews, or notification records are seeded by these classes.
