# Known Issues and Next Steps

This list distinguishes directly verified behavior from items that still require verification or product decisions. No database or code changes are proposed here.

## Confirmed Issues / Limitations

- The frontend API base URL is hardcoded to `http://127.0.0.1:8000/api` in `frontend/src/services/api.ts`; changing deployment host/port requires configuration/code work.
- Admin user provisioning is not provided by the public registration flow or current database seeders. Registration always sets role to `customer`. `.vscode/tasks.json` has tasks labelled “Check existing NOVA admin identity” and “Create persistent NOVA admin” that invoke `_admin_setup_check.php`, but that script is absent from the current workspace; those task labels are not a verified working provisioning path.
- Root `README.md` is the default Laravel skeleton README and does not document NOVA specifically; the project handoff details are in `docs/`.
- Gallery content and several page images are hardcoded in React rather than managed through an API. There is no gallery model/table/controller in the inspected source.
- `packages.image` is nullable and `PackageSeeder` writes `null`; package card imagery is currently provided by static UI sections rather than package image upload.
- The current controller-side admin status transition only advances exactly one step (pending → confirmed → completed); this is confirmed current behavior.
- Several strings are static UI copy, not verified business records: `frontend/src/components/shared.tsx` prints “Lagos & Abuja, Nigeria”; `frontend/src/pages/ContactPage.tsx` contains generic contact labels (“Use the quote request form”, “NOVA event planning”, “Customer support”), social links with `href: "#"`, and FAQ estimates of 3–4/6–8 weeks and 1–2 business days; `frontend/src/pages/HomePage.tsx` says “With years of experience”; `frontend/src/pages/ServiceDetailPage.tsx` also states work across Lagos and Abuja. These strings are present in code, but this documentation does not verify them as real operating facts.
- No `TODO`, `FIXME`, or `HACK` markers were found in the source scan performed for this handoff.

These are implementation limitations, not necessarily defects against the intended deployment/product policy.

## Potential Improvements

- Move the frontend API URL to Vite environment configuration for non-local environments.
- Resolve the two frontend lockfiles to one declared package manager; the current npm-installed versions differ from versions recorded in `pnpm-lock.yaml`.
- Decide how an initial production admin account is securely provisioned.
- Consider storing API tokens in a browser mechanism with an explicit XSS threat model; current code uses localStorage.
- If content operators need to manage gallery/photos, define an authenticated media/gallery workflow instead of editing frontend arrays.
- Add browser end-to-end coverage for role-specific navigation and customer flows.
- Add a frontend test script/framework if automated React component or browser testing becomes part of the project requirements; `frontend/package.json` currently exposes `dev`, `build`, `preview`, and `format`, but no test script.
- Confirm whether users should be allowed to reverse or directly set a status; current API intentionally permits only sequential progression.

## Not Yet Tested

- Manual browser test of guest, customer, and admin interactions was not performed for the documentation task. Backend API feature tests and a previous frontend production build are automated checks, not a manual UI acceptance test.
- Production deployment, production DB migration state, external Unsplash availability, responsive browser behavior, and real administrator provisioning were not verified.
- `.env` database connectivity and live MySQL migration state were not interrogated in this documentation task; only configuration values were read. Tests use in-memory SQLite.
- No persistence test across a browser refresh for quote draft state was run; the code carries draft in Router location state rather than persistent storage.

## Future Enhancements

- Add deployment-specific environment documentation and smoke checks.
- Add E2E tests for registration/login/logout, quote submission, favorite gating, review eligibility, and admin workflow.
- Add frontend API host configuration and document CORS/deployment topology once a target environment is selected.
- Revisit image ownership/storage and content-management requirements with the project owner.
