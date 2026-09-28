<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\QuoteRequestController;
use App\Http\Controllers\Api\Admin\QuoteRequestController as AdminQuoteRequestController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Admin\PackageController as AdminPackageController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Api\Admin\CustomerController as AdminCustomerController;



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/packages', [PackageController::class, 'index']);
Route::get('/reviews', [ReviewController::class, 'index']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware(['auth:sanctum', 'customer'])->group(function () {
    Route::get('/quote-requests', [QuoteRequestController::class, 'index']);
    Route::post('/quote-requests', [QuoteRequestController::class, 'store']);
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/{type}/{id}', [FavoriteController::class, 'store'])->whereIn('type', ['services', 'packages']);
    Route::delete('/favorites/{type}/{id}', [FavoriteController::class, 'destroy'])->whereIn('type', ['services', 'packages']);
    Route::get('/reviews/eligible', [ReviewController::class, 'eligible']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
});


Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/services', [AdminServiceController::class, 'index']);
    Route::post('/services', [AdminServiceController::class, 'store']);
    Route::put('/services/{service}', [AdminServiceController::class, 'update']);
    Route::patch('/services/{service}/status', [AdminServiceController::class, 'toggleStatus']);

    Route::get('/packages', [AdminPackageController::class, 'index']);
    Route::post('/packages', [AdminPackageController::class, 'store']);
    Route::put('/packages/{package}', [AdminPackageController::class, 'update']);
    Route::patch('/packages/{package}/status', [AdminPackageController::class, 'toggleStatus']);

    Route::get('/quote-requests', [AdminQuoteRequestController::class, 'index']);
    Route::patch('/quote-requests/{quoteRequest}/status', [AdminQuoteRequestController::class, 'updateStatus']);
    Route::get('/reviews', [AdminReviewController::class, 'index']);
    Route::patch('/reviews/{review}/visibility', [AdminReviewController::class, 'toggleVisibility']);
    Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy']);
    Route::get('/customers', [AdminCustomerController::class, 'index']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');