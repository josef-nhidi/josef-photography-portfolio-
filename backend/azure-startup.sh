#!/bin/bash

# =============================================================================
# Josef Photography — Azure Nginx Startup Script
# =============================================================================

echo "Starting Azure App Service initialization..."

# 1. Detect PHP-FPM socket
# Azure PHP images sometimes use sockets instead of TCP 9000
echo "Detecting PHP-FPM socket..."
FPM_SOCKET=$(find /var/run -name "*php*fpm.sock" 2>/dev/null | head -n 1)
if [ -n "$FPM_SOCKET" ]; then
    echo "Found PHP-FPM socket at $FPM_SOCKET"
    # Ensure our nginx.conf (can) use this path if we configured it
else
    echo "No PHP-FPM socket found, assuming TCP 127.0.0.1:9000"
fi

# 2. Override the default Nginx configuration
echo "Copying custom nginx.conf to /etc/nginx/sites-available/default..."
cp /home/site/wwwroot/nginx.conf /etc/nginx/sites-available/default

# 3. Reload Nginx to apply the new root (/home/site/wwwroot/public)
echo "Reloading Nginx..."
service nginx reload

# 4. Ensure SQLite database exists
DB_PATH="/home/site/wwwroot/database/database.sqlite"
if [ ! -f "$DB_PATH" ]; then
    echo "Creating SQLite database at $DB_PATH..."
    mkdir -p "$(dirname "$DB_PATH")"
    touch "$DB_PATH"
fi

# 5. Storage setup
echo "Setting up storage directories..."
mkdir -p /home/site/wwwroot/storage/app/public/photos
mkdir -p /home/site/wwwroot/storage/framework/{cache,sessions,views}
mkdir -p /home/site/wwwroot/storage/logs
mkdir -p /home/site/wwwroot/bootstrap/cache

# 6. Fix permissions
chown -R www-data:www-data /home/site/wwwroot/storage /home/site/wwwroot/bootstrap/cache /home/site/wwwroot/database 2>/dev/null || true
chmod -R 775 /home/site/wwwroot/storage /home/site/wwwroot/bootstrap/cache /home/site/wwwroot/database 2>/dev/null || true

# 7. Run Laravel optimizations
echo "Running Laravel optimizations..."
cd /home/site/wwwroot
php artisan storage:link --force 2>/dev/null || true
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Initialization complete!"
