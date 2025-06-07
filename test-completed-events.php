<?php
// Simple test script to check for completed events in the database
// Run this from the CommEase-backend directory with: php test-completed-events.php

require_once 'vendor/autoload.php';

// Load Laravel environment
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Event;

echo "=== TESTING COMPLETED EVENTS ===\n\n";

// Get all events
$allEvents = Event::all();
echo "Total events in database: " . $allEvents->count() . "\n";

// Show all events with their statuses
echo "\nAll events:\n";
foreach ($allEvents as $event) {
    echo "ID: {$event->id} | Title: {$event->event_title} | Status: '{$event->status}' | Organizer: {$event->organizer_id}\n";
}

// Get completed events
$completedEvents = Event::where('status', 'completed')->get();
echo "\nCompleted events: " . $completedEvents->count() . "\n";

if ($completedEvents->count() > 0) {
    echo "\nCompleted events details:\n";
    foreach ($completedEvents as $event) {
        echo "ID: {$event->id} | Title: {$event->event_title} | Ended at: {$event->ended_at}\n";
    }
} else {
    echo "No completed events found.\n";
    echo "\nTo test archived events:\n";
    echo "1. Create an event\n";
    echo "2. Start the event (status becomes 'ongoing')\n";
    echo "3. End the event (status becomes 'completed')\n";
    echo "4. Then check archived events page\n";
}

// Check event statuses distribution
echo "\nEvent status distribution:\n";
$statusCounts = Event::selectRaw('status, COUNT(*) as count')
    ->groupBy('status')
    ->get();

foreach ($statusCounts as $status) {
    echo "Status '{$status->status}': {$status->count} events\n";
}

echo "\n=== TEST COMPLETE ===\n";
