# NOVA — Event Management Platform

NOVA is a full-stack event management platform designed for organizing and preparing small events such as birthdays, graduations, engagements, giveaways, decorations, bouquets, and gifts.

The platform provides a public website for browsing services and packages, customer accounts for submitting and tracking quote requests, and an admin dashboard for managing the platform.

## Tech Stack

### Backend

* Laravel 13
* PHP 8.3
* MySQL
* Laravel Sanctum
* RESTful API
* PHPUnit

### Frontend

* React 19
* TypeScript
* Vite
* Axios
* CSS

### Development Tools

* Laragon
* Git & GitHub
* Laravel Pint

## Main Features

### Public Website

* Home page
* Services
* Service details
* Packages
* Gallery
* About Us
* Contact
* Authentication

### Customer Features

* Register and login
* View available services and packages
* Submit quote requests
* View personal quote requests
* Track request status
* Favorites
* Reviews
* Profile management
* Notifications

### Admin Features

* Admin authentication and authorization
* Dashboard
* Manage services
* Manage packages
* Manage customers
* Manage quote requests
* Update request status
* Manage reviews
* View platform information

### Quote Request Workflow

Customer requests follow a simple status workflow:

`Pending → Confirmed → Completed`

Customers can view the status of their own requests, while administrators can manage and update request statuses.

### Authentication & Authorization

The application uses Laravel Sanctum for API authentication.

The system supports different user roles, including:

* Customer
* Admin

Administrative endpoints are protected using authentication and admin authorization middleware.

Customer data is isolated so authenticated customers can access only their own account-related resources.

## Project Structure

```text
nova-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   └── Middleware/
│   ├── Models/
│   └── Notifications/
│
├── database/
│   ├── migrations/
│   ├── factories/
│   └── seeders/
│
├── docs/
│   ├── API documentation
│   ├── Architecture documentation
│   ├── Database documentation
│   ├── Testing documentation
│   └── Developer handoff documentation
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
│
├── routes/
│   └── api.php
│
├── tests/
│   ├── Feature/
│   └── Unit/
│
└── README.md
```

## API

The backend provides RESTful API endpoints for:

* Authentication
* Services
* Packages
* Quote requests
* Favorites
* Reviews
* Notifications
* Profile
* Customer management
* Admin management

Detailed API documentation is available in:

`docs/04-API-DOCUMENTATION.md`

## Testing

The project includes feature and unit tests covering major application workflows and API functionality.

The latest verified Laravel test suite passed:

* **11 tests**
* **96 assertions**

Run the tests with:

```bash
php artisan test
```

## Local Setup

### Requirements

* PHP 8.3+
* Composer
* Node.js
* npm
* MySQL
* Laravel
* Git

### Backend

Clone the repository:

```bash
git clone https://github.com/Shahdayman10/nova-event-management.git
cd nova-event-management
```

Install PHP dependencies:

```bash
composer install
```

Create the environment file:

```bash
cp .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

Configure the database in `.env`.

Create the database and run migrations:

```bash
php artisan migrate
```

Seed the database:

```bash
php artisan db:seed
```

Start the Laravel development server:

```bash
php artisan serve
```

The backend will normally be available at:

```text
http://localhost:8000
```

### Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

## Environment Variables

Sensitive environment configuration is stored in `.env` and is intentionally excluded from the repository.

Use `.env.example` as the starting point for local configuration.

**Never commit real passwords, API keys, tokens, or other secrets to GitHub.**

## Documentation

The project includes detailed documentation for future development and handoff.

Start here:

`docs/DOCUMENTATION-INDEX.md`

Important documentation includes:

* Project overview
* Setup and running instructions
* Backend architecture
* API documentation
* Authentication and authorization
* Database structure
* Frontend architecture
* Feature map
* Admin dashboard
* Customer flow
* Testing
* Recent changes
* Image and storage handling
* Known issues and next steps
* Developer handoff
* Project file map
* Changelog

## Current Project Status

The main backend and frontend features have been implemented and documented.

Automated backend tests have been verified successfully, and the React frontend build has been verified.

Manual browser-based UI testing and production deployment are still part of the next development stage.

## Future Improvements

Possible future improvements include:

* Production deployment
* Production database configuration
* Image optimization and storage improvements
* Lazy loading for images
* Improved frontend performance
* Final browser-based UI testing
* Cleaning up package-manager configuration
* Additional automated tests
* Production-ready environment configuration

## Portfolio Note

NOVA is a fictional event management project created as a full-stack web development portfolio project.

It demonstrates practical experience with:

* Backend API development
* Laravel application architecture
* React frontend development
* Authentication and authorization
* Database design
* REST APIs
* Admin/customer workflows
* Automated testing
* Git and GitHub
* Technical documentation

## License

This project is intended for portfolio and educational purposes.
