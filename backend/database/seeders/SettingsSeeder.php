<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'primary_color' => '#050505',
            'accent_color' => '#2563eb',
            'bg_color' => '#ffffff',
            'glass_bg' => 'rgba(255, 255, 255, 0.4)',
            'site_title' => 'Josef Nhidi Photography',
            'site_tagline' => 'Professional Visual Artist',
            'portraits_label' => 'Portraits',
            'events_label' => 'Events',
            'about_label' => 'About',
            'gallery_bg_text' => 'GALLERY',
            'footer_copy' => '© 2026 Josef Nhidi Photography. All Rights Reserved.',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
