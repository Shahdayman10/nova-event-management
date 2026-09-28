<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'reviews' => Review::with(['user:id,name,email', 'service:id,name', 'quoteRequest:id,event_type,status'])
                ->latest()
                ->get(),
        ]);
    }

    public function toggleVisibility(Review $review): JsonResponse
    {
        $review->update(['is_visible' => !$review->is_visible]);

        return response()->json(['review' => $review->fresh()]);
    }

    public function destroy(Review $review): JsonResponse
    {
        $review->delete();

        return response()->json(['message' => 'Review deleted.']);
    }
}