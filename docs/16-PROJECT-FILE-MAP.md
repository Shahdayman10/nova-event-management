# Project File Map

| File / directory | Purpose | Related feature |
|---|---|---|
| `routes/api.php` | Registers all current API routes and role groups | All API features |
| `routes/web.php` | Laravel root welcome page | Backend shell |
| `bootstrap/app.php` | Route bootstrap, middleware aliases, JSON exception behavior | API auth/authorization |
| `app/Http/Controllers/Controller.php` | Empty abstract Laravel base controller | Controller base |
| `config/auth.php` | Laravel auth guards/providers configuration | Authentication |
| `config/database.php` | SQLite/MySQL and other DB connection definitions | Persistence |
| `config/filesystems.php` | Local/public/S3 disk and storage link config | Image/storage configuration |
| `app/Models/User.php` | Auth user, token, relationship and role-bearing account | Auth, profile, quote requests, favorites, reviews, notifications |
| `app/Models/Service.php` | Event service entity and relationships | Services, packages, quotes, favorites, reviews |
| `app/Models/Package.php` | Optional service package and nullable price | Packages, quotes, favorites |
| `app/Models/QuoteRequest.php` | Customer quote/event request and status | Quotes, admin workflow, reviews |
| `app/Models/Review.php` | Quote-linked rating/comment/visibility | Reviews and moderation |
| `app/Http/Controllers/Api/AuthController.php` | Register/login/logout | Authentication |
| `app/Http/Controllers/Api/ServiceController.php` | Public active service list | Services |
| `app/Http/Controllers/Api/PackageController.php` | Public active package list filtered by active service | Packages |
| `app/Http/Controllers/Api/QuoteRequestController.php` | Customer-owned quote list and creation | Quote request |
| `app/Http/Controllers/Api/FavoriteController.php` | Favorite list/add/remove | Favorites |
| `app/Http/Controllers/Api/ReviewController.php` | Public reviews, eligible quotes, review submission | Reviews |
| `app/Http/Controllers/Api/ProfileController.php` | Customer profile update | Profile |
| `app/Http/Controllers/Api/NotificationController.php` | Notification list and mark-read | Notifications |
| `app/Http/Controllers/Api/Admin/ServiceController.php` | Admin service listing/CRUD/status | Admin catalog |
| `app/Http/Controllers/Api/Admin/PackageController.php` | Admin package listing/CRUD/status | Admin catalog |
| `app/Http/Controllers/Api/Admin/QuoteRequestController.php` | All quote requests and sequential status changes | Admin requests/notifications |
| `app/Http/Controllers/Api/Admin/ReviewController.php` | Review list/visibility/delete | Admin reviews |
| `app/Http/Controllers/Api/Admin/CustomerController.php` | Customer list and counts | Admin customers |
| `app/Http/Middleware/AdminMiddleware.php` | Enforces admin role | Admin API |
| `app/Http/Middleware/CustomerMiddleware.php` | Enforces customer role | Customer API |
| `app/Notifications/QuoteStatusChangedNotification.php` | Database notification payload for status change | Notifications |
| `database/migrations/` | Nine schema migrations; details in `06-DATABASE.md` | All persistence |
| `database/seeders/DatabaseSeeder.php` | Calls service and package seeders | Initial catalog |
| `database/seeders/ServiceSeeder.php` | Upserts six event service entries and Unsplash image URLs | Public services |
| `database/seeders/PackageSeeder.php` | Upserts service packages with null prices | Public packages |
| `database/factories/UserFactory.php` | Factory used by tests | Test accounts |
| `tests/Feature/CustomerAccountWorkflowTest.php` | Guest auth/catalog and customer quote workflow tests | Customer flow/package regression |
| `tests/Feature/CustomerFeaturesApiTest.php` | Favorites, review/profile, notification/admin moderation tests | Customer features/security |
| `tests/Feature/AdminDashboardApiTest.php` | Admin catalog/request and authorization tests | Admin |
| `tests/Feature/ExampleTest.php` | Laravel root response smoke test | Framework smoke test |
| `tests/Unit/ExampleTest.php` | Basic unit assertion | PHPUnit smoke test |
| `frontend/src/main.tsx` | React DOM entry point | Frontend boot |
| `frontend/src/App.tsx` | React providers and route definitions | Frontend routing |
| `frontend/src/index.css` | Fonts, Tailwind entry, NOVA design tokens | Styling |
| `frontend/src/services/api.ts` | Axios API base URL and token interceptors | All API calls |
| `frontend/src/context/AuthContext.tsx` | Auth state and localStorage token/user management | Auth, Navbar |
| `frontend/src/context/FavoritesContext.tsx` | Favorite state and `FavoriteButton` | Favorites/catalog cards |
| `frontend/src/components/ProtectedRoute.tsx` | Customer/admin client-side route guard | Authorization UX |
| `frontend/src/components/shared.tsx` | Navbar, Footer, SectionLabel, shared page styles | Shared UI/navigation |
| `frontend/src/pages/HomePage.tsx` | Home content and public reviews | Home/services/packages/reviews |
| `frontend/src/pages/ServicesPage.tsx` | Public service list/filter/detail links | Services |
| `frontend/src/pages/ServiceDetailPage.tsx` | Service detail and associated packages | Service detail |
| `frontend/src/pages/PackagesPage.tsx` | Public package filters/cards | Packages |
| `frontend/src/pages/GalleryPage.tsx` | Static gallery/filter/lightbox | Gallery |
| `frontend/src/pages/AboutPage.tsx` | Static about page | About |
| `frontend/src/pages/ContactPage.tsx` | Contact and quote form | Quote requests |
| `frontend/src/pages/AuthPage.tsx` | Login/register UI | Authentication |
| `frontend/src/pages/CustomerQuotesPage.tsx` | Quote history and completed-quote review UI | Customer requests/reviews |
| `frontend/src/pages/FavoritesPage.tsx` | Favorite list and removal | Favorites |
| `frontend/src/pages/ProfilePage.tsx` | Profile/password form | Profile |
| `frontend/src/pages/NotificationsPage.tsx` | Notification list/read state | Notifications |
| `frontend/src/pages/AdminDashboardPage.tsx` | Admin overview and management sections | Admin |
| `frontend/package.json` | React/Vite dependencies and scripts | Frontend tooling |
| `frontend/package-lock.json` | npm dependency lockfile | Frontend tooling |
| `frontend/pnpm-lock.yaml` | pnpm dependency lockfile; resolved versions currently differ from npm lock | Frontend tooling |
| `frontend/vite.config.ts` | React/Tailwind Vite configuration | Frontend tooling |
| `composer.json` | PHP requirements, Laravel scripts/dependencies | Backend tooling |
| `README.md` | Default Laravel skeleton README; not NOVA-specific | Framework boilerplate |
| `phpunit.xml` | Test suite directories and SQLite memory DB settings | Tests |
| `.vscode/tasks.json` | Local build, preview, and test task declarations | Developer workflow |
| `.env.example` | Laravel environment template (SQLite defaults) | Setup |
| `AGENTS.md` | Laravel Boost/Copilot project guidance | Development process |
| `boost.json` | Boost configuration for Copilot guidelines | Development process |
