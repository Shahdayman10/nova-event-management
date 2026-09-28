# Backend Architecture

## Request Path

API routes are in `routes/api.php`; Laravel's API routing bootstrap is in `bootstrap/app.php`. Controllers use Eloquent models, validate request input inline with `$request->validate()`, and return JSON responses. There are no dedicated Form Request, API Resource, Policy, Gate, or application Service classes in the current source tree. Role middleware aliases are registered in `bootstrap/app.php`.

## Models

| Model | File | Main fields / behavior | Relations and use |
|---|---|---|---|
| `User` | `app/Models/User.php` | `name`, `email`, `password`, `role` (role is migrated separately); hides password and remember token; hashed password cast | Has many quote requests and reviews; many-to-many favorites for services/packages; Sanctum tokens; Laravel `Notifiable` notifications. Used by auth, profile, quote, review, customer admin APIs. |
| `Service` | `app/Models/Service.php` | `name`, unique `slug`, nullable `description`, nullable `image`, `is_active` | Has many packages, quote requests, reviews; many-to-many favoriting users. Used by catalog, quote, review, admin service endpoints. |
| `Package` | `app/Models/Package.php` | `service_id`, `name`, `slug`, nullable `description`, nullable decimal `price`, nullable JSON `features`, nullable `image`, `is_active` | Belongs to service; has many quote requests; many-to-many favoriting users. Used by package catalog, quote, favorites, admin package endpoints. |
| `QuoteRequest` | `app/Models/QuoteRequest.php` | `user_id`, `service_id`, nullable `package_id`, `event_type`, `event_date`, `event_location`, nullable `message`, `status` | Belongs to user/service/package; has one review. Used by customer requests, admin status changes, review eligibility. |
| `Review` | `app/Models/Review.php` | `user_id`, `service_id`, `quote_request_id`, `rating`, `comment`, `is_visible` default false | Belongs to user/service/quote request. Used by public reviews, customer submissions, admin moderation. |

`User` declares mass-assignment fields as `name`, `email`, `password`; registration sets `role` explicitly with `forceFill`, and profile updates only accept their validated fields. Role is not an editable profile input.

## Controllers

`app/Http/Controllers/Controller.php` is the abstract Laravel base controller and currently contains no NOVA-specific behavior.

### Public and Customer API

- `app/Http/Controllers/Api/AuthController.php`: `POST /api/register` → `register`; `POST /api/login` → `login`; `POST /api/logout` → `logout`. Creates customers, checks credentials, issues/revokes Sanctum personal access tokens.
- `app/Http/Controllers/Api/ServiceController.php`: `GET /api/services` → `index`; returns active services.
- `app/Http/Controllers/Api/PackageController.php`: `GET /api/packages` → `index`; eager-loads service and returns only active packages whose related service is active. This is the latest package visibility fix, covered by `CustomerAccountWorkflowTest`.
- `app/Http/Controllers/Api/QuoteRequestController.php`: `GET /api/quote-requests` → current user's requests; `POST /api/quote-requests` → validate and create a pending request, verifying active service and matching active package.
- `app/Http/Controllers/Api/FavoriteController.php`: list/add/remove a current customer's service/package favorites using `user_favorite_services` and `user_favorite_packages`.
- `app/Http/Controllers/Api/ReviewController.php`: public visible reviews; eligible completed quote requests; submit one review per eligible quote request, initially hidden pending admin moderation.
- `app/Http/Controllers/Api/ProfileController.php`: update authenticated name/email and optionally password after current-password verification.
- `app/Http/Controllers/Api/NotificationController.php`: list latest 50 notifications and unread count; mark one owned notification read.

### Admin API

- `app/Http/Controllers/Api/Admin/ServiceController.php`: list all services, create/update a service, toggle `is_active`.
- `app/Http/Controllers/Api/Admin/PackageController.php`: list all packages, create/update a package, toggle `is_active`; `price` may be null.
- `app/Http/Controllers/Api/Admin/QuoteRequestController.php`: list all requests with user/service/package; advances status only one step at a time and sends `QuoteStatusChangedNotification`.
- `app/Http/Controllers/Api/Admin/ReviewController.php`: list reviews with user/service/quote data, toggle visibility, delete.
- `app/Http/Controllers/Api/Admin/CustomerController.php`: list users whose role is `customer`, with quote/review counts.

All Admin controllers are routed under the `auth:sanctum` and `admin` middleware group in `routes/api.php`.

## Middleware

- `app/Http/Middleware/AdminMiddleware.php`: requires an authenticated user with `role === 'admin'`; otherwise returns JSON 403.
- `app/Http/Middleware/CustomerMiddleware.php`: requires an authenticated user with `role === 'customer'`; otherwise returns JSON 403.
- `auth:sanctum` is Laravel's registered guard middleware. The `admin` and `customer` aliases are declared in `bootstrap/app.php`.

## Notifications

`app/Notifications/QuoteStatusChangedNotification.php` implements Laravel database notifications. Its `via()` returns `database`, and its payload contains `quote_request_id`, `event_type`, `status`, and a message. It is invoked by the admin quote status controller after every valid transition. No email channel is configured in this notification.

## Routes and Persistence

- API route definitions: `routes/api.php`.
- Web route: `routes/web.php` currently serves Laravel's `welcome` view at `/`; the NOVA React UI is served by Vite separately in development.
- Migrations: `database/migrations/` (listed in `06-DATABASE.md`).
- Seeders: `database/seeders/DatabaseSeeder.php`, `ServiceSeeder.php`, `PackageSeeder.php`. No admin account seeder is present.
- Tests: `tests/Feature/` and `tests/Unit/`.

## Not Present as Separate Application Layers

No `app/Http/Requests/`, `app/Http/Resources/`, `app/Policies/`, or `app/Services/` source files were found. Validation is inline in controllers. Authorization uses middleware and query scoping rather than model policies in the current code.
