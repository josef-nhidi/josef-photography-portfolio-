<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\ImageService;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        $defaults = [
            // Branding & Labels
            'site_title' => 'Josef Nhidi Photography',
            'site_tagline' => 'Professional Portrait & Event Photographer',
            'logo_text' => 'JOSEF NHIDI',
            'site_logo' => '',
            'primary_color' => '#050505',
            'accent_color' => '#2563eb',
            'bg_color' => '#ffffff',
            'portraits_label' => 'PORTRAITS',
            'events_label' => 'EVENTS',
            'footer_copy' => '© ' . date('Y') . ' Josef Nhidi Photography. All Rights Reserved.',

            // Global System
            'gallery_bg_text' => 'GALLERY',
            'gallery_title' => 'Selected Work',
            'gallery_tagline' => 'PORTFOLIO',
            'allow_right_click' => 'false',
            'show_about_artist' => 'true',

            // SEO & Discoverability
            'seo_description' => 'Professional photography portfolio of Josef Nhidi (Youssef Nhidi), specializing in high-end portraits and event coverage.',
            'seo_keywords' => 'photography, portraits, events, josef nhidi, youssef nhidi',
            'seo_author' => 'Josef Nhidi',
            'og_image_url' => '',
            'google_verification_tag' => '',
            'site_url' => 'https://josefnhidi.me',
        ];

        try {
            $settings = Setting::all()->pluck('value', 'key')->toArray();
            return response()->json(array_merge($defaults, $settings));
        } catch (\Throwable $e) {
            // DB not ready yet (migrations still running) — return safe defaults
            return response()->json($defaults);
        }
    }

    public function update(Request $request)
    {
        try {
            $settings = $request->all();

            // Handle Branding Image Upload if present
            if ($request->hasFile('site_logo_file')) {
                $logoUrl = $this->imageService->upload($request->file('site_logo_file'), 'branding');
                if ($logoUrl) {
                    Setting::updateOrCreate(['key' => 'site_logo'], ['value' => $logoUrl]);
                    Setting::updateOrCreate(['key' => 'og_image_url'], ['value' => $logoUrl]);
                }
            }

            foreach ($settings as $key => $value) {
                if ($key === 'site_logo_file') continue;
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }

            return response()->json(['message' => 'Settings updated successfully']);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error saving settings: ' . $e->getMessage()], 500);
        }
    }
}
