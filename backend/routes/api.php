<?php

use App\Http\Controllers\Api\PhotoController;
use App\Http\Controllers\Api\AlbumController;
use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::get('/photos', [PhotoController::class, 'index']);
Route::get('/photos/category/{category}', [PhotoController::class, 'byCategory']);
Route::post('/photos/{photo}/view', [PhotoController::class, 'incrementView']); // Public view tracking
Route::get('/albums', [AlbumController::class, 'index']);
Route::get('/albums/{album}', [AlbumController::class, 'show']); // Parameter changed from {id} to {album}
Route::get('/about', [AboutController::class, 'show']);
Route::get('/settings', [SettingController::class, 'index']);


// Admin login route (public)
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

// Admin routes (protected by auth:sanctum)
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/photos', [PhotoController::class, 'store']);
    Route::put('/photos/{photo}', [PhotoController::class, 'update']); // New update route for photos
    Route::delete('/photos/{photo}', [PhotoController::class, 'destroy']); // Parameter changed from {id} to {photo}

    Route::post('/albums', [AlbumController::class, 'store']);
    Route::put('/albums/{album}', [AlbumController::class, 'update']); // New update route for albums
    Route::delete('/albums/{album}', [AlbumController::class, 'destroy']); // Parameter changed from {id} to {album}

    Route::post('/about', [AboutController::class, 'update']); // This was already there, now inside the protected group

    Route::put('/credentials', [AuthController::class, 'updateCredentials']);
    
    Route::get('/analytics', [AnalyticsController::class, 'index']);

    Route::put('/settings', [SettingController::class, 'update']);
});
