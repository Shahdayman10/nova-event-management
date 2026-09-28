<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'services' => $request->user()->favoriteServices()->latest('user_favorite_services.created_at')->get(),
            'packages' => $request->user()->favoritePackages()->with('service')->latest('user_favorite_packages.created_at')->get(),
        ]);
    }

    public function store(Request $request, string $type, int $id): JsonResponse
    {
        [$relation, $model] = $this->resolveFavorite($request, $type, $id);
        $relation->syncWithoutDetaching([$model->id]);

        return response()->json(['message' => 'Favorite saved.']);
    }

    public function destroy(Request $request, string $type, int $id): JsonResponse
    {
        [$relation, $model] = $this->resolveFavorite($request, $type, $id);
        $relation->detach($model->id);

        return response()->json(['message' => 'Favorite removed.']);
    }

    private function resolveFavorite(Request $request, string $type, int $id): array
    {
        return match ($type) {
            'services' => [$request->user()->favoriteServices(), Service::findOrFail($id)],
            'packages' => [$request->user()->favoritePackages(), Package::findOrFail($id)],
            default => abort(404),
        };
    }
}