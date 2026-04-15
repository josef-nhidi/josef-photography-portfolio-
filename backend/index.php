<?php

/**
 * Josef Photography - Root Router
 * This script ensures that all requests reach the Laravel entry point
 * even when Azure's Nginx is not correctly configured.
 */

$publicPath = __DIR__ . '/public';
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// If the file exists in public/, serve it directly
if ($uri !== '/' && file_exists($publicPath . $uri)) {
    return false;
}

// Otherwise, hand over to the Laravel index.php
require_once $publicPath . '/index.php';
