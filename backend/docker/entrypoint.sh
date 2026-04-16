#!/bin/sh
set -e

# Ensure we are in the right directory
cd /var/www

# Fix permissions one last time for mounted volumes
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/database
chmod -R 775 /var/www/storage /var/www/bootstrap/cache /var/www/database

# Ensure SQLite file exists and is writable
if [ ! -f /var/www/database/database.sqlite ]; then
    echo "Creating database.sqlite..."
    touch /var/www/database/database.sqlite
    chown www-data:www-data /var/www/database/database.sqlite
fi

# Run Laravel optimizations
echo "Clearing cache and optimizing..."
php artisan optimize:clear || true
php artisan config:cache || true
php artisan route:cache || true

# Run migrations if possible
echo "Running migrations..."
php artisan migrate --force || echo "Migration failed, continuing startup..."

# Start supervisor
echo "Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
