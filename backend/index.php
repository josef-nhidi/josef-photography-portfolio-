<?php

use Illuminate\Http\Request;

/**
 * Josef Photography - High Performance Root Bridge
 * This file lives in the root (wwwroot) and serves as the entry point.
 */

define('LARAVEL_START', microtime(true));

// 1. Check for maintenance mode
if (file_exists($maintenance = __DIR__.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

// 2. Register Autoloader (Directly in root)
require __DIR__.'/vendor/autoload.php';

// 3. Bootstrap Laravel (Directly in root)
(require_once __DIR__.'/bootstrap/app.php')
    ->handleRequest(Request::capture());
