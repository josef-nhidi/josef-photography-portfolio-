#!/bin/sh
set -e

cd /var/www

# ── STEP 1: PERSISTENT STORAGE (Azure /home survives restarts) ──────────────
echo "Mounting persistent storage from /home..."

# Create persistent directories in /home if they don't exist yet
mkdir -p /home/storage/app/public/photos
mkdir -p /home/storage/logs
mkdir -p /home/storage/framework/views
mkdir -p /home/storage/framework/sessions
mkdir -p /home/storage/framework/cache
mkdir -p /home/database

# Replace ephemeral container dirs with symlinks to persistent /home
rm -rf /var/www/storage
ln -sf /home/storage /var/www/storage

rm -rf /var/www/database
ln -sf /home/database /var/www/database

# Ensure SQLite DB file exists in persistent location
if [ ! -f /home/database/database.sqlite ]; then
    echo "Creating fresh database.sqlite in persistent storage..."
    touch /home/database/database.sqlite
fi

# Rebuild the public/storage symlink pointing to persistent photos
rm -rf /var/www/public/storage
ln -sf /home/storage/app/public /var/www/public/storage

# Fix permissions on persistent dirs
chown -R www-data:www-data /home/storage /home/database
chmod -R 775 /home/storage /home/database
chown -R www-data:www-data /var/www/bootstrap/cache /var/www/public
chmod -R 775 /var/www/bootstrap/cache /var/www/public

echo "Persistent storage ready."

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
