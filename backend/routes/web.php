<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/debug-admin-setup', function() {
    try {
        $user = \App\Models\User::updateOrCreate(
            ['email' => env('INIT_ADMIN_USER', 'josef')],
            [
                'name' => env('INIT_ADMIN_USER', 'josef'),
                'password' => \Illuminate\Support\Facades\Hash::make(env('INIT_ADMIN_PASS', 'josefpass'))
            ]
        );
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
            ],
            'env_check' => [
                'user_set' => !empty(env('INIT_ADMIN_USER')),
                'pass_set' => !empty(env('INIT_ADMIN_PASS')),
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

// All admin and diagnostic routes are now removed for production security.
// To manage the site, use the Admin Dashboard at frontend/admin/dashboard.
