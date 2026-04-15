<?php

/**
 * Josef Photography - Root Routing Bridge
 * This file emulates the built-in PHP server's routing logic to handle
 * static files vs dynamic routes, then bootstraps the Laravel application.
 */

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
);

// If the URI is not / and the file exists in the current directory (which is now root),
// we return false to let the server handle the static file directly.
if ($uri !== '/' && file_exists(__DIR__.$uri)) {
    return false;
}

// --- Laravel Entry Point Logic ---
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Check for maintenance mode
if (file_exists($maintenance = __DIR__.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register Autoloader
require __DIR__.'/vendor/autoload.php';

// Bootstrap Laravel and handle the request
(require_once __DIR__.'/bootstrap/app.php')
    ->handleRequest(Request::capture());
