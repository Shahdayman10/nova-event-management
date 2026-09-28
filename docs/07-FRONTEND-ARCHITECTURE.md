# Frontend Architecture

## Entry and Route Tree

- `frontend/src/main.tsx` imports global CSS and mounts `<App />` into the `#root` element using React DOM `createRoot` and `React.StrictMode`.
- `frontend/src/App.tsx` wraps the app in `AuthProvider`, `FavoritesProvider`, and `BrowserRouter`, then declares the routes below.
- `frontend/src/index.css` imports the configured fonts and Tailwind CSS 4 and defines NOVA theme colors, fonts, and radius tokens.
- `frontend/vite.config.ts` enables the React and Tailwind Vite plugins.

| Route | Page | Access |
|---|---|---|
| `/` | `pages/HomePage.tsx` | Public |
| `/services` | `pages/ServicesPage.tsx` | Public |
| `/services/:id` | `pages/ServiceDetailPage.tsx` | Public |
| `/packages` | `pages/PackagesPage.tsx` | Public |
| `/gallery` | `pages/GalleryPage.tsx` | Public |
| `/about` | `pages/AboutPage.tsx` | Public |
| `/contact` | `pages/ContactPage.tsx` | Public page; submitting a quote requires customer login |
| `/login` | `pages/AuthPage.tsx` with login mode | Public |
| `/register` | `pages/AuthPage.tsx` with register mode | Public |
| `/quotes` | `pages/CustomerQuotesPage.tsx` | Protected customer |
| `/favorites` | `pages/FavoritesPage.tsx` | Protected customer |
| `/profile` | `pages/ProfilePage.tsx` | Protected customer |
| `/notifications` | `pages/NotificationsPage.tsx` | Protected customer |
| `/admin` | `pages/AdminDashboardPage.tsx` | Protected admin |

`ProtectedRoute` handles client-side redirects. Backend middleware independently enforces access to the APIs.

## Pages

### Public Pages

- `frontend/src/pages/HomePage.tsx`: Home hero, active services, active packages, hardcoded gallery images, value section, API-backed published reviews, and quote CTA. Calls `GET /services`, `/packages`, `/reviews`.
- `frontend/src/pages/ServicesPage.tsx`: fetches and filters API services; renders service cards with favorite buttons and detail links. Calls `GET /services`.
- `frontend/src/pages/ServiceDetailPage.tsx`: reads route `id`, finds service and its packages from public catalog APIs, shows detail and quote/package links. Calls `GET /services` and `/packages`.
- `frontend/src/pages/PackagesPage.tsx`: fetches and filters package catalog and exposes favorites/booking links. Calls `GET /packages`.
- `frontend/src/pages/GalleryPage.tsx`: local static gallery array, category filter, lightbox, no gallery API.
- `frontend/src/pages/AboutPage.tsx`: static copy and external image URLs; no API call.
- `frontend/src/pages/ContactPage.tsx`: quote form, loads service/package selectors, stores the draft in React Router state on login redirect, submits customer quote. Calls `GET /services`, `GET /packages`, `POST /quote-requests`.

### Authentication Pages

- `frontend/src/pages/AuthPage.tsx`: shared login/register form; calls `login` or `register` from `AuthContext` and navigates according to user role/state.

### Customer Pages

- `frontend/src/pages/CustomerQuotesPage.tsx`: lists own quote requests and allows a review draft for eligible completed requests. Calls `GET /quote-requests`, `GET /reviews/eligible`, `POST /reviews`.
- `frontend/src/pages/FavoritesPage.tsx`: renders favorite services/packages; uses `FavoritesContext` for refresh/removal. Data comes from `GET /favorites` and favorite add/remove routes.
- `frontend/src/pages/ProfilePage.tsx`: edits name/email and optional password. Calls `PUT /profile`, refreshes auth user.
- `frontend/src/pages/NotificationsPage.tsx`: lists notifications, shows unread state, marks owned notification read. Calls `GET /notifications`, `PATCH /notifications/{id}/read`.

### Admin Page

- `frontend/src/pages/AdminDashboardPage.tsx`: single admin page with Overview, Services, Packages, Quote Requests, Reviews, and Customers sections. Calls the `/admin/*` APIs documented in `04-API-DOCUMENTATION.md`.

## Context, API, and Shared Components

- `frontend/src/context/AuthContext.tsx`: `AuthProvider`, `useAuth`, user/token state, localStorage persistence, login/register/logout, and `GET /user` refresh.
- `frontend/src/context/FavoritesContext.tsx`: favorite service/package state, fetch and optimistic toggle methods, and `FavoriteButton`. A guest clicking favorite is sent to `/login` with the current path as `location.state.from`; an admin's button is disabled.
- `frontend/src/services/api.ts`: Axios configuration; API base is hardcoded to `http://127.0.0.1:8000/api`; request interceptor adds Bearer token; 401 response clears stored auth state and dispatches `nova-auth-changed`.
- `frontend/src/components/ProtectedRoute.tsx`: client-side auth and role route guard.
- `frontend/src/components/shared.tsx`: shared `Navbar`, `Footer`, `SectionLabel`, `globalStyles`. Navbar changes links based on guest/customer/admin state.

## Hooks, Types, and Utilities

The frontend uses React built-in hooks (`useState`, `useEffect`, `useContext`, etc.) and React Router hooks. Auth/favorites interfaces and API data shapes are mostly declared in their consuming page/context files. No separate `hooks/`, `types/`, `utils/`, or page-layout directories were found in `frontend/src/`.

## Visual and Content Sources

The current design tokens and font declarations are in `frontend/src/index.css`. Some images and gallery content are static external Unsplash URLs embedded in page source; see `13-IMAGE-AND-STORAGE.md`. The visible package UI treats null price as “Price on request.”
