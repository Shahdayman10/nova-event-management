# API Documentation

All URLs below are relative to the current frontend API base URL `http://127.0.0.1:8000/api`, defined in `frontend/src/services/api.ts`. JSON validation errors are returned by Laravel (normally HTTP 422). Protected endpoints use a Sanctum bearer token. The actual registered routes were checked with `php artisan route:list --path=api`; there are 31 API routes.

## Public APIs

| Method and URL | Auth / role | Controller and method | Input / validation | Success response |
|---|---|---|---|---|
| `GET /services` | None | `Api\ServiceController@index` | No parameters | `{ services: [...] }`; active services only. |
| `GET /packages` | None | `Api\PackageController@index` | No parameters | `{ packages: [...] }`; active packages with active parent service, each eager-loaded with `service`. |
| `GET /reviews` | None | `Api\ReviewController@index` | No parameters | `{ reviews: [...] }`; only `is_visible=true`, with user name and service name. |

## Authentication APIs

| Method and URL | Auth / role | Controller and method | Request body | Success / errors |
|---|---|---|---|---|
| `POST /register` | Public | `Api\AuthController@register` | `name` required string max 255; `email` required valid unique email max 255; `password` required string min 8 and `password_confirmation` must match | HTTP 201 `{ message, user, token }`; role is set to `customer`. Invalid input: 422. |
| `POST /login` | Public | `Api\AuthController@login` | `email` required email; `password` required string | HTTP 200 `{ message, user, token }`; bad credentials: 401 `{ message: "Invalid email or password." }`; validation: 422. |
| `POST /logout` | Sanctum auth; any authenticated role | `Api\AuthController@logout` | No body | Deletes current access token; `{ message: "Logout successful." }`. Guest: 401. |
| `GET /user` | Sanctum auth; any authenticated role | Closure in `routes/api.php` | No body | Current authenticated user JSON. Guest: 401. |

## Customer APIs

All routes below are inside `auth:sanctum` + `customer`; non-customer authenticated users receive 403 and guests receive 401.

### Quote Requests

| Method and URL | Controller and method | Request / validation | Response |
|---|---|---|---|
| `GET /quote-requests` | `Api\QuoteRequestController@index` | No body; query is scoped to the authenticated user's `quoteRequests()` relation | `{ quote_requests: [...] }` with `service` and `package`, newest first. |
| `POST /quote-requests` | `Api\QuoteRequestController@store` | `service_id` required existing service; `package_id` nullable existing package; `event_type` required string max 255; `event_date` required date on/after today; `event_location` required string max 255; `message` nullable string. The service must be active. If package supplied, it must be active and belong to that service. | HTTP 201 `{ message, quote_request }`; status is set server-side to `pending`. A missing/inactive/mismatched service/package can result in 404. Validation errors: 422. |

### Favorites

| Method and URL | Controller and method | Input | Response |
|---|---|---|---|
| `GET /favorites` | `Api\FavoriteController@index` | No body | `{ services: [...], packages: [...] }` for the current user; packages include service. |
| `POST /favorites/{type}/{id}` | `Api\FavoriteController@store` | `type` constrained by route to `services` or `packages`; numeric model `id` | `{ message: "Favorite saved." }`; nonexistent model: 404. |
| `DELETE /favorites/{type}/{id}` | `Api\FavoriteController@destroy` | Same route constraints | `{ message: "Favorite removed." }`; nonexistent model: 404. |

### Reviews

| Method and URL | Controller and method | Request / validation | Response |
|---|---|---|---|
| `GET /reviews/eligible` | `Api\ReviewController@eligible` | No body | `{ quote_requests: [...] }`; only the caller's completed requests with no review, includes service name. |
| `POST /reviews` | `Api\ReviewController@store` | `quote_request_id` required integer existing; `rating` integer 1–5; `comment` required string max 3000. Quote must belong to caller, be completed, and have no review. | HTTP 201 `{ message, review }`; new review defaults to `is_visible=false`. Ineligible/other user's quote: 404; invalid input: 422. |

### Profile and Notifications

