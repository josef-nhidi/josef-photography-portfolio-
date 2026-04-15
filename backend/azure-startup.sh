#!/bin/bash

# =============================================================================
# Josef Photography — Azure Startup Script (Simplified)
# =============================================================================

echo "Starting Azure App Service initialization..."

# 1. Ensure SQLite database exists
DB_PATH="/home/site/wwwroot/database/database.sqlite"
if [ ! -f "$DB_PATH" ]; then
    echo "Creating SQLite database at $DB_PATH..."
    mkdir -p "$(dirname "$DB_PATH")"
    touch "$DB_PATH"
fi

# 2. Storage setup
echo "Setting up storage directories..."
mkdir -p /home/site/wwwroot/storage/app/public/photos
mkdir -p /home/site/wwwroot/storage/framework/{cache,sessions,views}
mkdir -p /home/site/wwwroot/storage/logs
mkdir -p /home/site/wwwroot/bootstrap/cache

# 3. Fix permissions
chown -R www-data:www-data /home/site/wwwroot/storage /home/site/wwwroot/bootstrap/cache /home/site/wwwroot/database 2>/dev/null || true
chmod -R 775 /home/site/wwwroot/storage /home/site/wwwroot/bootstrap/cache /home/site/wwwroot/database 2>/dev/null || true

# 4. Run Laravel optimizations
echo "Running Laravel optimizations..."
cd /home/site/wwwroot
php artisan storage:link --force 2>/dev/null || true
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Initialization complete!"
