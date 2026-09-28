<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\QuoteRequest;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerAccountWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_browse_and_register_login_logout_as_a_customer(): void
    {
        $service = $this->createService();
        $inactiveService = Service::create([
            'name' => 'Inactive Service',
            'slug' => 'inactive-service',
            'is_active' => false,
        ]);
        $visiblePackage = Package::create([
            'service_id' => $service->id,
            'name' => 'Visible Package',
            'slug' => 'visible-package',
            'is_active' => true,
        ]);
        Package::create([
            'service_id' => $inactiveService->id,
            'name' => 'Orphaned Public Package',
            'slug' => 'orphaned-public-package',
            'is_active' => true,
        ]);
        Package::create([
            'service_id' => $service->id,
            'name' => 'Inactive Package',
            'slug' => 'inactive-package',
            'is_active' => false,
        ]);

        $this->getJson('/api/services')->assertOk()->assertJsonPath('services.0.id', $service->id);
        $this->getJson('/api/packages')
            ->assertOk()
            ->assertJsonCount(1, 'packages')
            ->assertJsonPath('packages.0.id', $visiblePackage->id);

        $registration = $this->postJson('/api/register', [
            'name' => 'NOVA Customer',
            'email' => 'customer@example.test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $registration->assertCreated()->assertJsonPath('user.role', 'customer');
        $token = $registration->json('token');

        $this->postJson('/api/login', [
            'email' => 'customer@example.test',
            'password' => 'password123',
        ])->assertOk()->assertJsonPath('user.role', 'customer');

        $this->withToken($token)->postJson('/api/logout')->assertOk();
    }

    public function test_customer_sees_only_owned_quote_requests_and_cannot_change_status(): void
    {
        $service = $this->createService();
        $customer = User::factory()->create();
        $otherCustomer = User::factory()->create();
        $customer->refresh();
        $otherCustomer->refresh();

        $owned = $this->createQuote($customer, $service);
        $this->createQuote($otherCustomer, $service);

        $submitted = $this->actingAs($customer)->postJson('/api/quote-requests', [
            'service_id' => $service->id,
            'event_type' => 'Graduation',
            'event_date' => '2027-09-10',
            'event_location' => 'Customer-provided venue',
            'message' => 'Please help plan this event.',
        ]);
        $submitted->assertCreated()->assertJsonPath('quote_request.status', 'pending');

        $this->actingAs($customer)
            ->getJson('/api/quote-requests')
            ->assertOk()
            ->assertJsonCount(2, 'quote_requests')
            ->assertJsonFragment(['id' => $owned->id])
            ->assertJsonFragment(['id' => $submitted->json('quote_request.id')]);

        $this->actingAs($customer)
            ->patchJson("/api/admin/quote-requests/{$owned->id}/status", ['status' => 'confirmed'])
            ->assertForbidden();

        $this->patchJson("/api/quote-requests/{$owned->id}/status", ['status' => 'confirmed'])
            ->assertNotFound();
    }

    private function createService(): Service
    {
        return Service::create([
            'name' => 'Birthday Planning',
            'slug' => 'birthday-planning',
            'is_active' => true,
        ]);
    }

    private function createQuote(User $user, Service $service): QuoteRequest
    {
        return QuoteRequest::create([
            'user_id' => $user->id,
            'service_id' => $service->id,
            'event_type' => 'Birthday',
            'event_date' => '2027-08-18',
            'event_location' => 'Customer-provided venue',
            'message' => 'Please discuss this event.',
            'status' => 'pending',
        ]);
    }
}
