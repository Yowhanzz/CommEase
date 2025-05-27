<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users',
                'regex:/^[0-9]+@gordoncollege\.edu\.ph$/' // Ensures email is in format: numbers@gordoncollege.edu.ph
            ],
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:organizer,volunteer',
            'program' => 'required_if:role,volunteer|in:BSIT,BSCS,BSEMC',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Extract user_email_id from email (everything before @)
        $user_email_id = explode('@', $request->email)[0];

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'user_email_id' => $user_email_id, // Automatically set from email
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'program' => $request->program,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function getUserQR(Request $request)
    {
        $user = $request->user();
        $qrData = $user->user_email_id; // or $user->email if you prefer
        $qrCode = QrCode::format('png')->size(300)->errorCorrection('H')->generate($qrData);
        $base64QR = base64_encode($qrCode);

        return response()->json([
            'qr_code' => $base64QR,
            'user_email_id' => $user->user_email_id,
            'email' => $user->email,
            'name' => $user->first_name . ' ' . $user->last_name,
        ]);
    }
} 