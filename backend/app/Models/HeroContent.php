<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HeroContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'headline',
        'subheadline',
        'background_image_url',
        'cta_text',
    ];
}
