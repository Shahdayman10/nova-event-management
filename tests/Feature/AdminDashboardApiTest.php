<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\QuoteRequest;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_manage_services_and_packages(): void
    {
        $this->actingAs($this->createAdmin());

        $serviceResponse = $this->postJson('/api/admin/services', [
            'name' => 'Wedding Planning',
            'slug' => 'wedding-planning',
            'description' => 'Planning for wedding celebrations.',
        ]);

        $serviceResponse->assertCreated()
            ->assertJsonPath('data.name', 'Wedding Planning');

        $serviceId = $serviceResponse->json('data.id');

        $this->putJson("/api/admin/services/{$serviceId}", [
            'name' => 'Wedding Coordination',
            'slug' => 'wedding-coordination',
            'description' => 'Full event coordination.',
            'image' => 'https://example.test/wedding.jpg',
        ])->assertOk()->assertJsonPath('data.name', 'Wedding Coordination');

        $packageResponse = $this->postJson('/api/admin/packages', [
            'service_id' => $serviceId,
            'name' => 'Essential',
            'slug' => 'essential',
            'description' => 'Essential planning support.',
            'price' => null,
            'features' => ['Venue coordination', 'Day-of support'],
            'image' => 'https://example.test/essential.jpg',
        ]);

        $packageResponse->assertCreated()
            ->assertJsonPath('data.service.name', 'Wedding Coordination')
            ->assertJsonPath('data.price', null)
            ->assertJsonPath('data.features.0', 'Venue coordination');

        $packageId = $packageResponse->json('data.id');

        $this->putJson("/api/admin/packages/{$packageId}", [
            'service_id' => $serviceId,
            'name' => 'Signature',
            'slug' => 'signature',
            'description' => 'Expanded event planning.',
            'price' => null,
            'features' => ['Concept design', 'Vendor coordination'],
            'image' => 'https://example.test/signature.jpg',
        ])->assertOk()
            ->assertJsonPath('data.name', 'Signature')
            ->assertJsonPath('data.price', null)
            ->assertJsonPath('data.features.1', 'Vendor coordination');

        $this->patchJson("/api/admin/packages/{$packageId}/status")
            ->assertOk()->assertJsonPath('data.is_active', false);

        $this->patchJson("/api/admin/services/{$serviceId}/status")
            ->assertOk()->assertJsonPath('data.is_active', false);

        $this->getJson('/api/admin/services')
            ->assertOk()
            ->assertJsonPath('data.0.packages_count', 1);

        $this->getJson('/api/admin/packages')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Signature');
    }

    public function test_admin_can_view_quote_details_and_advance_status(): void
    {
        $admin = $this->createAdmin();
        $customer = User::factory()->create();
        $service = Service::create([
            'name' => 'Corporate Events',
            'slug' => 'corporate-events',
            'is_active' => true,
        ]);
        $package = Package::create([
            'service_id' => $service->id,
            'name' => 'Full Service',
            'slug' => 'full-service',
            'price' => null,
            'features' => ['Planning', 'On-site coordination'],
            'is_active' => true,
        ]);
        $quote = QuoteRequest::create([
            'user_id' => $customer->id,
            'service_id' => $service->id,
            'package_id' => $package->id,
            'event_type' => 'Annual conference',
            'event_date' => '2027-06-12',
            'event_location' => 'Vancouver',
            'message' => 'Please contact me about availability.',
            'status' => 'pending',
        ]);

        $this->actingAs($admin)
            ->getJson('/api/admin/quote-requests')
            ->assertOk()
            ->assertJsonPath('data.0.user.name', $customer->name)
            ->assertJsonPath('data.0.service.name', 'Corporate Events')
            ->assertJsonPath('data.0.package.name', 'Full Service')
            ->assertJsonPath('data.0.event_type', 'Annual conference')
            ->assertJsonPath('data.0.event_location', 'Vancouver')
            ->assertJsonPath('data.0.message', 'Please contact me about availability.')
            ->assertJsonPath('data.0.status', 'pending');

        $this->patchJson("/api/admin/quote-requests/{$quote->id}/status", ['status' => 'completed'])
            ->assertUnprocessable();

        $this->patchJson("/api/admin/quote-requests/{$quote->id}/status", ['status' => 'confirmed'])
            ->assertOk()->assertJsonPath('data.status', 'confirmed');

        $this->patchJson("/api/admin/quote-requests/{$quote->id}/status", ['status' => 'pending'])
            ->assertUnprocessable();

        $this->patchJson("/api/admin/quote-requests/{$quote->id}/status", ['status' => 'completed'])
            ->assertOk()->assertJsonPath('data.status', 'completed');
    }

    public function test_customers_and_guests_cannot_access_admin_apis(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer)
            ->getJson('/api/admin/services')
            ->assertForbidden();
    }

    public function test_guests_cannot_access_admin_apis(): void
    {
        $this->getJson('/api/admin/quote-requests')->assertUnauthorized();
    }

    private function createAdmin(): User
    {
        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();

        return $admin;
    }
}