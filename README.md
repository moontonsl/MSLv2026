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
php artisan key:generate
php artisan migrate --seed
npm run dev