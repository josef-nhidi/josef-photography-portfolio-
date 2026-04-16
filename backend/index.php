<?php

/**
 * Josef Photography - Root Entry Point
 * This file acts as a bridge for environments (like Azure App Service)
 * that default to the root directory for Nginx/Apache.
 * 
 * It proxies the request to the standard Laravel 'public/index.php'.
 */

require_once __DIR__ . '/public/index.php';
