<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';


//TEST PAGE ROUTES
Route::get('/Testpage', function () {
    return Inertia::render('Testpage');
})->name('Testpage');

//LOGIN PAGE ROUTES
Route::get('/login', function () {
    return Inertia::render('Login/Login');
})->name('Login');

//FORGOT PASSWORD PAGE ROUTES
Route::get('/forgot-password', function () {
    return Inertia::render('Login/components/ForgotPassword');
})->name('reset.password');

//FORGOT USERNAME PAGE ROUTES
Route::get('/forgot-username', function () {
    return Inertia::render('Login/components/ForgotUsername');
})->name('forgot.username');

//ACCOUNT CREATION - SHS DIVISION PAGE ROUTES
Route::get('/register/shs', function () {
    return Inertia::render('AccountCreation/SHSRegister');
})->name('shs.register');