| Method and URL | Controller and method | Request / validation | Response |
|---|---|---|---|
| `PUT /profile` | `Api\ProfileController@update` | `name` and `email` optional (`sometimes`) but required if present; name string max 255; email valid and unique except caller; `password` optional, min 8 and confirmed; `current_password` required with password. Current password is checked. `role` is not accepted. | `{ user }`; invalid input/current password: 422. |
| `GET /notifications` | `Api\NotificationController@index` | No body | `{ notifications: [...], unread_count }`; at most 50 newest notifications. |
| `PATCH /notifications/{notification}/read` | `Api\NotificationController@markRead` | Notification UUID route parameter | `{ message: "Notification marked as read." }`; notification lookup is through caller's relation, so another user's ID is not returned (404). |

## Admin APIs

All `/admin/*` routes require `auth:sanctum` and `admin`. A guest receives 401; an authenticated non-admin receives 403.

### Services

| Method and URL | Controller method | Request / validation | Success response |
|---|---|---|---|
| `GET /admin/services` | `Admin\ServiceController@index` | None | `{ success: true, data: [...] }` with `packages_count`, all active/inactive. |
| `POST /admin/services` | `Admin\ServiceController@store` | `name` required string max 255; `slug` required unique string max 255; `description`, `image` nullable; `is_active` optional boolean | HTTP 201 `{ success, message, data }`. |
| `PUT /admin/services/{service}` | `Admin\ServiceController@update` | Partial fields; name/slug if present required; slug unique except this service; description/image nullable; is_active optional boolean | `{ success, message, data }`; unknown id: 404; validation: 422. |
| `PATCH /admin/services/{service}/status` | `Admin\ServiceController@toggleStatus` | No body | `{ success, message, data }` with toggled `is_active`. |

### Packages

| Method and URL | Controller method | Request / validation | Success response |
|---|---|---|---|
| `GET /admin/packages` | `Admin\PackageController@index` | None | `{ success: true, data: [...] }` with service relation. |
| `POST /admin/packages` | `Admin\PackageController@store` | `service_id` required existing; `name` required; `slug` required and unique within service; `description` nullable; `price` nullable numeric min 0; `features` nullable array; `image` nullable string max 255; `is_active` optional boolean | HTTP 201 `{ success, message, data }`; null price is supported. |
| `PUT /admin/packages/{package}` | `Admin\PackageController@update` | Same fields, mostly optional; supplied service must exist; slug unique in target service | `{ success, message, data }`; 404/422 as applicable. |
| `PATCH /admin/packages/{package}/status` | `Admin\PackageController@toggleStatus` | No body | `{ success, message, data }` with toggled `is_active`. |

### Requests, Reviews, Customers

| Method and URL | Controller method | Request / validation | Success response |
|---|---|---|---|
| `GET /admin/quote-requests` | `Admin\QuoteRequestController@index` | None | `{ success: true, data: [...] }` with user, service, package. |
| `PATCH /admin/quote-requests/{quoteRequest}/status` | `Admin\QuoteRequestController@updateStatus` | `status` required and one of `pending`, `confirmed`, `completed`; transition must advance exactly one step | `{ success, message, data }`; invalid transition: 422. Each accepted status change creates a database notification for the request owner. |
| `GET /admin/reviews` | `Admin\ReviewController@index` | None | `{ reviews: [...] }` including customer identity, service and request summary. |
| `PATCH /admin/reviews/{review}/visibility` | `Admin\ReviewController@toggleVisibility` | No body | `{ review }` with `is_visible` toggled. |
| `DELETE /admin/reviews/{review}` | `Admin\ReviewController@destroy` | No body | `{ message: "Review deleted." }`. |
| `GET /admin/customers` | `Admin\CustomerController@index` | None | `{ customers: [...] }`; customer accounts only, with quote and review counts. |

## General Error Behavior

- `401 Unauthorized`: missing/invalid Sanctum authentication on protected routes.
- `403 Forbidden`: authenticated user does not meet the customer/admin role middleware.
- `404 Not Found`: unknown model, ineligible quote, unavailable resource, or resource scoped to another user.
- `422 Unprocessable Content`: Laravel validation errors or invalid status progression/current password.

The API uses controller JSON responses directly; there are no API Resource classes in the current source tree.
