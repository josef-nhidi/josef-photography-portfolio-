#!/bin/bash

# =============================================================================
# Josef Photography — Azure Startup Script (Simplified)
# =============================================================================

echo "Starting Azure App Service initialization..."

# 1. Detect PHP-FPM socket and Log it
echo "Searching for PHP-FPM sockets for diagnosis..."
find /var/run -name "*fpm.sock" -exec echo "FOUND_SOCKET: {}" \; >> /home/site/wwwroot/storage/logs/laravel.log 2>/dev/null || true

# 2. Patch Active Nginx Config
echo "Searching for active Nginx config..."
NGINX_CONF=$(grep -l "root /home/site/wwwroot" /etc/nginx/sites-available/* /etc/nginx/conf.d/* 2>/dev/null | head -n 1)

if [ -n "$NGINX_CONF" ]; then
    echo "Patching Nginx config at $NGINX_CONF..."
    # 1. Update Document Root
    sed -i 's|root /home/site/wwwroot;|root /home/site/wwwroot/public;|g' "$NGINX_CONF"
    
    # 2. Inject CORS globally into the server block (after the 'server {' line)
    # We use a broad origin * for debugging as approved in the plan
    sed -i '/server {/a \    add_header "Access-Control-Allow-Origin" "*" always;' "$NGINX_CONF"
    sed -i '/server {/a \    add_header "Access-Control-Allow-Methods" "GET, POST, OPTIONS, PUT, DELETE" always;' "$NGINX_CONF"
    sed -i '/server {/a \    add_header "Access-Control-Allow-Headers" "Authorization, Content-Type, X-CSRF-TOKEN" always;' "$NGINX_CONF"
    
    echo "Reloading Nginx via HUP..."
    kill -HUP $(cat /var/run/nginx.pid) 2>/dev/null || service nginx reload || true
else
    echo "Could not find active root config to patch. Using fallback copy..."
    cp /home/site/wwwroot/nginx.conf /etc/nginx/sites-available/default 2>/dev/null
    service nginx reload 2>/dev/null || true
fi

# 3. Storage setup and aggressive permissions
echo "Setting up storage directories..."
mkdir -p /home/site/wwwroot/storage/{app,framework,logs}
mkdir -p /home/site/wwwroot/storage/framework/{cache,sessions,views}
mkdir -p /home/site/wwwroot/storage/app/public/photos
mkdir -p /home/site/wwwroot/bootstrap/cache

# Fix permissions
chown -R www-data:www-data /home/site/wwwroot/storage /home/site/wwwroot/bootstrap/cache /home/site/wwwroot/database 2>/dev/null || true
chmod -R 777 /home/site/wwwroot/storage /home/site/wwwroot/bootstrap/cache /home/site/wwwroot/database 2>/dev/null || true

# 4. Run Laravel optimizations
echo "Running Laravel optimizations..."
cd /home/site/wwwroot
# Root fallback symlink
ln -sf public/index.php index.php
php artisan storage:link --force 2>/dev/null || true
php artisan migrate --force 2>/dev/null || true
php artisan config:cache
php artisan route:cache

echo "Initialization complete! Patch applied to $NGINX_CONF"
