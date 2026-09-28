<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PackageController extends Controller
{
    public function index(): JsonResponse
    {
        $packages = Package::with('service')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $packages,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('packages', 'slug')
                    ->where(fn ($query) => $query->where('service_id', $request->service_id)),
            ],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'features' => ['nullable', 'array'],
            'image' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $package = Package::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Package created successfully.',
            'data' => $package->load('service'),
        ], 201);
    }

    public function update(Request $request, Package $package): JsonResponse
    {
        $validated = $request->validate([
            'service_id' => ['sometimes', 'required', 'exists:services,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('packages', 'slug')
                    ->where(fn ($query) => $query->where(
                        'service_id',
                        $request->service_id ?? $package->service_id
                    ))
                    ->ignore($package->id),
            ],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'features' => ['nullable', 'array'],
            'image' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $package->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Package updated successfully.',
            'data' => $package->fresh()->load('service'),
        ]);
    }

    public function toggleStatus(Package $package): JsonResponse
    {
        $package->update([
            'is_active' => !$package->is_active,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Package status updated successfully.',
            'data' => $package->fresh()->load('service'),
        ]);
    }
}