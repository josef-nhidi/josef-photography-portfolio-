#!/bin/sh
set -e

# Ensure we are in the right directory
cd /var/www

# Fix permissions one last time for mounted volumes
mkdir -p /var/www/storage/logs /var/www/storage/framework/views /var/www/storage/framework/sessions /var/www/storage/framework/cache
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/database
chmod -R 775 /var/www/storage /var/www/bootstrap/cache /var/www/database

# Ensure SQLite file exists and is writable
if [ ! -f /var/www/database/database.sqlite ]; then
    echo "Creating database.sqlite..."
    touch /var/www/database/database.sqlite
    chown www-data:www-data /var/www/database/database.sqlite
fi

# Link storage (Absolute Force Reconstruction)
echo "Force-reconstructing storage bridge..."
rm -rf /var/www/public/storage || true
mkdir -p /var/www/storage/app/public/photos /var/www/storage/app/public/about || true
cd /var/www/public && ln -snf ../storage/app/public storage || true
chown -R www-data:www-data /var/www/public /var/www/storage || true
chmod -R 775 /var/www/public /var/www/storage || true
cd /var/www

# Run Laravel optimizations
echo "Clearing cache..."
php artisan config:clear || true
php artisan optimize:clear || true
php artisan route:clear || true

# Wait for Database (Handshake Guard)
echo "Waiting for database connection..."
until php artisan tinker --execute="DB::connection()->getPdo();" > /dev/null 2>&1; do
    echo "Database not ready yet... Retrying in 2 seconds..."
    sleep 2
done
echo "Database handshake success!"

# Run migrations (Force Synchronization)
echo "Running migrations..."
php artisan migrate --force

# Initial Admin Creation
if [ ! -z "$INIT_ADMIN_USER" ] && [ ! -z "$INIT_ADMIN_PASS" ]; then
    echo "Checking for admin user: $INIT_ADMIN_USER..."
    php artisan tinker --execute="\$u = App\Models\User::updateOrCreate(['email' => '$INIT_ADMIN_USER'], ['name' => '$INIT_ADMIN_USER', 'password' => Hash::make('$INIT_ADMIN_PASS')]); echo 'SUCCESS: Admin user created/updated id=' . \$u->id . PHP_EOL;" || echo "Admin setup skipped or failed..."
fi

# Start supervisor
echo "READY: Signaling startup completion..."
echo "Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
