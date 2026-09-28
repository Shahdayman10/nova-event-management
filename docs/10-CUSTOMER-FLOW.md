# Customer Flow

## Guest Browsing

1. Guest opens `/` (`frontend/src/pages/HomePage.tsx`) or public routes declared in `frontend/src/App.tsx`.
2. Navbar links to Home, Services, Gallery, Packages, About, Contact; it also offers Login and Register.
3. Services and packages are fetched from public APIs. Gallery and About content are defined in React.
4. Public reviews are fetched from `/api/reviews`, which returns only visible records.

## Registration and Login

1. Guest chooses `/register` or `/login`; both render `frontend/src/pages/AuthPage.tsx`.
2. `AuthContext` (`frontend/src/context/AuthContext.tsx`) posts to `/api/register` or `/api/login` using Axios in `frontend/src/services/api.ts`.
3. `AuthController` validates credentials/account fields, creates or resolves `User`, and returns a Sanctum token.
4. Frontend persists token/user in local storage and navigates. New registration creates a customer and goes to `/`; login sends `admin` to `/admin` and customer to `/` unless `location.state.from` is present and the destination is not `/admin`.

## Browse and Request a Quote

1. Customer remains in public NOVA pages: `/services`, `/services/:id`, `/packages`, etc.
2. Quote CTA opens `/contact`; the page loads active services and active packages.
3. The customer selects service, optional package, event type, date, location, and optional message.
4. `/api/quote-requests` is Customer-only. The backend validates active service/package relationship and date, associates the authenticated user, and sets status to `pending`.
5. Guest visitors can view and fill the form, but submit sends them to `/login` with the form draft stored in Router location state. After login, AuthPage routes back to Contact and passes draft state. This transient draft is not persisted across browser reloads.

## My Requests and Status

1. Customer opens `/quotes` (`CustomerQuotesPage.tsx`).
2. The page calls `/api/quote-requests`; backend queries through the current user's relationship and returns only owned requests.
3. Admin changes status using the Admin Dashboard API; customer has no status mutation route.
4. Valid transitions are pending → confirmed → completed. Each accepted status change creates a database notification.

## Favorites

1. Services/package cards include `FavoriteButton` from `FavoritesContext.tsx`.
2. An authenticated customer toggles favorite through `/api/favorites/...`; pivot relationships store it per user.
3. A guest clicking a heart is navigated to `/login` with the current pathname in state. After login the return navigation can return to that pathname; clicking the heart again performs the action.
4. Customer can view/remove saved items at `/favorites`.

## Notification and Review

1. Customer opens `/notifications`; it lists recent database notifications and unread count.
2. Customer can mark an owned notification as read.
3. Once an owned quote is completed and has no review, it appears as eligible on `/quotes`.
4. Customer submits rating/comment. The API rechecks quote ownership/completed status and stores a hidden review.
5. Admin may publish/hide/delete it. Published reviews appear in the Home reviews section and public `/api/reviews`.

## Profile and Logout

- `/profile` calls `PUT /api/profile` for name/email and optional password change; password changes require current password. Role is ignored/not accepted by this API.
- Navbar logout calls `/api/logout`, revokes current token, then clears browser auth state.
