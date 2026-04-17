#!/bin/sh
set -e

cd /var/www

# ── STEP 1: PERSISTENT STORAGE (Azure /home survives restarts) ──────────────
echo "Mounting persistent storage layer from /home..."

# 1.1 PROVISIONS
mkdir -p /home/storage/app/public/photos
mkdir -p /home/database

# 1.2 LINK PHOTOS
# Create local storage base if it somehow vanished
mkdir -p /var/www/storage/app/public
rm -rf /var/www/storage/app/public/photos
ln -sf /home/storage/app/public/photos /var/www/storage/app/public/photos

# 1.3 LINK DATABASE
# We move the entire DB directory to /home to allow SQLite to create journal files on persistent disk
rm -rf /var/www/database
ln -sf /home/database /var/www/database

# 1.4 ENSURE DB FILE
if [ ! -f /home/database/database.sqlite ]; then
    echo "Creating fresh persistent database.sqlite..."
    touch /home/database/database.sqlite
fi

# 1.5 LINK PUBLIC STORAGE
rm -rf /var/www/public/storage
ln -sf /var/www/storage/app/public /var/www/public/storage

# 1.6 LOCAL HELPER DIRS
mkdir -p /var/www/storage/logs
mkdir -p /var/www/storage/framework/views
mkdir -p /var/www/storage/framework/sessions
mkdir -p /var/www/storage/framework/cache

# 1.7 PERMISSIONS
echo "Fixing permissions on persistent and ephemeral paths..."
chown -R www-data:www-data /home/storage /home/database /var/www/storage /var/www/bootstrap/cache /var/www/public || true
chmod -R 775 /home/storage /home/database /var/www/storage /var/www/bootstrap/cache /var/www/public || true

echo "Storage systems unified and persistent."

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
echo "Fixing final logging permissions..."
touch /var/www/storage/logs/laravel.log || true
chown -R www-data:www-data /home/storage /home/database /var/www/storage /var/www/bootstrap/cache || true
chmod -R 775 /home/storage /home/database /var/www/storage /var/www/bootstrap/cache || true

echo "Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
