<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PhotoController extends Controller
{
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
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'category' => 'required|string',
            'album_id' => 'nullable|exists:albums,id',
            'title' => 'nullable|string',
        ]);

        // Native GD WebP Conversion & Scalable Watermarking
        $imageString = file_get_contents($request->file('image')->getRealPath());
        $image = @\imagecreatefromstring($imageString);
        
        if ($image) {
            $width = \imagesx($image);
            $height = \imagesy($image);

            // No watermark, just convert to WebP
            ob_start();
            \imagewebp($image, null, 80);
            $webpData = ob_get_clean();
            \imagedestroy($image);

            $filename = 'photos/' . uniqid() . '.webp';
            Storage::disk('public')->put($filename, $webpData);
            $path = $filename;
        } else {
            // Fallback for non-GD compatible images
            $path = $request->file('image')->store('photos', 'public');
        }
        $photo = Photo::create([
            'url' => Storage::url($path),
            'category' => $request->category,
            'album_id' => $request->album_id,
            'title' => $request->title,
        ]);

        return response()->json($photo, 201);
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
        $path = str_replace('/storage/', '', $photo->url);
        Storage::disk('public')->delete($path);
        $photo->delete();

        return response()->json(null, 204);
    }
}
