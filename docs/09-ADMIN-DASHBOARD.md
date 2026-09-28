# Admin Dashboard

## Route and Entry

The dashboard page is `frontend/src/pages/AdminDashboardPage.tsx`, registered at `/admin` in `frontend/src/App.tsx`. `ProtectedRoute` is configured with `adminOnly`; the Navbar in `frontend/src/components/shared.tsx` hides public/customer links from admins and shows Admin Dashboard and Logout.

Frontend route checks are for navigation only. Every `/api/admin/*` route is additionally protected by `auth:sanctum` and `admin` in `routes/api.php`; `AdminMiddleware` in `app/Http/Middleware/AdminMiddleware.php` checks `role === 'admin'` and returns 403 otherwise.

## Dashboard Sections

The page has local tab state for Overview, Services, Packages, Quote Requests, Reviews, and Customers. It loads these datasets in parallel:

- `GET /api/admin/services`
- `GET /api/admin/packages`
- `GET /api/admin/quote-requests`
- `GET /api/admin/reviews`
- `GET /api/admin/customers`

The UI keeps sections in one page component; there are no separate Admin tab page files in `frontend/src/pages/`.

## Capabilities and Code Paths

### Overview

Shows counts computed from the loaded services, packages, and requests plus the latest request summaries. Counts are client-side values from API results, not a separate statistics API.

### Services

- List, create, edit, activate/deactivate.
- UI: `AdminDashboardPage.tsx` service form/list and `toggleStatus`.
- API: `/admin/services` GET/POST, `/admin/services/{service}` PUT, `/admin/services/{service}/status` PATCH.
- Controller: `app/Http/Controllers/Api/Admin/ServiceController.php`.
- Model/table: `app/Models/Service.php`, `services`.

### Packages

- List, create, edit, activate/deactivate; the form accepts nullable price and multiline feature entries.
- API: `/admin/packages` GET/POST, `/admin/packages/{package}` PUT, `/admin/packages/{package}/status` PATCH.
- Controller: `app/Http/Controllers/Api/Admin/PackageController.php`.
- Model/table: `app/Models/Package.php`, `packages`.

### Quote Requests and Status

- Lists request owner, service, package, event details, message, and status; filters by status.
- API: `GET /admin/quote-requests`, `PATCH /admin/quote-requests/{quoteRequest}/status`.
- Controller: `app/Http/Controllers/Api/Admin/QuoteRequestController.php`.
- Model/table: `QuoteRequest`, `quote_requests`.
- Allowed transition is one step forward only: `pending` → `confirmed` → `completed`. Skipping or reversing is rejected with 422. The UI disables updates when completed and offers statuses from the current state onward.

### Notifications on Status Change

After saving a valid new status, the admin quote controller invokes `QuoteStatusChangedNotification` on the associated user. The notification uses Laravel's database channel and is consumed by customer `GET /api/notifications`; no email channel is present.

### Reviews

- Lists reviews with author, email, service, rating, comment, date, and quote event.
- Admin can toggle visibility or permanently delete a review (delete requires explicit browser confirmation).
- API: `GET /admin/reviews`, `PATCH /admin/reviews/{review}/visibility`, `DELETE /admin/reviews/{review}`.
- Controller/model/table: `Api/Admin/ReviewController.php`, `Review`, `reviews`.
- Public visibility is controlled by `is_visible`; admin list includes hidden and visible reviews.

### Customers

- Lists users with role `customer`, name/email, quote count, review count.
- API: `GET /admin/customers`.
- Controller/model/table: `Api/Admin/CustomerController.php`, `User` and related tables.
- This is read-only; no user edit/delete/admin-role management endpoint is registered.

## Admin versus Customer

- Admin is directed to `/admin` after login and receives only admin dashboard navigation. Admin middleware blocks customer APIs.
- Customer is directed to `/` after login and browses the public NOVA site with account features. Customer middleware blocks admin APIs and request queries scope to the current user.
- Both roles authenticate through the same `/api/login` endpoint; role-specific behavior follows the returned user role.
