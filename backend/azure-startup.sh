#!/bin/bash

# =============================================================================
# Josef Photography — Azure Nginx Startup Script
# =============================================================================

echo "Starting Azure App Service initialization..."

# 1. Override the default Nginx configuration
echo "Copying custom nginx.conf to /etc/nginx/sites-available/default..."
cp /home/site/wwwroot/nginx.conf /etc/nginx/sites-available/default

# 2. Reload Nginx to apply the new root (/home/site/wwwroot/public)
echo "Reloading Nginx..."
service nginx reload

# 3. Ensure SQLite database exists
DB_PATH="/home/site/wwwroot/database/database.sqlite"
if [ ! -f "$DB_PATH" ]; then
    echo "Creating SQLite database at $DB_PATH..."
    mkdir -p "$(dirname "$DB_PATH")"
    touch "$DB_PATH"
fi

# 4. Storage setup
echo "Setting up storage directories..."
mkdir -p /home/site/wwwroot/storage/app/public/photos
mkdir -p /home/site/wwwroot/storage/framework/{cache,sessions,views}
mkdir -p /home/site/wwwroot/storage/logs
mkdir -p /home/site/wwwroot/bootstrap/cache

# 5. Fix permissions
chown -R www-data:www-data /home/site/wwwroot/storage /home/site/wwwroot/bootstrap/cache 2>/dev/null || true
chmod -R 775 /home/site/wwwroot/storage /home/site/wwwroot/bootstrap/cache 2>/dev/null || true

# 6. Run Laravel specific optimized commands
echo "Running Laravel optimizations and migrations..."
php artisan storage:link --force 2>/dev/null || true
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Initialization complete!"
