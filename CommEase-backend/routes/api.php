<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\VolunteerController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication Routes
Route::prefix('auth')->group(function () {
    // Registration
    Route::post('register', [RegisterController::class, 'register']);
    Route::post('verify-otp', [RegisterController::class, 'verifyOtp']);
    Route::post('create-password', [RegisterController::class, 'createPassword']);

    // Login/Logout
    Route::post('login', [LoginController::class, 'login']);
    Route::post('logout', [LoginController::class, 'logout'])->middleware('auth:sanctum');

    // Password Reset
    Route::post('forgot-password', [ForgotPasswordController::class, 'sendOtp']);
    Route::post('verify-reset-otp', [ForgotPasswordController::class, 'verifyOtp']);
    Route::post('reset-password', [ForgotPasswordController::class, 'resetPassword']);
});

// Event Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('events', [EventController::class, 'index']);
    Route::get('events/{event}', [EventController::class, 'show']);

    // Organizer Routes
    Route::middleware(['role:organizer'])->group(function () {
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

    // Volunteer Routes
    Route::middleware(['role:volunteer'])->group(function () {
        Route::post('events/{event}/register', [VolunteerController::class, 'registerForEvent']);
        Route::post('events/{event}/unregister', [VolunteerController::class, 'unregisterFromEvent']);
        Route::post('events/{event}/things-brought', [VolunteerController::class, 'submitThingsBrought']);
        Route::post('events/{event}/suggestions', [VolunteerController::class, 'submitSuggestion']);
        Route::get('event-history', [VolunteerController::class, 'getEventHistory']);
        Route::post('events/{event}/feedback', [EventController::class, 'submitFeedback']);
    });
});
