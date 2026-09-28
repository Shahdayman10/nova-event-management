<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Birthdays',
                'slug' => 'birthdays',
                'description' => 'Beautifully styled birthday celebrations designed around your special moment — from intimate dinners to milestone parties.',
                'image' => 'https://images.unsplash.com/photo-1755704282977-340323fa52df?w=700&h=480&fit=crop&auto=format',
            ],
            [
                'name' => 'Graduation',
                'slug' => 'graduation',
                'description' => 'Celebrate your achievement with thoughtful details, elegant setups, and curated floral arrangements worthy of the moment.',
                'image' => 'https://images.unsplash.com/photo-1623945352596-36d5d9f21f70?w=700&h=480&fit=crop&auto=format',
            ],
            [
                'name' => 'Engagement',
                'slug' => 'engagement',
                'description' => 'Create a romantic and memorable engagement experience with personalized styling, curated florals, and every intimate detail considered.',
                'image' => 'https://images.unsplash.com/photo-1761963503451-e064fea6a2b5?w=700&h=480&fit=crop&auto=format',
            ],
            [
                'name' => 'Decorations',
                'slug' => 'decorations',
                'description' => 'Elegant decorations and beautifully styled tables designed to transform any space into something warm, refined, and memorable.',
                'image' => 'https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?w=700&h=480&fit=crop&auto=format',
            ],
            [
                'name' => 'Bouquets & Gifts',
                'slug' => 'bouquets-gifts',
                'description' => 'Thoughtfully arranged bouquets and curated gift sets for every meaningful occasion — chosen with purpose, wrapped with love.',
                'image' => 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=700&h=480&fit=crop&auto=format',
            ],
            [
                'name' => 'Giveaways',
                'slug' => 'giveaways',
                'description' => 'Personalized giveaways and small details that make your celebration unforgettable — styled, packaged, and meaningful.',
                'image' => 'https://images.unsplash.com/photo-1652346107876-58d7354ce9b8?w=700&h=480&fit=crop&auto=format',
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['slug' => $service['slug']],
                [...$service, 'is_active' => true],
            );
        }
    }
}