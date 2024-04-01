<?php

use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QrCodeController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/students', [StudentController::class, 'index']);
Route::get('/students/{id}', [StudentController::class, 'show']);
Route::get('/students/search/{name}', [StudentController::class, 'search']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/scan-qrcode', [AuthController::class, 'verify_qrcode']);
// Route::any('/scan-qrcode', function () {
//     return response()->json(['message' => 'Scan QR Code route hit']);
// });

Route::post('/register', [AuthController::class, 'register']);
Route::post('/find-user', [AuthController::class, 'findUserEmail']);
Route::put('/resetpassword/{email}', [AuthController::class, 'newUserPassword']);
Route::put('/resetpassword', [AuthController::class, 'postNewPassword']);
Route::get('/users', [AuthController::class, 'index']);
// Route::post('/qrcodes', [QrCodeController::class, 'index']);




Route::group(['middleware' => ['auth:sanctum']], function(){
    Route::post('/students', [StudentController::class, 'store']);
    Route::put('/students/{id}', [StudentController::class, 'update']);
    Route::delete('/students/{id}', [StudentController::class, 'destroy']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
});
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
