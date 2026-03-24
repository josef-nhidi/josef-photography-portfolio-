<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Album;
use Illuminate\Http\Request;

class AlbumController extends Controller
{
    public function index()
    {
        return Album::with(['photos' => function($query) {
            $query->orderBy('views_count', 'desc');
        }])->latest()->get();
    }

    public function show($id)
    {
        return Album::with(['photos' => function($query) {
            $query->orderBy('views_count', 'desc');
        }])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $album = Album::create($request->all());

        return response()->json($album, 201);
    }

    public function update(Request $request, Album $album)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:portrait,event',
        ]);

        $album->update($request->only(['name', 'type']));
        return response()->json($album->load('photos'));
    }

    public function destroy(Album $album)
    {
        $album->delete();

        return response()->json(null, 204);
    }
}
