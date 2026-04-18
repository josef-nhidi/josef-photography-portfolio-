<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Force update existing accent_color to unified Admin Blue
        DB::table('settings')
            ->where('key', 'accent_color')
            ->update(['value' => '#2563eb']);
    }

    public function down(): void
    {
        DB::table('settings')
            ->where('key', 'accent_color')
            ->update(['value' => '#d4af37']);
    }
};
