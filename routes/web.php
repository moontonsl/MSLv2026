<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/news', [\App\Http\Controllers\NewsController::class, 'index'])->name('news.index');
Route::get('/news/{canonical}', [\App\Http\Controllers\NewsController::class, 'show'])->name('news.show');

Route::get('/Events', function () {
    return Inertia::render('Events/Index');
})->name('events');

Route::get('/Buffs&Support', function () {
    return Inertia::render('Buffs and Support/Index');
})->name('buffs.support');

Route::get('/Campus', function () {
    return Inertia::render('Campus/Index');
})->name('campus');

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
Route::get('/studentportal', function () { //put the username - for backend tasks
    return Inertia::render('StudentProfile/Index');
})->name('student.portal');

require __DIR__.'/auth.php';

Route::get('/SL-Admin', function () {
    return Inertia::render('SL-Admin/Index');
})->name('sl.admin');

//TEST PAGE ROUTES
Route::get('/Testpage', function () {
    return Inertia::render('Testpage');
})->name('Testpage');

//LOGIN PAGE ROUTES
Route::get('/Login', function () {
    return Inertia::render('Login/Login');
})->name('login');

//FORGOT PASSWORD PAGE ROUTES
Route::get('/ForgotPassword', function () {
    return Inertia::render('Login/components/ForgotPassword');
})->name('reset.password');

//FORGOT USERNAME PAGE ROUTES
Route::get('/ForgotUsername', function () {
    return Inertia::render('Login/components/ForgotUsername');
})->name('forgot.username');

//ACCOUNT CREATION - SHS DIVISION PAGE ROUTES
Route::get('/AccountCreation/SHS', function () {
    return Inertia::render('AccountCreation/SHSRegister');
})->name('shs.register');

//ACCOUNT CREATION - COLLEGE DIVISION PAGE ROUTES
Route::get('/AccountCreation/College', function () {
    return Inertia::render('AccountCreation/CollegeRegister');
})->name('college.register');

// Public routes to fetch news data
Route::get('/api/news/articles', [\App\Http\Controllers\NewsController::class, 'getArticles']);
Route::get('/api/news/highlights', [\App\Http\Controllers\NewsController::class, 'getHighlights']);
Route::get('/api/news/related', [\App\Http\Controllers\NewsController::class, 'getRelatedArticles']);
