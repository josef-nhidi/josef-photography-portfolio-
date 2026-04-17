<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Forcefully synchronizes the 'Onyx & Azure' palette across the database.
     */
    public function up(): void
    {
        // 1. Synchronize Accent Color (Clinical Azure)
        DB::table('settings')->updateOrInsert(
            ['key' => 'accent_color'],
            ['value' => '#2563eb', 'updated_at' => now()]
        );

        // 2. Synchronize Primary Color (High-Fidelity Onyx)
        DB::table('settings')->updateOrInsert(
            ['key' => 'primary_color'],
            ['value' => '#050505', 'updated_at' => now()]
        );
        
        // 3. Ensure Logo Text is also aligned if needed
        // (Optional: can add more synchronizations here)
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op for branding synchronization
    }
};
