#!/bin/sh
set -e

cd /var/www

# ── STEP 1: PERSISTENT STORAGE (Azure /home) ──────────────────────────────────
echo "Mounting persistence bridge..."

# 1.1 PROVISIONS
mkdir -p /home/storage/app/public/photos
mkdir -p /home/database
mkdir -p /var/www/database
mkdir -p /var/www/storage/app/public

# 1.2 LINK PHOTOS (Static files work fine on network shares)
rm -rf /var/www/storage/app/public/photos
ln -sf /home/storage/app/public/photos /var/www/storage/app/public/photos

# 1.3 RESTORE DATABASE (Copy from persistent to local speed disk)
if [ -f /home/database/database.sqlite ]; then
    echo "Restoring database from persistent backup..."
    cp /home/database/database.sqlite /var/www/database/database.sqlite
else
    echo "No backup found, creating fresh local database.sqlite..."
    touch /var/www/database/database.sqlite
fi

# 1.4 LINK PUBLIC STORAGE
rm -rf /var/www/public/storage
ln -sf /var/www/storage/app/public /var/www/public/storage

# 1.5 LOCAL HELPER DIRS
mkdir -p /var/www/storage/logs
mkdir -p /var/www/storage/framework/views
mkdir -p /var/www/storage/framework/sessions
mkdir -p /var/www/storage/framework/cache

# 1.6 PERMISSIONS
echo "Fixing permissions..."
chown -R www-data:www-data /home/storage /home/database /var/www/storage /var/www/database /var/www/bootstrap/cache /var/www/public || true
chmod -R 775 /home/storage /home/database /var/www/storage /var/www/database /var/www/bootstrap/cache /var/www/public || true

echo "Storage bridge active. Restore complete."

# 1.7 START BACKGROUND SYNC (Backup local DB to persistent disk every 5 mins)
(
    while true; do
        sleep 300
        if [ -f /var/www/database/database.sqlite ]; then
            cp /var/www/database/database.sqlite /home/database/database.sqlite.tmp
            mv /home/database/database.sqlite.tmp /home/database/database.sqlite
            chown www-data:www-data /home/database/database.sqlite
            chmod 664 /home/database/database.sqlite
        fi
    done
) &

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
chown -R www-data:www-data /var/www/storage /var/www/database /var/www/bootstrap/cache || true
chmod -R 775 /var/www/storage /var/www/database /var/www/bootstrap/cache || true

echo "Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
