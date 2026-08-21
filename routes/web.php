<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/content-media', function () {
    return Inertia::render('ContentMedia');
})->name('content-media');

Route::redirect('/about/contents-social-media', '/content-media');

Route::get('/news', [\App\Http\Controllers\NewsController::class, 'index'])->name('news.index');
Route::get('/news/{canonical}', [\App\Http\Controllers\NewsController::class, 'show'])->name('news.show');

Route::get('/admin/account-creation', function () {
    return Inertia::render('Admin/AccountCreation');
})->name('admin.account-creation');

Route::get('/admin/home-page', function () {
    return Inertia::render('Admin/HomePage');
})->name('admin.home-page');

Route::get('/admin/faq', function () {
    return Inertia::render('Admin/Faq');
})->name('admin.faq');

Route::get('/admin/news-updates', function () {
    return Inertia::render('Admin/NewsUpdates');
})->name('admin.news-updates');

Route::get('/events', function () {
    return Inertia::render('Events/Index');
})->name('events');

/*
|--------------------------------------------------------------------------
| Campus Tournament (legacy URLs from MSL-1)
|--------------------------------------------------------------------------
| Page routes match the old website paths in CAMPUS_TOURNAMENT_ROUTES.md.
| Newer /programs/campus-tournaments/* paths redirect here for compatibility.
*/

/** Role entry — currently lands on SL manage (auth/role redirect can be wired later) */
Route::get('/campus-tournament', function () {
    return redirect()->route('campus.tournament.sl');
})->name('campus.tournament');

Route::get('/Tournament/SL', function () {
    return Inertia::render('Programs/CampusTournaments/SlView');
})->name('campus.tournament.sl');

/**
 * Regional Admin (old site). No dedicated Figma page yet — temporarily same UI as SL.
 * Check Figma for a distinct Regional Admin frame (approve-only, extend, export).
 */
Route::get('/Tournament/RegionalAdmin', function () {
    return Inertia::render('Programs/CampusTournaments/SlView');
})->name('campus.tournament.regionaladmin');

/** Public/testing view of tournaments (old site reused the SL page) */
Route::get('/campus-tournament/public', function () {
    return Inertia::render('Programs/CampusTournaments/SlView');
})->name('campus.tournament.public');

/**
 * School organizer create/browse flow (new in this rebuild; not an old MSL-1 page URL).
 */
Route::get('/Tournament/Organizer', function () {
    return Inertia::render('Programs/CampusTournaments/OrganizerView');
})->name('campus.tournament.organizer');

Route::get('/Tournament/CampusTournament', function () {
    return Inertia::render('Programs/CampusTournaments/CaptainHub');
})->name('campus.captainregistration');

Route::get('/Tournament/CampusTournamentReg', function () {
    return Inertia::render('Programs/CampusTournaments/CaptainRegister');
})->name('campus.teamregistration');

Route::get('/Tournament/CampusTournamentTeam', function () {
    return Inertia::render('Programs/CampusTournaments/CaptainTeam');
})->name('campus.team');

Route::get('/Tournament/SoloPlayer', function () {
    return Inertia::render('Programs/CampusTournaments/SoloMatchmaking');
})->name('campus.tournament.solo.player');

/** Extra member flows (not separate pages on the old site; invite lived on Team view) */
Route::get('/Tournament/MemberInvite', function () {
    return Inertia::render('Programs/CampusTournaments/MemberInvite');
})->name('campus.member.invite');

Route::get('/Tournament/MemberJoin', function () {
    return Inertia::render('Programs/CampusTournaments/MemberJoinCode');
})->name('campus.member.join');

/** Compatibility redirects from earlier /programs/... paths */
Route::redirect('/programs/campus-tournaments', '/Tournament/Organizer');
Route::redirect('/programs/campus-tournaments/sl', '/Tournament/SL');
Route::redirect('/programs/campus-tournaments/captain', '/Tournament/CampusTournament');
Route::redirect('/programs/campus-tournaments/captain/register', '/Tournament/CampusTournamentReg');
Route::redirect('/programs/campus-tournaments/captain/team', '/Tournament/CampusTournamentTeam');
Route::redirect('/programs/campus-tournaments/captain/join', '/Tournament/SoloPlayer');
Route::redirect('/programs/campus-tournaments/solo', '/Tournament/SoloPlayer');
Route::redirect('/programs/campus-tournaments/member', '/Tournament/MemberInvite');
Route::redirect('/programs/campus-tournaments/member/join', '/Tournament/MemberJoin');
Route::redirect('/sl/campus-tournament', '/Tournament/SL');
Route::redirect('/captain/campus-tournament', '/Tournament/CampusTournament');
Route::redirect('/member/campus-tournament', '/Tournament/MemberInvite');

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

// Public routes to fetch news data
Route::get('/api/news/articles', [\App\Http\Controllers\NewsController::class, 'getArticles']);
Route::get('/api/news/highlights', [\App\Http\Controllers\NewsController::class, 'getHighlights']);
Route::get('/api/news/related', [\App\Http\Controllers\NewsController::class, 'getRelatedArticles']);
