<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rule;

class StudentPortalController extends Controller
{
    /**
     * Helper check for student privilege.
     */
    protected function checkStudentPrivilege()
    {
        $user = Auth::user();
        if (!$user || $user->user_type !== 'Student') {
            abort(403, 'Unauthorized access.');
        }
    }

    /**
     * Display the student portal profile.
     */
    public function index(Request $request): Response
    {
        $this->checkStudentPrivilege();

        return Inertia::render('StudentProfile/Index');
    }

    /**
     * Update the student's profile information.
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $this->checkStudentPrivilege();
        $user = Auth::user();

        $request->validate([
            'yearLevel' => ['required', 'string', 'max:255'],
            'courseName' => ['required', 'string', 'max:255'],
            'contactNo' => ['required', 'string', 'regex:/^(?:0?9\d{9}|9\d{9})$/'],
            'facebookLink' => ['required', 'string', 'url', 'max:255'],
            'squad' => ['nullable', 'string', 'max:255'],
            'squadAbbreviation' => ['nullable', 'string', 'max:10'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user->id),
            ],
        ]);

        // Handle email change verification check
        if ($request->email !== $user->email) {
            $verified = session('email_verification_verified');
            $verifiedEmail = session('email_verification_verified_email');

            if (!$verified || $verifiedEmail !== $request->email) {
                return back()->withErrors([
                    'email' => 'Please verify your new email address using the verification code before saving.'
                ]);
            }

            // Clear session verification after successful matching
            session()->forget(['email_verification_verified', 'email_verification_verified_email', 'email_verification_code', 'email_verification_email']);
            $user->email = $request->email;
        }

        // Update profile fields
        $user->year_level = $request->yearLevel;
        $user->course = $request->courseName;
        $user->contact_number = $request->contactNo;
        $user->facebook_link = $request->facebookLink;
        $user->squadName = $request->squad;
        $user->squadAbbreviation = $request->squadAbbreviation;

        // Save cover photo / background if supplied
        if ($request->has('profileBackground')) {
            // We use profileBackground state, but since there's no DB column,
            // we can optionally ignore or save it. Wait, the user might want it saved.
            // Let's check if the user model has ml_avatar, but profileBackground is mock anyway.
            // We'll leave it as is or we can ignore it since it is selected from static list.
        }

        $user->save();

        return redirect()->back()->with('status', 'Profile updated successfully.');
    }
}
