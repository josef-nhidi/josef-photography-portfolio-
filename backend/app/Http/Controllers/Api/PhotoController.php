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

        // Native GD WebP Conversion
        $imageString = file_get_contents($request->file('image')->getRealPath());
        $image = @\imagecreatefromstring($imageString);
        
        $webpData = null;
        if ($image) {
            ob_start();
            \imagewebp($image, null, 80);
            $webpData = ob_get_clean();
            \imagedestroy($image);
        } else {
            $webpData = $imageString;
        }

        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        if ($cloudName && $apiKey && $apiSecret) {
            // --- UPLOAD TO CLOUDINARY (For Render/Stateless Hosts) ---
            $timestamp = time();
            $signature = sha1("timestamp={$timestamp}{$apiSecret}");
            
            $url = "https://api.cloudinary.com/v1_1/{$cloudName}/image/upload";
            $data = [
                'file' => 'data:image/webp;base64,' . base64_encode($webpData),
                'api_key' => $apiKey,
                'timestamp' => $timestamp,
                'signature' => $signature,
                'folder' => 'josef-photography'
            ];

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = json_decode(curl_exec($ch), true);
            curl_close($ch);

            $path = $response['secure_url'] ?? null;
            if (!$path) throw new \Exception('Cloudinary upload failed');
            
            $photo = Photo::create([
                'url' => $path,
                'category' => $request->category,
                'album_id' => $request->album_id,
                'title' => $request->title,
            ]);
        } else {
            // --- UPLOAD TO LOCAL STORAGE (Default) ---
            $filename = 'photos/' . uniqid() . '.webp';
            Storage::disk('public')->put($filename, $webpData);
            
            $photo = Photo::create([
                'url' => $filename, // Model accessor handles the full URL
                'category' => $request->category,
                'album_id' => $request->album_id,
                'title' => $request->title,
            ]);
        }

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
