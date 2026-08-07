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

Route::get('/Login', function () {
    return Inertia::render('Login/Login');
})->name('Login');

Route::get('/SL-Admin', function () {
    return Inertia::render('SL-Admin/Index');
})->name('sl.admin');

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

// Protect the student portal with active student checks
Route::middleware(['auth', 'active.student'])->group(function () {
    Route::get('/studentportal', [\App\Http\Controllers\Student\StudentPortalController::class, 'index'])->name('student.portal');
    Route::post('/studentportal/profile', [\App\Http\Controllers\Student\StudentPortalController::class, 'updateProfile'])->name('student.profile.update');

    Route::post('/studentportal/renew', function (\Illuminate\Http\Request $request) {
        $request->validate([
            'yearLevel' => 'required|string',
            'age' => 'required|integer|min:1',
            'documentFile' => 'required|file|mimes:jpeg,png,gif,pdf|max:2048',
        ]);

        $user = Auth::user();

        if ($request->hasFile('documentFile')) {
            $file = $request->file('documentFile');
            $filename = time() . '_' . $file->getClientOriginalName();
            $destinationPath = public_path('uploads/proofs');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $file->move($destinationPath, $filename);
            $user->proofOfEnrollment = '/uploads/proofs/' . $filename;
        }

        $user->year_level = $request->input('yearLevel');
        $user->age = (int)$request->input('age');
        $user->status = 'pending-review';
        
        // Record timestamps
        if (!$user->renewal_requested_at) {
            $user->renewal_requested_at = now()->subDays(1); // default to 1 day before submission if not set
        }
        $user->renewal_submitted_at = now();
        
        $user->save();

        return redirect()->back()->with('status', 'Renewal submitted successfully.');
    })->name('student.portal.renew');
});

// Verification status pages
Route::middleware(['auth', 'redirect.status'])->group(function () {
    Route::get('/pending-verification', function () {
        return Inertia::render('Auth/PendingVerification');
    })->name('pending.verification');

    Route::get('/rejected-verification', function () {
        return Inertia::render('Auth/RejectedVerification', [
            'rejectionReason' => Auth::user()->rejection_reason,
            'rejectionChecklist' => Auth::user()->rejection_checklist ?? [],
            'userData' => Auth::user(),
        ]);
    })->name('rejected.verification');
});

// Re-apply route for rejected student
Route::post('/reapply', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'reapply'])
    ->middleware('auth')
    ->name('reapply');

// Admin actions (protected by auth and custom permissions)
Route::middleware(['auth'])->group(function () {
    Route::get('/admin/dashboard', [\App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])
        ->middleware('permission:access_admin_dashboard')
        ->name('admin.dashboard');
        
    Route::post('/admin/users/{id}/approve', [\App\Http\Controllers\Admin\AdminDashboardController::class, 'approve'])
        ->middleware('permission:approve_students')
        ->name('admin.users.approve');
        
    Route::post('/admin/users/{id}/reject', [\App\Http\Controllers\Admin\AdminDashboardController::class, 'reject'])
        ->middleware('permission:reject_students')
        ->name('admin.users.reject');

    // Admin Management Page
    Route::get('/admin/management', [\App\Http\Controllers\Admin\AdminManagementController::class, 'index'])
        ->middleware('permission:access_admin_management')
        ->name('admin.management');

    Route::post('/admin/users/{user}/permissions', [\App\Http\Controllers\Admin\AdminManagementController::class, 'updatePermissions'])
        ->middleware('permission:access_admin_management')
        ->name('admin.users.permissions.update');
});

require __DIR__.'/auth.php';

Route::get('/StudentLeader', function () {
    return Inertia::render('VerificationPages/StudentLeader');
})->name('student.leader');

Route::get('/RegionalAdmin', function () {
    return Inertia::render('VerificationPages/RegionalAdmin');
})->name('regional.admin');

Route::get('/CoreAdmin', function () {
    return Inertia::render('VerificationPages/CoreAdmin');
})->name('core.admin');

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

