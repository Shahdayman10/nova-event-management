<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuoteRequest;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'reviews' => Review::with(['user:id,name', 'service:id,name'])
                ->where('is_visible', true)
                ->latest()
                ->get(),
        ]);
    }

    public function eligible(Request $request): JsonResponse
    {
        $quotes = $request->user()->quoteRequests()
            ->where('status', 'completed')
            ->whereDoesntHave('review')
            ->with('service:id,name')
            ->latest()
            ->get(['id', 'service_id', 'event_type', 'event_date', 'status']);

        return response()->json(['quote_requests' => $quotes]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'quote_request_id' => ['required', 'integer', 'exists:quote_requests,id'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['required', 'string', 'max:3000'],
        ]);

        $quoteRequest = QuoteRequest::where('user_id', $request->user()->id)
            ->where('status', 'completed')
            ->whereDoesntHave('review')
            ->findOrFail($validated['quote_request_id']);

        $review = Review::create([
            'user_id' => $request->user()->id,
            'service_id' => $quoteRequest->service_id,
            'quote_request_id' => $quoteRequest->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return response()->json([
            'message' => 'Review submitted for approval.',
            'review' => $review->load(['user:id,name', 'service:id,name']),
        ], 201);
    }
}