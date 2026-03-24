<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Photo;
use App\Models\Album;

class AnalyticsController extends Controller
{
    public function index()
    {
        $totalPhotos = Photo::count();
        $totalViews  = Photo::sum('views_count');
        $topPhotos   = Photo::with('album')->orderByDesc('views_count')->take(5)->get();
        $totalAlbums = Album::count();

        return response()->json([
            'total_photos' => $totalPhotos,
            'total_views'  => $totalViews,
            'top_photos'   => $topPhotos,
            'total_albums' => $totalAlbums,
        ]);
    }
}
