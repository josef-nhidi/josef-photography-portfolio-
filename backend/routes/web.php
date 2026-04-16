<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

require __DIR__.'/auth.php';

// All admin and diagnostic routes are now removed for production security.
// To manage the site, use the Admin Dashboard at frontend/admin/dashboard.
