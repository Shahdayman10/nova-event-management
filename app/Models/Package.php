<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Package extends Model
{
    protected $fillable = [
        'service_id',
        'name',
        'slug',
        'description',
        'price',
        'features',
        'image',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function quoteRequests(): HasMany
{
    return $this->hasMany(QuoteRequest::class);
}

        public function favoritedBy(): BelongsToMany
        {
            return $this->belongsToMany(User::class, 'user_favorite_packages')->withTimestamps();
        }
}