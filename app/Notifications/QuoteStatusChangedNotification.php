<?php

namespace App\Notifications;

use App\Models\QuoteRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class QuoteStatusChangedNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly QuoteRequest $quoteRequest)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'quote_request_id' => $this->quoteRequest->id,
            'event_type' => $this->quoteRequest->event_type,
            'status' => $this->quoteRequest->status,
            'message' => "Your {$this->quoteRequest->event_type} request is now {$this->quoteRequest->status}.",
        ];
    }
}