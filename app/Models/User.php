<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function quoteRequests(): HasMany
{
    return $this->hasMany(QuoteRequest::class);
}

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favoriteServices(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'user_favorite_services')->withTimestamps();
    }

    public function favoritePackages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class, 'user_favorite_packages')->withTimestamps();
    }
}
