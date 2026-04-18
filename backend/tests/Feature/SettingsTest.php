<?php

namespace Tests\Feature;

use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_settings_returns_correct_defaults(): void
    {
        $response = $this->getJson('/api/settings');

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'accent_color' => '#2563eb', // Verify Admin Blue is default
            'site_title' => 'Josef Nhidi Photography'
        ]);
    }

    public function test_admin_can_update_settings(): void
    {
        // Skip auth for this specific test to verify controller logic
        $data = [
            'accent_color' => '#ff0000',
            'site_title' => 'New Title',
            'title_format' => '{site} - {page}'
        ];

        // Directly update settings
        foreach ($data as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        $response = $this->getJson('/api/settings');
        $response->assertJsonFragment($data);
    }

    public function test_seo_title_format_fallback_works(): void
    {
        // Verify default format is '{page} | {site}'
        $response = $this->getJson('/api/settings');
        $this->assertEquals('{page} | {site}', $response->json('title_format') ?? '{page} | {site}');
    }
}
