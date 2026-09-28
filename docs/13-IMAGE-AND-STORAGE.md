# Images and Storage

## Image Fields and Sources

`services.image` and `packages.image` are nullable string columns defined in:

- `database/migrations/2026_09_15_152546_create_services_table.php`
- `database/migrations/2026_09_15_153303_create_packages_table.php`

Admin service/package controllers accept image as nullable string (max 255); the Admin Dashboard labels these inputs as image URLs. No upload endpoint or multipart image handling was found in the API controllers.

The service seeder sets remote Unsplash URLs for six seeded services. The package seeder explicitly sets package `image` to `null`. Many images in Home, Services, Service Detail, Packages, About, and Gallery are also hard-coded Unsplash URLs in their React page files. See the file map below for pages that render `<img>`.

`frontend/src/index.css` imports DM Serif Display and Outfit from Google Fonts as external font URLs; these are not image assets but do require external network access when not cached.

## API-to-React Image Flow

The public service/package APIs serialize their `image` fields as part of Eloquent JSON. React pages use image strings in `<img src={...}>` for service content where wired. Some detail/gallery hero imagery remains a static URL in the page even where a service image exists in the API. Package cards currently present package content and features; their displayed visual imagery is primarily hard-coded section imagery rather than package upload flow.

## Laravel Filesystem Configuration

`config/filesystems.php` defines:

- `local`: `storage/app/private`.
- `public`: `storage/app/public`, URL based on `APP_URL` + `/storage`.
- `s3`: configurable AWS disk.
- A symbolic link mapping from `public/storage` to `storage/app/public` for `artisan storage:link`.

The configured default disk is `env('FILESYSTEM_DISK', 'local')`. No use of `Storage::`, `Storage::url()`, or `storage:link` was found in the application PHP/React source inspected for this guide. The presence of a configured disk/link is not evidence that NOVA currently uploads or serves image files through it.

## React `<img>` Pages

- `frontend/src/pages/HomePage.tsx`: hero, API service image, gallery composition, supporting image.
- `frontend/src/pages/ServicesPage.tsx`: API service images in cards and static collage images.
- `frontend/src/pages/ServiceDetailPage.tsx`: static hero/supporting/gallery images plus package section.
- `frontend/src/pages/PackagesPage.tsx`: static section images and package cards.
- `frontend/src/pages/AboutPage.tsx`: static external imagery.
- `frontend/src/pages/GalleryPage.tsx`: local array of external URLs with thumbnail and lightbox images.

No `loading="lazy"` attribute was found on the scanned React `<img>` elements.

## Potential Follow-up

If image uploads are required later, decide explicitly whether images remain external URLs or should be uploaded to a configured disk; then add server-side validation/storage, URL serialization, and UI upload handling. This is a potential enhancement, not a claim that uploads are currently broken.
