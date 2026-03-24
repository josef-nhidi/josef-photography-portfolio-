<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    use HasFactory;

    protected $fillable = [
        'url',
        'thumbnail_url',
        'title',
        'category',
        'album_id',
        'width',
        'height',
        'views_count',
    ];

    /**
     * Ensure the URL is always absolute using the current APP_URL.
     */
    protected function getUrlAttribute($value)
    {
        if (str_starts_with($value, 'http')) {
            return $value;
        }
        return asset('storage/' . $value);
    }

    protected function getThumbnailUrlAttribute($value)
    {
        if (!$value) return null;
        if (str_starts_with($value, 'http')) {
            return $value;
        }
        return asset('storage/' . $value);
    }

    public function album()
    {
        return $this->belongsTo(Album::class);
    }
}
