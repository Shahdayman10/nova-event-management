<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class CustomerController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'customers' => User::where('role', 'customer')
                ->withCount(['quoteRequests', 'reviews'])
                ->latest()
                ->get(['id', 'name', 'email', 'created_at']),
        ]);
    }
}