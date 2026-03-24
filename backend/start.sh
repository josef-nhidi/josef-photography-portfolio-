#!/bin/bash

# Run migrations automatically
echo "Running migrations..."
php artisan migrate --force

# Start Apache in the foreground
echo "Starting Apache..."
apache2-foreground
