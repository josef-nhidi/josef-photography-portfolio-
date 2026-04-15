#!/bin/bash

# =============================================================================
# Josef Photography — Azure Startup Script (Simplified)
# =============================================================================

echo "Starting Azure App Service initialization..."

# 1. Detect PHP-FPM socket and Log it
echo "Searching for PHP-FPM sockets for diagnosis..."
find /var/run -name "*fpm.sock" -exec echo "FOUND_SOCKET: {}" \; >> /home/site/wwwroot/storage/logs/laravel.log 2>/dev/null || true

# 2. Public Flattening Strategy
echo "Flattening public folder to root..."
cd /home/site/wwwroot
cp -rf public/* . 2>/dev/null || true
cp -f public/index.php index.php

# 3. Storage setup and aggressive permissions
echo "Setting up storage directories..."
mkdir -p storage/{app,framework,logs}
mkdir -p storage/framework/{cache,sessions,views}
mkdir -p storage/app/public/photos
mkdir -p bootstrap/cache

# Fix permissions
chown -R www-data:www-data . 2>/dev/null || true
chmod -R 775 storage bootstrap/cache database 2>/dev/null || true

# 4. Run Laravel optimizations
echo "Running Laravel optimizations..."
cd /home/site/wwwroot
php artisan storage:link --force 2>/dev/null || true
php artisan migrate --force 2>/dev/null || true
php artisan config:cache
php artisan route:cache

echo "Initialization complete! Public folder flattened to root."
