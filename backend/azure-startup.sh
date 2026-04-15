#!/bin/bash

# =============================================================================
# Josef Photography — Azure Startup Script (Optimized)
# =============================================================================

echo "Starting Azure App Service initialization..."

# 1. Database Initialization
echo "Initializing database..."
mkdir -p /home/site/wwwroot/database
DB_PATH="/home/site/wwwroot/database/database.sqlite"
if [ ! -f "$DB_PATH" ]; then
    touch "$DB_PATH"
fi
chmod -R 777 /home/site/wwwroot/database

# 2. Fast Copy Strategy
echo "Applying fast file mapping..."
cd /home/site/wwwroot
# Permissions setup
chmod -R 777 storage bootstrap/cache
mkdir -p storage/logs
touch storage/logs/laravel.log
chmod 666 storage/logs/laravel.log

# 3. Storage and Cache setup
echo "Setting up storage..."
mkdir -p storage/{app,framework,logs}
mkdir -p storage/framework/{cache,sessions,views}
mkdir -p bootstrap/cache

# Fix permissions minimally and fast
chmod -R 777 storage bootstrap/cache

# 4. Run Laravel optimizations (if artisan exists)
if [ -f "artisan" ]; then
    echo "Running Laravel optimizations..."
    php artisan storage:link --force 2>/dev/null || true
    php artisan migrate --force 2>/dev/null || true
    php artisan config:cache
    # 5. Forensic Audit
echo "Performing Forensic Route Audit..."
php artisan route:list > /home/site/wwwroot/storage/logs/audit.log 2>&1 || echo "Audit Failed" > /home/site/wwwroot/storage/logs/audit.log

echo "Initialization complete! Search storage/logs/audit.log for route list."
Stabilization Trigger: Wed Apr 15 10:56:00 PM CET 2026
Force Deploy: Wed Apr 15 11:11:35 PM CET 2026
