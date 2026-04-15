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

# 3. Storage setup and broad permissions
echo "Setting up storage directories..."
cd /home/site/wwwroot
mkdir -p storage/{app,framework,logs}
mkdir -p storage/framework/{cache,sessions,views}
mkdir -p storage/app/public/photos
mkdir -p bootstrap/cache

# Create Nginx log files if they don't exist
touch storage/logs/nginx-error.log storage/logs/nginx-access.log

# Fix permissions across the entire root to rule out access issues
echo "Applying permissive permissions..."
chown -R www-data:www-data . 2>/dev/null || true
chmod -R 777 . 2>/dev/null || true

# 4. Run Laravel optimizations
echo "Running Laravel optimizations..."
php artisan storage:link --force 2>/dev/null || true
php artisan migrate --force 2>/dev/null || true
php artisan config:cache
php artisan route:cache

echo "Initialization complete! Routing should now be active at /home/site/wwwroot"
