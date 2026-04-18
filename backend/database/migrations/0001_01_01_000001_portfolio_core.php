<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('albums', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // portrait, event
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('photos', function (Blueprint $table) {
            $table->id();
            $table->string('url');
            $table->string('thumbnail_url')->nullable();
            $table->string('title')->nullable();
            $table->string('category')->default('portrait'); // portrait, event
            $table->unsignedBigInteger('album_id')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->unsignedBigInteger('views_count')->default(0);
            $table->text('blur_preview')->nullable(); // High-speed loading placeholder
            $table->timestamps();

            $table->foreign('album_id')->references('id')->on('albums')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photos');
        Schema::dropIfExists('albums');
    }
};
