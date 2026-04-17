<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // This ensures the admin user was created during the foundation setup
        $username = env('INIT_ADMIN_USER', 'josef');
        $password = env('INIT_ADMIN_PASS', 'josefpass');

        if (!empty($username) && !empty($password)) {
            User::updateOrCreate(
                ['email' => $username],
                [
                    'name' => $username,
                    'password' => Hash::make($password)
                ]
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op
    }
};
