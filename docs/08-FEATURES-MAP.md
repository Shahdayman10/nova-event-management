# Features Map

Each flow below traces the current implementation. API paths are under the `/api` prefix. The React client base URL is defined in `frontend/src/services/api.ts`.

## Registration

**Frontend:** `frontend/src/pages/AuthPage.tsx`; `frontend/src/context/AuthContext.tsx`.

**API:** `POST /api/register`.

**Backend:** `routes/api.php`; `app/Http/Controllers/Api/AuthController.php`; `app/Models/User.php`.

**Database:** `users`, `personal_access_tokens`.

**Authentication:** Guest/public.

**Flow:** Guest → registration form → AuthContext/Axios → AuthController validation → User created with `customer` role → Sanctum token response → browser localStorage → `/`.

## Login and Logout

**Frontend:** `AuthPage.tsx`, `AuthContext.tsx`, `services/api.ts`, shared `Navbar` in `components/shared.tsx`.

**API:** `POST /api/login`, `POST /api/logout`, `GET /api/user`.

**Backend:** `AuthController`; `/user` closure in `routes/api.php`; Sanctum.

**Database:** `users`, `personal_access_tokens`.

**Authentication:** Login public; logout and user lookup require a token.

**Flow:** Login form → AuthContext → Axios Bearer token handling → AuthController credential check/token issuance → role-specific navigation (admin `/admin`, customer `/`) → Logout deletes current token and clears local state.

## Public Services Catalog and Details

**Frontend:** `pages/HomePage.tsx`, `pages/ServicesPage.tsx`, `pages/ServiceDetailPage.tsx`; `components/shared.tsx` Navbar; `FavoritesContext.tsx` button in cards.

**API:** `GET /api/services`.

**Backend:** `routes/api.php`; `Api/ServiceController@index`; `Service` model.

**Database:** `services`.

**Authentication:** Guest, customer, and admin can browse the public endpoint.

**Flow:** Catalog page → Axios → active services query → service JSON → cards/detail route `/services/:id`.

## Public Package Catalog

**Frontend:** `pages/HomePage.tsx`, `pages/PackagesPage.tsx`, `pages/ServiceDetailPage.tsx`; favorite and quote links.

**API:** `GET /api/packages`.

**Backend:** `Api/PackageController@index`; `Package` and `Service` models.

**Database:** `packages`, related `services`.

**Authentication:** Public.

**Flow:** Catalog fetch → API filters active package and active parent service → package JSON includes service → UI shows null price as “Price on request.”

## Request a Quote

**Frontend:** `pages/ContactPage.tsx`; request CTAs in `HomePage.tsx`, `PackagesPage.tsx`, `ServiceDetailPage.tsx`, `CustomerQuotesPage.tsx`; `AuthPage.tsx` restores draft location state.

**API:** Public selector reads `GET /api/services` and `GET /api/packages`; submission `POST /api/quote-requests`.

**Backend:** `Api/QuoteRequestController@store`; `Service`, `Package`, `QuoteRequest`, `User` models; customer middleware.

**Database:** `quote_requests`.

**Authentication:** Form can be viewed by guest; submission is Customer-only. Guest submit redirects to login with quote draft state.

**Flow:** Select service and optional matching package + event type/date/location/message → login if needed → POST → backend checks ownership via authenticated user, active service/package relationship, and date → creates `pending` request → frontend shows confirmation; request appears in My Requests.

## My Requests and Review Eligibility

**Frontend:** `pages/CustomerQuotesPage.tsx`.

**API:** `GET /api/quote-requests`, `GET /api/reviews/eligible`, `POST /api/reviews`.

**Backend:** `Api/QuoteRequestController@index`; `Api/ReviewController@eligible/store`; `QuoteRequest` and `Review` models.

**Database:** `quote_requests`, `reviews`.

**Authentication:** Customer only.

**Flow:** Customer page fetches the current user's quote relation → backend returns service/package and event data → completed own request without review is eligible → review post is checked again on server → review saved hidden pending approval.

## Favorites

**Frontend:** `FavoritesContext.tsx`, `FavoriteButton`, `pages/FavoritesPage.tsx`, catalog/detail cards.

**API:** `GET /api/favorites`, `POST /api/favorites/{services|packages}/{id}`, `DELETE /api/favorites/{services|packages}/{id}`.

**Backend:** `Api/FavoriteController`; `User`, `Service`, `Package` relations.

**Database:** `user_favorite_services`, `user_favorite_packages`.

**Authentication:** Customer APIs require Customer. Guest button redirects to login; API blocks guests/admin.

**Flow:** Heart action → context toggle → customer API → pivot row sync/detach → refreshed favorite state.

## Reviews

**Frontend:** Public display in `pages/HomePage.tsx` (Testimonials section); entry UI in `pages/CustomerQuotesPage.tsx`; moderation UI in `pages/AdminDashboardPage.tsx`.

**API:** `GET /api/reviews`, `GET /api/reviews/eligible`, `POST /api/reviews`; admin `GET /api/admin/reviews`, `PATCH /api/admin/reviews/{id}/visibility`, `DELETE /api/admin/reviews/{id}`.

**Backend:** Public/customer `Api/ReviewController`; `Api/Admin/ReviewController`; `Review` model.

**Database:** `reviews` joined to users/services/quote requests.

**Authentication:** View public; submit Customer; moderation Admin.

**Flow:** Customer submits review for their completed quote → review saved with `is_visible=false` → Admin publishes/hides/deletes → public API returns only visible reviews with real customer name and service.

## Profile

**Frontend:** `pages/ProfilePage.tsx`, `AuthContext.tsx`.

**API:** `PUT /api/profile`; `GET /api/user` refresh.

**Backend:** `Api/ProfileController@update`; `User` model; customer middleware.

**Database:** `users`.

**Authentication:** Customer only via current route; backend route group is customer-only.

**Flow:** User edits name/email and optional password → current password checked when changing password → allowlisted validated fields fill model → fresh user returned → AuthContext refreshes. Role is not an accepted update field.

## Notifications

**Frontend:** `pages/NotificationsPage.tsx`; Navbar link in `components/shared.tsx`.

**API:** `GET /api/notifications`, `PATCH /api/notifications/{id}/read`.

**Backend:** `Api/NotificationController`; `QuoteStatusChangedNotification`; Laravel Notifiable.

**Database:** `notifications` polymorphic table.

**Authentication:** Customer only.

**Flow:** Admin status change → quote controller notifies owner through database channel → customer page loads unread count/messages → read action scopes lookup to caller.

## Admin Dashboard and Catalog Management

**Frontend:** `pages/AdminDashboardPage.tsx`; `/admin` in `App.tsx`; `ProtectedRoute`.

**API:** `/api/admin/services`, `/packages`, `/quote-requests`, `/reviews`, `/customers` methods documented in `04-API-DOCUMENTATION.md`.

**Backend:** Admin controllers under `app/Http/Controllers/Api/Admin/`; `AdminMiddleware`.

**Database:** services, packages, quote_requests, reviews, users, notifications.

**Authentication:** Admin only, enforced by backend group.

**Flow:** Admin page loads five collections → performs CRUD/status/moderation calls → Laravel role middleware authorizes and controller persists → page refreshes local state.

## Gallery, About, Contact Information

**Frontend:** `pages/GalleryPage.tsx`, `pages/AboutPage.tsx`, `pages/ContactPage.tsx`.

**API / Backend:** Gallery and About are local React content, not backed by an API. Contact selector and quote submission use the API paths above.

**Database:** Gallery/About have no dedicated database tables in the current migrations.
