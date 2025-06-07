<?php

require 'CommEase-backend/vendor/autoload.php';

$app = require_once 'CommEase-backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Notification;
use App\Models\User;

echo "=== NOTIFICATION API TEST ===" . PHP_EOL;

// Test 1: Check if notifications exist
$totalNotifications = Notification::count();
echo "Total notifications in database: $totalNotifications" . PHP_EOL;

// Test 2: Check users
$totalUsers = User::count();
echo "Total users in database: $totalUsers" . PHP_EOL;

// Test 3: Check notifications for each user
if ($totalUsers > 0) {
    echo PHP_EOL . "Notifications per user:" . PHP_EOL;
    $users = User::all();
    foreach ($users as $user) {
        $userNotifications = $user->notifications()->count();
        echo "User {$user->id} ({$user->first_name} {$user->last_name} - {$user->role}): $userNotifications notifications" . PHP_EOL;
        
        if ($userNotifications > 0) {
            echo "  Recent notifications:" . PHP_EOL;
            $recent = $user->notifications()->orderBy('created_at', 'desc')->limit(3)->get();
            foreach ($recent as $notif) {
                echo "    - {$notif->type}: " . substr($notif->message, 0, 50) . "..." . PHP_EOL;
            }
        }
    }
}

// Test 4: Create a test notification for user ID 2 (organizer)
$organizer = User::find(2);
if ($organizer) {
    echo PHP_EOL . "Creating test notification for organizer..." . PHP_EOL;
    $testNotification = Notification::create([
        'user_id' => $organizer->id,
        'event_id' => null,
        'type' => 'test_notification',
        'message' => 'Test notification created at ' . now()->format('Y-m-d H:i:s')
    ]);
    echo "Test notification created with ID: {$testNotification->id}" . PHP_EOL;
}

echo PHP_EOL . "=== TEST COMPLETE ===" . PHP_EOL;
