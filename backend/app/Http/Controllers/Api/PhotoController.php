<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Photo;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * PhotoController
 * Orchestrates photo delivery and management for the portfolio.
 * Now refactored into a lean controller utilizing specialized services.
 */
class PhotoController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index()
    {
        return Photo::with('album')->latest()->get()->shuffle();
    }

    public function byCategory($category)
    {
        return Photo::where('category', $category)->with('album')->latest()->get();
    }

    public function store(Request $request)
    {
        // Increase limits for large image processing (50MB support)
        ini_set('memory_limit', '512M');
        set_time_limit(300);

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:51200',
            'category' => 'required|string',
            'album_id' => 'nullable|exists:albums,id',
            'title' => 'nullable|string',
        ]);

        try {
            // Process and upload using the specialized ImageService
            $path = $this->imageService->upload($request->file('image'));

            if (!$path) {
                throw new \Exception('Failed to process and upload image.');
            }

            $photo = Photo::create([
                'url' => $path,
                'category' => $request->category,
                'album_id' => $request->album_id,
                'title' => $request->title,
            ]);

            return response()->json($photo, 201);
        } catch (\Throwable $e) {
            Log::error('Upload Exception: ' . $e->getMessage());
            return response()->json([
                'error' => 'Upload failed',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString() // Adding trace might be useful for debugging directly 
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'category' => 'required|in:portrait,event',
            'album_id' => 'nullable|exists:albums,id',
        ]);

        $photo = Photo::findOrFail($id);
        $photo->update($request->only(['title', 'category', 'album_id']));

        return response()->json($photo);
    }

    public function incrementView($id)
    {
        $photo = Photo::findOrFail($id);
        $photo->increment('views_count');
        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $photo = Photo::findOrFail($id);
        
        // Clean up physical file if it's local
        if (!str_contains($photo->url, 'http')) {
            $path = str_replace('/storage/', '', $photo->url);
            Storage::disk('public')->delete($path);
        }
        
        $photo->delete();

        return response()->json(null, 204);
    }
}
