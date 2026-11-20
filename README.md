# MSLv2026
## Setup

This project requires PHP 8.2+, Composer, Node.js, npm, and MySQL 8+.

For complete installation instructions for macOS, Linux, and Windows, see the
[Local Development Setup](docs/setup.md) guide.

Quick start:

```bash
composer install
npm install
cp .env.example .env
# Configure MySQL DB_* settings and optional ADMIN_* credentials in .env first.
php artisan key:generate
php artisan migrate --seed
npm run dev
```

Run `php artisan serve` in another terminal to start the backend.
