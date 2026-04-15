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
# Copy the entry point directly to root (more reliable than symlinks in some Azure configs)
cp -f public/index.php index.php

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
    php artisan route:cache
fi

echo "Initialization complete! Container stabilized."
Stabilization Trigger: Wed Apr 15 10:56:00 PM CET 2026
