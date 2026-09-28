<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\QuoteRequest;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerFeaturesApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_favorites_are_private_and_admin_cannot_use_customer_routes(): void
    {
        $service = $this->createService();
        $package = Package::create([
            'service_id' => $service->id,
            'name' => 'Birthday Set',
            'slug' => 'birthday-set',
            'price' => null,
            'is_active' => true,
        ]);
        $customer = User::factory()->create();
        $otherCustomer = User::factory()->create();
        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();
        $this->assertSame('customer', $customer->fresh()->role);
        $customer->refresh();
        $otherCustomer->refresh();

        $favoriteResponse = $this->actingAs($customer)
            ->postJson("/api/favorites/services/{$service->id}");
        $favoriteResponse->assertOk();
        $this->postJson("/api/favorites/packages/{$package->id}")->assertOk();

        $this->getJson('/api/favorites')
            ->assertOk()
            ->assertJsonPath('services.0.id', $service->id)
            ->assertJsonPath('packages.0.id', $package->id);
        $this->deleteJson("/api/favorites/services/{$service->id}")->assertOk();

        $this->actingAs($otherCustomer)
            ->getJson('/api/favorites')
            ->assertOk()
            ->assertJsonCount(0, 'services')
            ->assertJsonCount(0, 'packages');

        $this->actingAs($admin)
            ->getJson('/api/favorites')
            ->assertForbidden();
    }

    public function test_customer_can_review_only_their_completed_quote_and_role_cannot_be_changed(): void
    {
        $service = $this->createService();
        $customer = User::factory()->create();
        $otherCustomer = User::factory()->create();
        $customer->refresh();
        $completedQuote = $this->createQuote($customer, $service, 'completed');
        $otherQuote = $this->createQuote($otherCustomer, $service, 'completed');

        $this->actingAs($customer)
            ->getJson('/api/reviews/eligible')
            ->assertOk()
            ->assertJsonCount(1, 'quote_requests')
            ->assertJsonPath('quote_requests.0.id', $completedQuote->id);

        $this->postJson('/api/reviews', [
            'quote_request_id' => $otherQuote->id,
            'rating' => 5,
            'comment' => 'Not my event.',
        ])->assertNotFound();

        $this->postJson('/api/reviews', [
            'quote_request_id' => $completedQuote->id,
            'rating' => 5,
            'comment' => 'The event was beautifully coordinated.',
        ])->assertCreated()->assertJsonPath('review.is_visible', false);

        $this->putJson('/api/profile', [
            'name' => 'Updated Customer',
            'email' => 'updated-customer@example.test',
            'role' => 'admin',
        ])->assertOk()
            ->assertJsonPath('user.role', 'customer')
            ->assertJsonPath('user.email', 'updated-customer@example.test');

        $this->putJson('/api/profile', [
            'current_password' => 'password',
            'password' => 'updated-password',
            'password_confirmation' => 'updated-password',
            'role' => 'admin',
        ])->assertOk()->assertJsonPath('user.role', 'customer');
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('updated-password', $customer->fresh()->password));

        $this->getJson('/api/reviews')
            ->assertOk()
            ->assertJsonCount(0, 'reviews');
    }

    public function test_admin_can_approve_reviews_and_status_changes_notify_the_customer(): void
    {
        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();
        $customer = User::factory()->create();
        $customer->refresh();
        $service = $this->createService();
        $quote = $this->createQuote($customer, $service, 'pending');
        $completedQuote = $this->createQuote($customer, $service, 'completed');
        $review = Review::create([
            'user_id' => $customer->id,
            'service_id' => $service->id,
            'quote_request_id' => $completedQuote->id,
            'rating' => 5,
            'comment' => 'Wonderful.',
        ]);

        $this->actingAs($admin)
            ->patchJson("/api/admin/quote-requests/{$quote->id}/status", ['status' => 'confirmed'])
            ->assertOk();

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $customer->id,
            'type' => \App\Notifications\QuoteStatusChangedNotification::class,
        ]);

        $notifications = $this->actingAs($customer)
            ->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonPath('unread_count', 1);
        $notificationId = $notifications->json('notifications.0.id');
        $this->patchJson("/api/notifications/{$notificationId}/read")
            ->assertOk();
        $this->getJson('/api/notifications')->assertJsonPath('unread_count', 0);

        $this->actingAs($admin)
            ->getJson('/api/admin/customers')
            ->assertOk()
            ->assertJsonCount(1, 'customers');

        $this->actingAs($admin)
            ->patchJson("/api/admin/reviews/{$review->id}/visibility")
            ->assertOk()
            ->assertJsonPath('review.is_visible', true);

        $this->getJson('/api/reviews')
            ->assertOk()
            ->assertJsonCount(1, 'reviews')
            ->assertJsonPath('reviews.0.user.name', $customer->name);

        $this->actingAs($admin)
            ->deleteJson("/api/admin/reviews/{$review->id}")
            ->assertOk();
        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
    }

    private function createService(): Service
    {
        return Service::create([
            'name' => 'Celebration Planning',
            'slug' => 'celebration-planning',
            'is_active' => true,
        ]);
    }

    private function createQuote(User $user, Service $service, string $status): QuoteRequest
    {
        return QuoteRequest::create([
            'user_id' => $user->id,
            'service_id' => $service->id,
            'event_type' => 'Birthday',
            'event_date' => '2027-07-12',
            'event_location' => 'Customer-provided location',
            'message' => null,
            'status' => $status,
        ]);
    }
}