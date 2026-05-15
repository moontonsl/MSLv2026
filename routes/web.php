<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/news', function () {
    return Inertia::render('News');
})->name('news');

Route::get('/news/{slug}', function (string $slug) {
    return Inertia::render('News/ArticleDetail', [
        'slug' => $slug,
    ]);
})->name('news.show');

Route::get('/events', function () {
    return Inertia::render('Events/Index');
})->name('events');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Temporary bypass:
// The student portal is public for now because the login backend/database flow is not ready yet.
// Once authentication is available, move this route back inside the auth middleware group.
Route::get('/studentportal', function () {
    return Inertia::render('StudentProfile/Index');
})->name('student.portal');

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

//ACCOUNT CREATION - COLLEGE DIVISION PAGE ROUTES
Route::get('/register/college', function () {
    return Inertia::render('AccountCreation/CollegeRegister');
})->name('college.register');
