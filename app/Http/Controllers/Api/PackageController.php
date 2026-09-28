<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;

class PackageController extends Controller
{
    public function index()
    {
        $packages = Package::with('service')
            ->where('is_active', true)
            ->whereHas('service', fn ($query) => $query->where('is_active', true))
            ->get();

        return response()->json([
            'packages' => $packages,
        ]);
    }
}
