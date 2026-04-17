<?php

use Illuminate\Support\Facades\Route;

/**
 * Diagnostic tool to check registered routes in production.
 */

define('LARAVEL_START', microtime(true));

// Boot the Laravel app
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

header('Content-Type: text/plain');

echo "--- ROUTE DIAGNOSTIC TOOL ---\n";
echo "Environment: " . app()->environment() . "\n";
echo "Date: " . date('Y-m-d H:i:s') . "\n\n";

$routes = Route::getRoutes();

foreach ($routes as $route) {
    echo sprintf(
        "%-6s | %-30s | %s\n",
        implode('|', $route->methods()),
        $route->uri(),
        $route->getName() ?? 'unnamed'
    );
}

echo "\n--- END DIAGNOSTIC ---\n";
