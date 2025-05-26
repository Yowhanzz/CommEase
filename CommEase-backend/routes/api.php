<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\VolunteerController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotificationController;
use App\Http\Middleware\CheckRole;

Route::middleware(['auth', 'web'])->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication Routes
Route::prefix('auth')->middleware(['web'])->group(function () {
    // Registration
    Route::post('register', [RegisterController::class, 'register']);
    Route::post('verify-otp', [RegisterController::class, 'verifyOtp']);
    Route::post('create-password', [RegisterController::class, 'createPassword']);

    // Login/Logout
    Route::post('login', [LoginController::class, 'login']);
    Route::post('logout', [LoginController::class, 'logout'])->middleware(['web', 'auth']);

    // Password Reset
    Route::post('forgot-password', [ForgotPasswordController::class, 'sendOtp']);
    Route::post('verify-reset-otp', [ForgotPasswordController::class, 'verifyOtp']);
    Route::post('reset-password', [ForgotPasswordController::class, 'resetPassword']);
});

// Event Routes
// Public Event Routes
Route::middleware(['web'])->group(function () {
    Route::get('events', [EventController::class, 'index']);
    Route::get('events/{event}', [EventController::class, 'show']);
});

// Protected Organizer Routes
Route::middleware(['auth', CheckRole::class.':organizer'])->group(function () {
    Route::post('events', [EventController::class, 'store']);
    Route::put('events/{event}', [EventController::class, 'update']);
    Route::delete('events/{event}', [EventController::class, 'destroy']);
    Route::post('events/{event}/start', [EventController::class, 'startEvent']);
    Route::post('events/{event}/end', [EventController::class, 'endEvent']);
    Route::get('events/{event}/analytics', [EventController::class, 'getAnalytics']);
    Route::post('events/{event}/attendance', [EventController::class, 'markAttendance']);
    Route::get('events/{event}/attendance', [EventController::class, 'getAttendance']);
    Route::get('events/{event}/feedback', [EventController::class, 'getFeedback']);
});

// Protected Volunteer Routes
Route::middleware(['auth', CheckRole::class.':volunteer'])->group(function () {
    Route::post('events/{event}/register', [VolunteerController::class, 'registerForEvent']);
    Route::post('events/{event}/unregister', [VolunteerController::class, 'unregisterFromEvent']);
    Route::post('events/{event}/things-brought', [VolunteerController::class, 'submitThingsBrought']);
    Route::post('events/{event}/suggestions', [VolunteerController::class, 'submitSuggestion']);
    Route::get('event-history', [VolunteerController::class, 'getEventHistory']);
    Route::post('events/{event}/feedback', [EventController::class, 'submitFeedback']);
});

// Protected User Routes (for both organizers and volunteers)
Route::middleware(['auth'])->group(function () {
    Route::get('user/profile', [AuthController::class, 'profile']);
    Route::put('user/profile', [AuthController::class, 'updateProfile']);
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::put('notifications/{notification}', [NotificationController::class, 'markAsRead']);
});
