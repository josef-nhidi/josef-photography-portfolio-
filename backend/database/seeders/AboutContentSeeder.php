<?php

namespace Database\Seeders;

use App\Models\AboutContent;
use Illuminate\Database\Seeder;

class AboutContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AboutContent::create([
            'bio' => "Josef Nhidi est un photographe passionné spécialisé dans les portraits et les événements. Avec un œil attentif aux détails et à l'âme de ses sujets, il capture l'éphémère pour le rendre éternel. Basé en France, il travaille avec des clients internationaux pour immortaliser leurs moments les plus précieux.",
            'email' => 'contact@josefnhidi.com',
            'social_links' => [
                ['platform' => 'Instagram', 'url' => 'https://instagram.com/josefnhidi'],
                ['platform' => 'Facebook', 'url' => 'https://facebook.com/josefnhidi'],
            ],
        ]);
    }
}
