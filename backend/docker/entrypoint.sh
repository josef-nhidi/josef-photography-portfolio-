#!/bin/sh
set -e

cd /var/www

# ── STEP 1: PERSISTENT PHOTO STORAGE (Azure /home survives restarts) ─────────
echo "Mounting persistent photo storage from /home..."

# Create persistent photo directories in /home
mkdir -p /home/storage/app/public/photos

# Create local storage dirs (logs, cache, sessions stay local - fine to recreate)
mkdir -p /var/www/storage/logs
mkdir -p /var/www/storage/framework/views
mkdir -p /var/www/storage/framework/sessions
mkdir -p /var/www/storage/framework/cache
mkdir -p /var/www/storage/app/public

# Symlink ONLY the photos folder to persistent /home
# Photos survive restarts; everything else is recreated cleanly
rm -rf /var/www/storage/app/public/photos
ln -sf /home/storage/app/public/photos /var/www/storage/app/public/photos

# Rebuild the public/storage symlink
rm -rf /var/www/public/storage
ln -sf /var/www/storage/app/public /var/www/public/storage

# Ensure SQLite DB exists locally (recreated via migrations on each deploy if missing)
mkdir -p /var/www/database
if [ ! -f /var/www/database/database.sqlite ]; then
    echo "Creating fresh local database.sqlite..."
    touch /var/www/database/database.sqlite
fi

# Fix permissions
chown -R www-data:www-data /home/storage /var/www/storage /var/www/database /var/www/bootstrap/cache /var/www/public
chmod -R 775 /home/storage /var/www/storage /var/www/database /var/www/bootstrap/cache /var/www/public

echo "Storage ready. Photos are persistent. DB is local."

# ── STEP 2: LARAVEL BOOT ────────────────────────────────────────────────────
echo "Clearing cache..."
php artisan config:clear || true
php artisan optimize:clear || true
php artisan route:clear || true

echo "Running migrations..."
timeout 60 php artisan migrate --force || echo "Migration skipped or failed, continuing..."

# Initial Admin Creation
if [ ! -z "$INIT_ADMIN_USER" ] && [ ! -z "$INIT_ADMIN_PASS" ]; then
    echo "Checking for admin user: $INIT_ADMIN_USER..."
    timeout 60 php artisan tinker --execute="\$u = App\Models\User::updateOrCreate(['email' => '$INIT_ADMIN_USER'], ['name' => '$INIT_ADMIN_USER', 'password' => Hash::make('$INIT_ADMIN_PASS')]); echo 'SUCCESS: Admin user created/updated id=' . \$u->id . PHP_EOL;" || echo "Admin setup skipped..."
fi

# ── STEP 3: FINAL PERMISSION PASS & LAUNCH ─────────────────────────────────
echo "Fixing final permissions..."
touch /home/storage/logs/laravel.log || true
chown -R www-data:www-data /home/storage /home/database /var/www/bootstrap/cache || true
chmod -R 775 /home/storage /home/database /var/www/bootstrap/cache || true

echo "Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
