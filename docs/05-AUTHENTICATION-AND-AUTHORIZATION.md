# Authentication and Authorization

## Roles

The `users.role` field is added by `database/migrations/2026_09_18_124341_add_role_to_users_table.php`. The values used in current code are `customer` and `admin`. The column defaults to `customer`; `AuthController::register()` explicitly sets new accounts to `customer`. There is no public API for assigning admin role and no admin creation seeder in `database/seeders/`.

## Authentication Mechanism

The backend uses Laravel Sanctum personal access tokens (`laravel/sanctum` 4.3.3). Successful registration and login call `createToken('nova-api-token')->plainTextToken`. The browser stores the token in `localStorage` as `nova_token`, and `frontend/src/services/api.ts` attaches it as a Bearer authorization header. `POST /api/logout` deletes the current access token.

The frontend also stores a serialized user under `nova_user`; this is for UI state only. Backend authorization is enforced by Sanctum and role middleware and does not rely on the local role value.

## Role Checks and Data Isolation

- `auth:sanctum` authenticates protected API routes.
- `customer` points to `app/Http/Middleware/CustomerMiddleware.php`, which accepts only `role === 'customer'`.
- `admin` points to `app/Http/Middleware/AdminMiddleware.php`, which accepts only `role === 'admin'`.
- Aliases are registered in `bootstrap/app.php`.
- Customer feature routes are grouped under `auth:sanctum` + `customer` in `routes/api.php`.
- Admin APIs are grouped under `auth:sanctum` + `admin` and prefixed with `/admin`.
- Customer quote listing queries `$request->user()->quoteRequests()`, favorites use that user's many-to-many relations, eligible reviews start from that user's requests, profile edits only validated name/email/password fields, and notification marking looks up through that user's notification relation.
- Customer quote submission sets `status` to `pending` on the server. No customer status update route exists.
- Admin status updates validate allowed values and require exact progression pending → confirmed → completed.

Feature tests exercise owner isolation, role immutability through profile payloads, guest/admin/customer access denial, and admin request workflow.

## Frontend Route Protection and Navigation

`frontend/src/components/ProtectedRoute.tsx` provides UI route guards:

- Unauthenticated user on a protected route → `/login`.
- Non-admin on an admin-only route → `/`.
- Admin on customer-only route → `/admin`.
- Customer stays in the NOVA site; `/quotes`, `/favorites`, `/profile`, and `/notifications` are customer pages.

These checks improve navigation but are not the security boundary; Laravel middleware is the authoritative API protection.

`frontend/src/components/shared.tsx` renders the Navbar based on auth state. Admin sees Admin Dashboard and Logout, with public/customer navigation hidden. A customer sees public links plus My Requests, Favorites, Notifications, Profile, Request a Quote, and Logout. A guest sees public links, Login, and Register.

## Login and Registration Flow

```text
frontend/src/pages/AuthPage.tsx
  → useAuth() from frontend/src/context/AuthContext.tsx
  → Axios instance frontend/src/services/api.ts
  → POST /api/login or /api/register in routes/api.php
  → app/Http/Controllers/Api/AuthController.php
  → User model + Sanctum token
  → { user, token } JSON
  → AuthContext localStorage/state update
  → AuthPage navigation
```

Login sends an admin to `/admin`; a customer goes to `/`, unless `location.state.from` is present and the destination is not `/admin`. Registration creates a customer account and navigates to `/`. On app initialization, `AuthContext` calls `GET /api/user` to refresh the user; a 401 response clears local token/user state via the Axios response interceptor.

## Logout Flow

`Navbar` calls `logout()` from `AuthContext`; this posts to `/api/logout` when a token exists, then clears both local storage keys and emits `nova-auth-changed`. If the backend request errors, the frontend still clears local state.

## Security Considerations in Current Implementation

- API authorization is backend-enforced, not only React-enforced.
- Token persistence uses browser localStorage; this is confirmed behavior and should be considered in any future XSS/security review.
- An admin account must be provisioned outside the public registration flow; no in-repository bootstrap admin credentials or seeder are present.
- No email verification flow or password-reset API is registered in `routes/api.php`.
