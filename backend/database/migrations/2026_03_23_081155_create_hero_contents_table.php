<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_contents', function (Blueprint $table) {
            $table->id();
            $table->string('headline')->default('Josef Nhidi Photography');
            $table->string('subheadline')->default('Capturing moments that last a lifetime.');
            $table->string('background_image_url')->nullable();
            $table->string('cta_text')->default('Explore Gallery');
            $table->timestamps();
        });

        // Insert default row
        DB::table('hero_contents')->insert([
            'headline'    => 'Josef Nhidi Photography',
            'subheadline' => 'Capturing moments that last a lifetime.',
            'cta_text'    => 'Explore Gallery',
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_contents');
    }
};
