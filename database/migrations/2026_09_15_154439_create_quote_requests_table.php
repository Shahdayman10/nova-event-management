<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quote_requests', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->foreignId('service_id')
        ->constrained()
        ->restrictOnDelete();

    $table->foreignId('package_id')
        ->nullable()
        ->constrained()
        ->nullOnDelete();

    $table->string('event_type');
    $table->date('event_date');
    $table->string('event_location');
    $table->text('message')->nullable();

    $table->enum('status', [
        'pending',
        'confirmed',
        'completed',
    ])->default('pending');

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quote_requests');
    }
};
