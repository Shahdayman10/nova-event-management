<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuoteRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Notifications\QuoteStatusChangedNotification;

class QuoteRequestController extends Controller
{
    public function index(): JsonResponse
    {
        $quoteRequests = QuoteRequest::with([
            'user',
            'service',
            'package',
        ])->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $quoteRequests,
        ]);
    }

    public function updateStatus(Request $request, QuoteRequest $quoteRequest): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,confirmed,completed'],
        ]);

        $statusOrder = ['pending' => 0, 'confirmed' => 1, 'completed' => 2];
        if ($statusOrder[$validated['status']] !== $statusOrder[$quoteRequest->status] + 1) {
            return response()->json([
                'message' => 'Quote requests can only move from pending to confirmed to completed.',
            ], 422);
        }

        $quoteRequest->update([
            'status' => $validated['status'],
        ]);
        $quoteRequest->user->notify(new QuoteStatusChangedNotification($quoteRequest));

        return response()->json([
            'success' => true,
            'message' => 'Quote request status updated successfully.',
            'data' => $quoteRequest->fresh(['user', 'service', 'package']),
        ]);
    }
}