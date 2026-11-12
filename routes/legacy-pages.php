<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Preserve old bookmarks and form submissions while named routes use PascalCase.
$legacyPagePaths = [
    '/login' => '/Login',
    '/register' => '/Register',
    '/forgot-password' => '/ForgotPassword',
    '/reset-password/{token}' => '/ResetPassword/{token}',
    '/reset-password' => '/ResetPassword',
    '/verify-email' => '/VerifyEmail',
    '/confirm-password' => '/ConfirmPassword',
    '/profile' => '/Profile',
    '/studentportal' => '/StudentPortal',
    '/renewal-review' => '/RenewalReview',
    '/pending-verification' => '/PendingVerification',
    '/rejected-verification' => '/RejectedVerification',
    '/TermsOfService' => '/TermsAndConditions',
    '/Tournament/SL' => '/Tournament/StudentLeader',
    '/Tournament/CampusTournament' => '/Tournament/Captain',
    '/Tournament/CampusTournamentReg' => '/Tournament/CaptainRegistration',
    '/Tournament/CampusTournamentTeam' => '/Tournament/CaptainTeam',
    '/admin/login' => '/Admin/Login',
    '/admin/profile' => '/Admin/Profile',
    '/admin/dashboard' => '/Admin/Dashboard',
    '/admin/home-page' => '/Admin/HomePage',
    '/admin/faq' => '/Admin/FAQs',
    '/admin/regional-admin-accounts' => '/Admin/RegionalAdminAccounts',
    '/admin/user-regions' => '/Admin/UserRegions',
    '/admin/account-roles-permissions' => '/Admin/AccountRolesAndPermissions',
    '/admin/school-management' => '/Admin/SchoolManagement',
    '/admin/schools' => '/Admin/Schools',
    '/admin/share-links' => '/Admin/ShareLinks',
    '/admin/users/pending' => '/Admin/Users/Pending',
    '/admin/campus-tournaments/reports' => '/Admin/CampusTournaments/Reports',
    '/admin/website-settings' => '/Admin/WebsiteSettings',
    '/s/{code}' => '/S/{code}',
    '/forgot-username' => '/ForgotUsername',
];

$canonicalPageRoutes = collect(Route::getRoutes()->getRoutes());
foreach ($legacyPagePaths as $oldPath => $canonicalPath) {
    // Retain the same controller, permissions and CSRF handling for old forms.
    foreach ($canonicalPageRoutes as $pageRoute) {
        $methods = array_values(array_diff($pageRoute->methods(), ['GET', 'HEAD']));
        if ($methods && $pageRoute->uri() === ltrim($canonicalPath, '/')) {
            $action = $pageRoute->getAction();
            unset($action['as']);
            Route::match($methods, $oldPath, $action);
        }
    }

    Route::get($oldPath, function (Request $request) use ($canonicalPath) {
        $target = $canonicalPath;
        foreach ($request->route()->parameters() as $name => $value) {
            $target = str_replace('{'.$name.'}', rawurlencode((string) $value), $target);
        }
        $query = $request->getQueryString();
        return redirect($target.($query ? '?'.$query : ''), 301);
    });
}
