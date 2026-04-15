#!/bin/bash

# =============================================================================
# Josef Photography — Azure Startup Script (Simplified)
# =============================================================================

echo "Starting Azure App Service initialization..."

# 1. Detect PHP-FPM socket and Log it
echo "Searching for PHP-FPM sockets for diagnosis..."
find /var/run -name "*fpm.sock" -exec echo "FOUND_SOCKET: {}" \; >> /home/site/wwwroot/storage/logs/laravel.log 2>/dev/null || true

# 2. Override the default Nginx configuration
echo "Copying custom nginx.conf to /etc/nginx/sites-available/default..."
cp /home/site/wwwroot/nginx.conf /etc/nginx/sites-available/default
service nginx reload

# 3. Storage setup and aggressive permissions
echo "Setting up storage directories with broad permissions..."
mkdir -p /home/site/wwwroot/storage/app/public/photos
mkdir -p /home/site/wwwroot/storage/framework/{cache,sessions,views}
mkdir -p /home/site/wwwroot/storage/logs
mkdir -p /home/site/wwwroot/bootstrap/cache

# Fix permissions aggressively to rule out access issues
chown -R www-data:www-data /home/site/wwwroot/storage /home/site/wwwroot/bootstrap/cache /home/site/wwwroot/database 2>/dev/null || true
chmod -R 777 /home/site/wwwroot/storage /home/site/wwwroot/bootstrap/cache /home/site/wwwroot/database 2>/dev/null || true

# 3. Run Laravel optimizations
echo "Running Laravel optimizations..."
cd /home/site/wwwroot
# Ensure we have the root index.php symlink for Document Root issues
ln -sf public/index.php index.php
php artisan storage:link --force 2>/dev/null || true
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Initialization complete! CORS headers injected via nginx.conf override."
