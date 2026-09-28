<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\QuoteRequest;
use App\Models\Service;
use Illuminate\Http\Request;

class QuoteRequestController extends Controller
{
    public function index(Request $request)
    {
        $quoteRequests = $request->user()
            ->quoteRequests()
            ->with(['service', 'package'])
            ->latest()
            ->get();

        return response()->json([
            'quote_requests' => $quoteRequests,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'package_id' => ['nullable', 'exists:packages,id'],
            'event_type' => ['required', 'string', 'max:255'],
            'event_date' => ['required', 'date', 'after_or_equal:today'],
            'event_location' => ['required', 'string', 'max:255'],
            'message' => ['nullable', 'string'],
        ]);

        $service = Service::where('id', $validated['service_id'])
            ->where('is_active', true)
            ->firstOrFail();

        if (!empty($validated['package_id'])) {
            Package::where('id', $validated['package_id'])
                ->where('service_id', $service->id)
                ->where('is_active', true)
                ->firstOrFail();
        }

        $quoteRequest = $request->user()->quoteRequests()->create([
            ...$validated,
            'status' => 'pending',
        ]);

        $quoteRequest->load(['service', 'package']);

        return response()->json([
            'message' => 'Quote request submitted successfully.',
            'quote_request' => $quoteRequest,
        ], 201);
    }
}