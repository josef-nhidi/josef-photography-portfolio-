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
echo "Clearing cache..."
php artisan config:clear || true
php artisan optimize:clear || true
php artisan route:clear || true

# Run migrations if possible (60s timeout)
echo "Running migrations..."
timeout 60 php artisan migrate --force || echo "Migration skipped or failed, continuing startup..."

# Initial Admin Creation (60s timeout)
if [ ! -z "$INIT_ADMIN_USER" ] && [ ! -z "$INIT_ADMIN_PASS" ]; then
    echo "Checking for admin user: $INIT_ADMIN_USER..."
    timeout 60 php artisan tinker --execute="\$u = App\Models\User::updateOrCreate(['email' => '$INIT_ADMIN_USER'], ['name' => '$INIT_ADMIN_USER', 'password' => Hash::make('$INIT_ADMIN_PASS')]); echo 'SUCCESS: Admin user created/updated id=' . \$u->id . PHP_EOL;" || echo "Admin setup skipped or failed..."
fi

# Start supervisor
echo "READY: Signaling startup completion..."
echo "Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
