<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/About', function () {
    return Inertia::render('About');
})->name('about');
Route::redirect('/about', '/About');

Route::get('/Contents&SocialMedia', function () {
    return Inertia::render('ContentMedia');
})->name('contents.social.media');
Route::redirect('/content-media', '/Contents&SocialMedia');
Route::redirect('/about/contents-social-media', '/Contents&SocialMedia');

Route::get('/News', [\App\Http\Controllers\NewsController::class, 'index'])->name('news.index');
Route::get('/News/{canonical}', [\App\Http\Controllers\NewsController::class, 'show'])->name('news.show');
Route::redirect('/news', '/News');

Route::get('/Event', function () {
    return Inertia::render('Events/Index');
})->name('events');
Route::redirect('/Events', '/Event');

Route::get('/Buffs&Support', function () {
    return Inertia::render('Buffs and Support/Index');
})->name('buffs.support');

Route::get('/Campus', function () {
    return Inertia::render('Campus/Index');
})->name('campus');

Route::get('/CampusTournament', function () {
    return Inertia::render('Campus/Index');
})->name('campus.tournament');

Route::get('/Programs', function () {
    return Inertia::render('Home');
})->name('programs');

Route::get('/Partnerships', function () {
    return Inertia::render('About');
})->name('partnerships');

Route::get('/GeneralAffairs', function () {
    return Inertia::render('About');
})->name('general.affairs');

Route::get('/AdminLogIn', function () {
    return Inertia::render('Login/Login');
})->name('admin.login');
Route::redirect('/Login', '/AdminLogIn');

Route::get('/WebAdmin', function () {
    return Inertia::render('SL-Admin/Index');
})->name('web.admin');
Route::redirect('/SL-Admin', '/WebAdmin');

Route::get('/CampusAdmin', function () {
    return Inertia::render('SL-Admin/Index');
})->name('campus.admin');

Route::get('/CSMAdmin', function () {
    return Inertia::render('SL-Admin/Index');
})->name('csm.admin');

Route::get('/GenAdAdmin', function () {
    return Inertia::render('SL-Admin/Index');
})->name('genad.admin');

Route::get('/MSLNetAdmin', function () {
    return Inertia::render('SL-Admin/Index');
})->name('mslnet.admin');

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

//TEST PAGE ROUTES
Route::get('/Testpage', function () {
    return Inertia::render('Testpage');
})->name('Testpage');

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

