<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\Service;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'service' => 'birthdays',
                'packages' => [
                    [
                        'name' => 'Essential',
                        'slug' => 'essential',
                        'description' => 'Simple, thoughtful details for a beautiful birthday.',
                        'price' => null,
                        'features' => [
                            'Up to 20 guests',
                            'Balloon styling',
                            'Welcome signage',
                            '1 floral centrepiece',
                            '3-hr coordination',
                        ],
                    ],
                    [
                        'name' => 'Signature',
                        'slug' => 'signature',
                        'description' => 'Elevated styling and personalized details for a memorable birthday.',
                        'price' => null,
                        'features' => [
                            'Up to 50 guests',
                            'Full backdrop design',
                            'Balloon installation',
                            '2 floral centrepieces',
                            'Dessert table styling',
                            '6-hr coordination',
                        ],
                    ],
                    [
                        'name' => 'Luxe',
                        'slug' => 'luxe',
                        'description' => 'A complete premium birthday experience designed around your vision.',
                        'price' => null,
                        'features' => [
                            'Up to 100 guests',
                            'Full venue transformation',
                            'Custom balloon arches',
                            'Floral installations',
                            'Gift & giveaway sets',
                            'Dessert table',
                            'Full-day coordination',
                        ],
                    ],
                ],
            ],

            [
                'service' => 'graduation',
                'packages' => [
                    [
                        'name' => 'Essential',
                        'slug' => 'essential',
                        'description' => 'Simple, thoughtful details for a beautiful graduation celebration.',
                        'price' => null,
                        'features' => [
                            'Up to 20 guests',
                            'Themed banner & signage',
                            '1 floral arrangement',
                            'Graduation bouquet',
                            '2-hr coordination',
                        ],
                    ],
                    [
                        'name' => 'Signature',
                        'slug' => 'signature',
                        'description' => 'Elevated styling and personalized details for a memorable graduation.',
                        'price' => null,
                        'features' => [
                            'Up to 40 guests',
                            'Full table décor',
                            'Premium backdrop',
                            '3 bouquets',
                            'Gift wrapping set',
                            '5-hr coordination',
                        ],
                    ],
                    [
                        'name' => 'Luxe',
                        'slug' => 'luxe',
                        'description' => 'A complete premium experience for your greatest achievement.',
                        'price' => null,
                        'features' => [
                            'Up to 80 guests',
                            'Full venue styling',
                            'Floral installations',
                            'Custom gift boxes',
                            'Dessert table',
                            '8-hr coordination',
                        ],
                    ],
                ],
            ],

            [
                'service' => 'engagement',
                'packages' => [
                    [
                        'name' => 'Essential',
                        'slug' => 'essential',
                        'description' => 'Simple, thoughtful details for a beautiful proposal.',
                        'price' => null,
                        'features' => [
                            'Up to 20 guests',
                            'Floral arrangement',
                            'Candle & petal pathway',
                            'Custom signage',
                            '3-hr coordination',
                        ],
                    ],
                    [
                        'name' => 'Signature',
                        'slug' => 'signature',
                        'description' => 'Elevated styling and personalized details for a memorable engagement.',
                        'price' => null,
                        'features' => [
                            'Up to 50 guests',
                            'Floral arch or backdrop',
                            'Premium candle setup',
                            'Personalized décor',
                            'Mood lighting',
                            '6-hr coordination',
                        ],
                    ],
                    [
                        'name' => 'Luxe',
                        'slug' => 'luxe',
                        'description' => 'A complete premium engagement experience designed around your vision.',
                        'price' => null,
                        'features' => [
                            'Up to 100 guests',
                            'Full scene design',
                            'Custom floral installation',
                            'Live musician (2 hrs)',
                            'Surprise reveal setup',
                            'Full-day coordination',
                        ],
                    ],
                ],
            ],

            [
                'service' => 'decorations',
                'packages' => [
                    [
                        'name' => 'Essential',
                        'slug' => 'essential',
                        'description' => 'Simple, thoughtful decoration for any intimate occasion.',
                        'price' => null,
                        'features' => [
                            '1 room styling',
                            'Balloon arrangement',
                            'Floral centrepiece',
                            'Welcome table',
                            '2-hr setup',
                        ],
                    ],
                    [
                        'name' => 'Signature',
                        'slug' => 'signature',
                        'description' => 'Elevated decoration and personalized styling for a memorable space.',
                        'price' => null,
                        'features' => [
                            '2-room styling',
                            'Full tablescape',
                            'Backdrop & balloon install',
                            'Mood lighting',
                            '4-hr setup & coordination',
                        ],
                    ],
                    [
                        'name' => 'Luxe',
                        'slug' => 'luxe',
                        'description' => 'A complete premium decoration experience designed around your vision.',
                        'price' => null,
                        'features' => [
                            'Full venue transformation',
                            'Custom balloon arches',
                            'Floral installations',
                            'Lighting design',
                            'Full-day setup',
                        ],
                    ],
                ],
            ],

            [
                'service' => 'bouquets-gifts',
                'packages' => [
                    [
                        'name' => 'Essential',
                        'slug' => 'essential',
                        'description' => 'Simple, thoughtful floral arrangements and gifts.',
                        'price' => null,
                        'features' => [
                            'Hand-tied bouquet',
                            'Seasonal blooms',
                            'Kraft or ribbon wrap',
                            'Personalised card',
                        ],
                    ],
                    [
                        'name' => 'Signature',
                        'slug' => 'signature',
                        'description' => 'Elevated bouquets and curated gift sets for meaningful moments.',
                        'price' => null,
                        'features' => [
                            'Premium bouquet',
                            'Curated gift box',
                            'Luxury wrap & ribbon',
                            'Personalised card',
                            'Delivery coordination',
                        ],
                    ],
                    [
                        'name' => 'Luxe',
                        'slug' => 'luxe',
                        'description' => 'A complete premium gifting experience designed around your vision.',
                        'price' => null,
                        'features' => [
                            'Bespoke floral arrangement',
                            '3-piece gift curation',
                            'Premium packaging',
                            'Custom message',
                            'Same-day delivery',
                        ],
                    ],
                ],
            ],

            [
                'service' => 'giveaways',
                'packages' => [
                    [
                        'name' => 'Essential',
                        'slug' => 'essential',
                        'description' => 'Simple, thoughtful giveaways for your celebration.',
                        'price' => null,
                        'features' => [
                            '10 giveaway sets',
                            'Branded tags',
                            'Simple packaging',
                            'Choice of theme',
                        ],
                    ],
                    [
                        'name' => 'Signature',
                        'slug' => 'signature',
                        'description' => 'Elevated giveaways and personalized packaging for a memorable occasion.',
                        'price' => null,
                        'features' => [
                            '20 giveaway sets',
                            'Curated items',
                            'Premium boxes & ribbon',
                            'Custom printed tags',
                            'Theme styling',
                        ],
                    ],
                    [
                        'name' => 'Luxe',
                        'slug' => 'luxe',
                        'description' => 'A complete premium giveaway experience designed around your vision.',
                        'price' => null,
                        'features' => [
                            '30+ giveaway sets',
                            'Fully bespoke curation',
                            'Luxury packaging',
                            'Custom branding',
                            'Styled display setup',
                        ],
                    ],
                ],
            ],
        ];

        foreach ($packages as $serviceData) {
            $service = Service::where('slug', $serviceData['service'])->firstOrFail();

            foreach ($serviceData['packages'] as $package) {
                Package::updateOrCreate(
                    [
                        'service_id' => $service->id,
                        'slug' => $package['slug'],
                    ],
                    [
                        'name' => $package['name'],
                        'description' => $package['description'],
                        'price' => $package['price'],
                        'features' => $package['features'],
                        'image' => null,
                        'is_active' => true,
                    ],
                );
            }
        }
    }
}