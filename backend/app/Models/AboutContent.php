<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AboutContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'bio',
        'email',
        'phone',
        'address',
        'social_links',
        'profile_image_url'
    ];

    protected $casts = [
        'social_links' => 'array',
    ];

    /**
     * Ensure the profile image URL is always absolute.
     */
    protected function getProfileImageUrlAttribute($value)
    {
        if (!$value) return null;
        if (str_starts_with($value, 'http')) {
            return $value;
        }
        return asset('storage/' . $value);
    }
}
