#!/bin/bash

# =============================================================================
# Josef Photography — Startup Script
# =============================================================================

echo "Starting Josef Photography..."

# --- Ensure SQLite database exists ---
DB_PATH="${DB_DATABASE:-/home/site/wwwroot/database/database.sqlite}"
if [ ! -f "$DB_PATH" ]; then
    echo "Creating SQLite database at $DB_PATH..."
    mkdir -p "$(dirname "$DB_PATH")"
    touch "$DB_PATH"
fi

# --- Ensure storage directories exist ---
echo "Setting up storage directories..."
mkdir -p /home/site/wwwroot/storage/app/public/photos
mkdir -p /home/site/wwwroot/storage/framework/{cache,sessions,views}
mkdir -p /home/site/wwwroot/storage/logs
mkdir -p /home/site/wwwroot/bootstrap/cache

# --- Set permissions ---
chown -R www-data:www-data /home/site/wwwroot/storage 2>/dev/null || true
chown -R www-data:www-data /home/site/wwwroot/bootstrap/cache 2>/dev/null || true
chmod -R 775 /home/site/wwwroot/storage 2>/dev/null || true
chmod -R 775 /home/site/wwwroot/bootstrap/cache 2>/dev/null || true

# --- Create storage symlink ---
echo "Creating storage symlink..."
php artisan storage:link --force 2>/dev/null || true

# --- Run migrations ---
echo "Running migrations..."
php artisan migrate --force

# --- Cache config for performance ---
echo "Caching config..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# --- Start Apache ---
echo "Starting Apache..."
apache2-foreground
