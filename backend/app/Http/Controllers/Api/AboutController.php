<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutContent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AboutController extends Controller
{
    public function show()
    {
        return AboutContent::first() ?? response()->json(['bio' => ''], 200);
    }

    public function update(Request $request)
    {
        ini_set('memory_limit', '256M');
        set_time_limit(120);

        if ($request->has('social_links') && is_string($request->social_links)) {
            $request->merge([
                'social_links' => json_decode($request->social_links, true)
            ]);
        }

        try {
            $request->validate([
                'bio' => 'required|string',
                'email' => 'nullable|string',
                'phone' => 'nullable|string|max:255',
                'address' => 'nullable|string',
                'social_links' => 'nullable|array',
                'image' => 'nullable|image|max:5120',
            ]);

            $about = AboutContent::first() ?? new AboutContent();
            $about->bio = $request->bio;
            $about->email = $request->email;
            $about->phone = $request->phone;
            $about->address = $request->address;
            $about->social_links = $request->social_links;

            if ($request->hasFile('image')) {
                $cloudName = env('CLOUDINARY_CLOUD_NAME');
                $apiKey = env('CLOUDINARY_API_KEY');
                $apiSecret = env('CLOUDINARY_API_SECRET');

                if ($cloudName && $apiKey && $apiSecret) {
                    // --- UPLOAD TO CLOUDINARY ---
                    $params = [
                        'folder' => 'josef-about',
                        'timestamp' => time(),
                    ];
                    ksort($params);
                    $signString = "";
                    foreach ($params as $key => $val) {
                        $signString .= "$key=$val&";
                    }
                    $signString = rtrim($signString, '&');
                    $signature = sha1($signString . $apiSecret);
                    
                    $url = "https://api.cloudinary.com/v1_1/{$cloudName}/image/upload";
                    
                    $ch = curl_init($url);
                    curl_setopt($ch, CURLOPT_POST, 1);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, array_merge($params, [
                        'file' => new \CURLFile($request->file('image')->getRealPath()),
                        'api_key' => $apiKey,
                        'signature' => $signature,
                    ]));
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
                    $exec = curl_exec($ch);
                    $error = curl_error($ch);
                    curl_close($ch);

                    if ($error) throw new \Exception('CURL Error: ' . $error);

                    $response = json_decode($exec, true);
                    if (isset($response['secure_url'])) {
                        $about->profile_image_url = $response['secure_url'];
                    } else {
                        Log::error('Cloudinary About Image Upload Failed', ['response' => $response]);
                        throw new \Exception('Cloudinary upload failed');
                    }
                } else {
                    // --- LOCAL STORAGE ---
                    if ($about->profile_image_url && !str_starts_with($about->profile_image_url, 'http')) {
                        Storage::disk('public')->delete($about->profile_image_url);
                    }
                    $path = $request->file('image')->store('about', 'public');
                    $about->profile_image_url = $path;
                }
            }

            $about->save();
            return response()->json($about);

        } catch (\Exception $e) {
            Log::error('About Update Error: ' . $e->getMessage());
            return response()->json(['error' => 'Update failed', 'message' => $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json(['token' => $token]);
    }
}
