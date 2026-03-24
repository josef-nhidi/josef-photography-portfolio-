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
        if ($request->has('social_links') && is_string($request->social_links)) {
            $request->merge([
                'social_links' => json_decode($request->social_links, true)
            ]);
        }

        $request->validate([
            'bio' => 'required|string',
            'email' => 'nullable|string',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'social_links' => 'nullable|array',
            'image' => 'nullable|image|max:2048',
        ]);

        $about = AboutContent::first() ?? new AboutContent();
        $about->bio = $request->bio;
        $about->email = $request->email;
        $about->phone = $request->phone;
        $about->address = $request->address;
        $about->social_links = $request->social_links;

        if ($request->hasFile('image')) {
            if ($about->profile_image_url) {
                $oldPath = str_replace('/storage/', '', $about->profile_image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('about', 'public');
            $about->profile_image_url = Storage::url($path);
        }

        $about->save();

        return response()->json($about);
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
