<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\ForgotPasswordMail;
use App\Models\User;
use App\Models\qr_code;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed'
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);

        $userId = $user->id;
        $userIdConcat1 = $user->id;
        $userIdConcat2 = $user->name;
        $userIdConcat3 = $user->email;
        $createdAt = Carbon::now();

        $temporaryUuIdConcatenated = $userIdConcat1 . " " . $userIdConcat2 . " " . $userIdConcat3;

        $qr_code_collections = qr_code::create([
            'qrc_uuid' => $temporaryUuIdConcatenated,
            'qrc_user_id' => $userId,
            'created_at' => $createdAt,
        ]);

        // Generate QR code
        $qrCode = QrCode::format('png')->size(400)->generate("{$user->email}");

        // Save QR code to disk
        $qrCodeSaved = $this->saveQRCode($qrCode, $user->id);

        if (!$qrCodeSaved) {
            $response = [
                'success' => false,
                'message' => 'Failed to save QR code.',
            ];
            return response($response, 500); // Return an error response
        }

        $token = $user->createToken('m4rkbellofullstack')->plainTextToken;
        $response = [
            'success' => true,
            'message' => 'User has new token!',
            'user' => $user,
            'token' => $token,
            'qr_code_path' => $qr_code_collections
        ];

        return response($response, 201);
    }

    private function saveQRCode($qrCode, $userId)
    {
        $path = public_path("qrcodes/{$userId}.png");
        \Log::info("Attempting to save QR code to: $path");

        $directory = dirname($path);
        if (!is_dir($directory)) {
            \Log::info("Creating directory: $directory");
            if (!mkdir($directory, 0755, true)) {
                \Log::error("Failed to create directory: $directory");
                return false;
            }
        }

        if (file_put_contents($path, $qrCode) === false) {
            \Log::error("Failed to save QR code to: $path");
            return false; // Return false to indicate failure
        }

        \Log::info("QR code saved successfully to: $path");
        return $path; // Return the path to the saved QR code
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $data['email'])->first();

        $userAuthenticated = $user;

        if (!$user || !Hash::check($data['password'], $user->password)){
            return response([
                'success' => false,
                'status' => '401',
                'message' => 'email or password is incorrect!'
            ], 401);
        };

        $userAuthenticated = $user->id;

        $token = $user->createToken('m4rkbellofullstack')->plainTextToken;

        $response = [
            'success' => true,
            'message' => 'Email and Password is correct!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'password' => $user->password,
            ],
            'token' => $token,
            'user_authenticated_id' => $userAuthenticated,
        ];

        return response($response, 200);
    }


    public function logout(Request $request)
    {
        Auth::user()->currentAccessToken()->delete();
        return [
            "success" => true,
            "message" => 'Logout successfully!'
        ];
    }

    public function findUserEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // $token = Str::random(60);
        $token = $user->createToken('m4rkbellofullstack')->plainTextToken;

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => $token, 'created_at' => Carbon::now()]
        );

        // Send the email with the reset password link
        $mailSent = Mail::to($user->email)->send(new ForgotPasswordMail($token));

        if ($mailSent) {
            return response()->json([
                'status' => true,
                'message' => 'Reset password email sent',

            ], 200);
        } else {
            return response()->json(['message' => 'Failed to send reset password email'], 500);
        }
    }

    public function newUserPassword(Request $request, string $email)
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        $user->update($request->all());
        $token = $user->createToken('m4rkbellofullstack')->plainTextToken;

        $response = [
            "success" => true,
            "message" => 'User has a new password successfully!',
            "user" => $user,
            "token" => $token
        ];

        return response($response, 201);
    }

    public function postNewPassword(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed'
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);

        $token = $user->createToken('m4rkbellofullstack')->plainTextToken;
        $response = [
            'success' => true,
            'message' => 'User has new token!',
            'user' => $user,
            'token' => $token
        ];

        return response($response, 201);
    }

    public function index()
    {
        $users = User::all();
        $personal_access_token = DB::table('personal_access_tokens')->get();

        $response = [
            "success" => true,
            "message" => 'All data of users and personal_access_token',
            "users" => $users,
            "personal_access_token" => $personal_access_token
        ];

        return response($response, 200);

    }
    public function verify_qrcode(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|string'
        ]);

        $user = User::where('email', $data['email'])->first();

        $userAuthenticated = $user;
        $userAuthenticated = $user->id;

        $token = $user->createToken('m4rkbellofullstack')->plainTextToken;

        $response = [
            'success' => true,
            'message' => 'Email and Password is correct!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'password' => $user->password,
            ],
            'token' => $token,
            'user_authenticated_id' => $userAuthenticated,
        ];

        return response($response, 200);
    }

}
