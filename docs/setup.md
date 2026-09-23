# Local Development Setup

Version: 1.1  
Prepared by: Christian Ortiz  
Questions? Contact Christian at [Facebook](https://www.facebook.com/its.zirch) or `christianortiz.tech@gmail.com`.

New to this repository? Start here.

This guide sets up MSLv2026 with PHP, Laravel, MySQL, and Vite. Run all commands from a terminal unless noted otherwise.

## Prerequisites

Install the following:

- Git
- PHP 8.2 or later, with the `pdo_mysql` extension enabled
- Composer
- Node.js and npm
- MySQL 8.0 or later
- Laravel Herd (recommended)

### Verify the required tools

#### macOS/Linux

```bash
git --version
php -v
php -m | grep -i pdo_mysql
composer --version
node --version
npm --version
mysql --version
herd --version
which php
```

If Laravel Herd manages PHP on macOS, the PHP path should resemble:

```text
/Users/your-name/Library/Application Support/Herd/bin/php
```

On Linux, the path depends on how PHP was installed. The important requirement is that PHP 8.2 or later and `pdo_mysql` are available.

#### Windows (PowerShell)

```powershell
git --version
php -v
php -m | Select-String -Pattern "pdo_mysql"
composer --version
node --version
npm --version
mysql --version
herd --version
where.exe php
```

If a command is not recognized, install the missing tool and open a new terminal so its `PATH` changes take effect.

## 1. Clone the repository

The commands are the same on macOS, Linux, and Windows:

```text
git clone <repository-url>
cd MSLv2026
```

Replace `<repository-url>` with the repository's actual Git URL.

## 2. Install project dependencies

```text
composer install
npm install
```

Do not run `npm audit fix` automatically. It can install breaking dependency updates.

## 3. Create the environment file

### macOS/Linux

```bash
cp .env.example .env
php artisan key:generate
```

### Windows (PowerShell)

```powershell
Copy-Item .env.example .env
php artisan key:generate
```

If `.env` already exists, keep it and do not overwrite it unless you intend to reset the local configuration.

## 4. Start MySQL and create the database

Start the MySQL service using the method appropriate for your installation.

### macOS with Homebrew

```bash
brew services start mysql
```

### Linux with systemd

```bash
sudo systemctl enable --now mysql
```

Some Linux distributions name the service `mysqld`. If `mysql` is not found, try:

```bash
sudo systemctl enable --now mysqld
```

### Windows (PowerShell as Administrator)

Find the installed MySQL service name:

```powershell
Get-Service *mysql*
```

Then start it, replacing `MySQL80` if your service has a different name:

```powershell
Start-Service MySQL80
```

### Create a local database and user

Open the MySQL client on any operating system:

```text
mysql -u root -p
```

Enter the MySQL root password when prompted, then run:

```sql
CREATE DATABASE mslv2026
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE USER 'mslv2026'@'localhost' IDENTIFIED BY 'change-this-password';
GRANT ALL PRIVILEGES ON mslv2026.* TO 'mslv2026'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Use a strong local password and do not commit it to Git. If the database or user already exists, skip its `CREATE` statement and confirm that the user has access to the database.

## 5. Configure Laravel to use MySQL

Open `.env` and replace its database settings with:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mslv2026
DB_USERNAME=mslv2026
DB_PASSWORD=change-this-password
```

Set `DB_PASSWORD` to the password created in the previous step. If the password contains spaces or `#`, wrap it in double quotes.

Clear any previously cached Laravel configuration:

```text
php artisan config:clear
```

Verify that PHP can connect to MySQL:

```text
php artisan migrate:status
```

If the command reports `Access denied`, check the username and password. If it reports `Connection refused`, confirm that MySQL is running and listening on port `3306`.

## 6. Create the database tables

For a new installation:

```text
php artisan migrate
```

To populate the database with the project's default seeder:

```text
php artisan db:seed
```

To run a specific project seeder, use its class name:

```text
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=SuperAdminSeeder
```

Run `PermissionSeeder` before `SuperAdminSeeder` so the administrator can receive the available permissions.

To delete all tables, rebuild them, and run the default seeder:

```text
php artisan migrate:fresh --seed
```

> **Warning:** `migrate:fresh` permanently deletes all records in the configured database. Use it only for a disposable local database.

## 7. Build or run the frontend

Build production assets once:

```text
npm run build
```

For active development, start Vite and leave it running:

```text
npm run dev
```

## 8. Run the application

Choose either Laravel Herd or Laravel's built-in development server.

### Option A: Laravel Herd

From the project directory:

```text
herd link
herd links
```

The application should be available at:

```text
http://mslv2026.test
```

The exact URL can differ based on the linked directory name. Keep `npm run dev` running in a separate terminal while editing frontend files.

### Option B: Laravel development server

Start the backend:

```text
php artisan serve
```

In a second terminal, from the same project directory, start Vite:

```text
npm run dev
```

Open the URL printed by `php artisan serve`, normally:

```text
http://127.0.0.1:8000
```

## 9. Run the tests

```text
composer test
```

The automated test configuration uses an in-memory SQLite database, so tests do not modify the local MySQL database.

## Common issues

### `could not find driver`

The PHP command-line installation does not have `pdo_mysql` enabled. Enable the extension for the same PHP binary reported by `which php` on macOS/Linux or `where.exe php` on Windows, then restart the terminal.

### `Unknown database 'mslv2026'`

Create the database as described in step 4 and ensure `DB_DATABASE=mslv2026` in `.env`.

### Laravel still uses old database settings

```text
php artisan optimize:clear
```

### Frontend assets are missing

```text
npm install
npm run build
```
