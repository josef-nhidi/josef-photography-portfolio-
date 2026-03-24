<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->username)
                    ->orWhere('name', $request->username)
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json(['token' => $token]);
    }

    public function updateCredentials(Request $request)
    {
        $request->validate([
            'email' => 'required|string|max:255',
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        $user = $request->user();
        
        $user->email = $request->email;
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        
        $user->save();

        return response()->json(['message' => 'Credentials updated successfully']);
    }
}
