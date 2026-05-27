<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Perform strict backend validation for all user details
        $request->validate([
            // Step 1: Basic Details
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:10',
            'gender' => 'required|string',
            'birthday' => ['required', 'string', 'regex:/^\d{2}\/\d{2}\/\d{4}$/'], // MM/DD/YYYY
            'age' => 'required|integer|min:13',
            'contactNo' => ['required', 'string', 'regex:/^(?:0?9\d{9}|9\d{9})$/'],
            'facebookLink' => 'required|string|url',

            // Step 2: Academic Details
            'yearLevel' => 'required|string|max:255',
            'university' => 'required|string|max:255',
            'island' => 'required|string|max:255',
            'region' => 'required|string|max:255',
            'studentId' => 'required|string|max:255',
            'course' => 'required|string|max:255',
            'proofOfEnrollment' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120', // Max 5MB

            // Step 3: Game Details
            'userId' => 'required|string|unique:users,ml_id',
            'serverId' => 'required|string|max:10',
            'ign' => 'required|string|max:255',
            'squadName' => 'nullable|string|max:255',
            'squadAbbreviation' => 'nullable|string|max:10',
            'rank' => 'required|string|max:255',
            'inGameRole' => 'required|string|max:255',
            'mainHero' => 'required|string|max:255',

            // Step 4: Account Credentials
            'username' => 'required|string|alpha_num|min:5|max:12|unique:users,username',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email',
            'password' => ['required', $request->has('confirmPassword') ? 'same:confirmPassword' : 'same:password_confirmation', Rules\Password::defaults()],
            'user_type' => 'required|string|in:shs,college',
        ]);

        // 2. Security Check: Re-verify against server-side session verified profile
        $verifiedProfile = session('verified_mlbb_profile');
        if (
            !$verifiedProfile ||
            $verifiedProfile['ml_id'] !== $request->userId ||
            $verifiedProfile['ml_server'] !== $request->serverId
        ) {
            return back()->withErrors(['userId' => 'Mobile Legends account verification is required.']);
        }

        // Security Check: Re-verify against server-side session verified email code
        $isEmailVerified = session('email_verification_verified');
        $verifiedEmail = session('email_verification_verified_email');

        if (!$isEmailVerified || $verifiedEmail !== $request->email) {
            return back()->withErrors(['captcha' => 'The email verification code has not been verified or does not match.']);
        }

        // 3. Handle File Upload (Proof of Enrollment)
        $proofPath = null;
        if ($request->hasFile('proofOfEnrollment')) {
            $proofPath = $request->file('proofOfEnrollment')->store('proofs', 'public');
        }

        // 4. Parse birthday to YYYY-MM-DD
        $birthdayDate = null;
        if ($request->filled('birthday')) {
            $parts = explode('/', $request->birthday);
            if (count($parts) === 3) {
                $birthdayDate = "{$parts[2]}-{$parts[0]}-{$parts[1]}";
            }
        }

        // 5. Create user with all captured details
        $user = User::create([
            'name' => $request->firstName . ' ' . $request->lastName,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            
            // Username / Personal Details
            'username' => $request->username,
            'first_name' => $request->firstName,
            'surname' => $request->lastName,
            'suffix' => $request->suffix ?? 'N/A',
            'gender' => $request->gender,
            'birthday' => $birthdayDate,
            'age' => (int) $request->age,
            'contact_number' => $request->contactNo,
            'facebook_link' => $request->facebookLink,

            // Academic details
            'course' => $request->course,
            'university' => $request->university,
            'year_level' => $request->yearLevel,
            'studentId' => $request->studentId,
            'proofOfEnrollment' => $proofPath,
            'region' => $request->region,
            'island' => $request->island,

            // MLBB fields (merged with session-verified fields to save everything)
            'ml_id' => $request->userId,
            'ml_server' => $request->serverId,
            'ml_ign' => $verifiedProfile['ml_ign'] ?? $request->ign,
            'ml_avatar' => $verifiedProfile['ml_avatar'] ?? null,
            'ml_level' => isset($verifiedProfile['ml_level']) ? (int) $verifiedProfile['ml_level'] : null,
            'ml_rank' => $verifiedProfile['ml_rank'] ?? $request->rank,
            'ml_rank_level' => isset($verifiedProfile['ml_rank_level']) ? (int) $verifiedProfile['ml_rank_level'] : null,
            'is_mlbb_verified' => true,
            'status' => 'pending',

            // Squad / Team details
            'squadName' => $request->squadName,
            'squadAbbreviation' => $request->squadAbbreviation,
            'inGameRole' => $request->inGameRole,
            'mainHero' => $request->mainHero,
            
            // User Division type
            'user_type' => 'Student',
            'division' => $request->user_type,
        ]);

        // 6. Clean up verification session
        session()->forget([
            'verified_mlbb_profile',
            'email_verification_code',
            'email_verification_email',
            'email_verification_expires_at',
            'email_verification_verified',
            'email_verification_verified_email',
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('pending.verification');
    }

    /**
     * Handle user re-application after registration rejection.
     */
    public function reapply(Request $request): RedirectResponse
    {
        $user = Auth::user();
        if (!$user || $user->status !== 'rejected') {
            return redirect()->route('student.portal');
        }

        // Perform validation
        $request->validate([
            // Step 1: Basic Details
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:10',
            'gender' => 'required|string',
            'birthday' => ['required', 'string', 'regex:/^\d{2}\/\d{2}\/\d{4}$/'], // MM/DD/YYYY
            'age' => 'required|integer|min:13',
            'contactNo' => ['required', 'string', 'regex:/^(?:0?9\d{9}|9\d{9})$/'],
            'facebookLink' => 'required|string|url',

            // Step 2: Academic Details
            'yearLevel' => 'required|string|max:255',
            'university' => 'required|string|max:255',
            'island' => 'required|string|max:255',
            'region' => 'required|string|max:255',
            'studentId' => 'required|string|max:255',
            'course' => 'required|string|max:255',
            'proofOfEnrollment' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120', // Nullable on re-apply

            // Step 3: Game Details
            'userId' => ['required', 'string', \Illuminate\Validation\Rule::unique('users', 'ml_id')->ignore($user->id)],
            'serverId' => 'required|string|max:10',
            'ign' => 'required|string|max:255',
            'squadName' => 'nullable|string|max:255',
            'squadAbbreviation' => 'nullable|string|max:10',
            'rank' => 'required|string|max:255',
            'inGameRole' => 'required|string|max:255',
            'mainHero' => 'required|string|max:255',

            // Step 4: Account Credentials
            'username' => ['required', 'string', 'alpha_num', 'min:5', 'max:12', \Illuminate\Validation\Rule::unique('users', 'username')->ignore($user->id)],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', \Illuminate\Validation\Rule::unique('users', 'email')->ignore($user->id)],
        ]);

        // Handle File Upload (Proof of Enrollment)
        if ($request->hasFile('proofOfEnrollment')) {
            $proofPath = $request->file('proofOfEnrollment')->store('proofs', 'public');
            $user->proofOfEnrollment = $proofPath;
        }

        // Parse birthday to YYYY-MM-DD
        $birthdayDate = null;
        if ($request->filled('birthday')) {
            $parts = explode('/', $request->birthday);
            if (count($parts) === 3) {
                $birthdayDate = "{$parts[2]}-{$parts[0]}-{$parts[1]}";
            }
        }

        // Update user fields
        $user->name = $request->firstName . ' ' . $request->lastName;
        $user->email = $request->email;
        $user->username = $request->username;
        $user->first_name = $request->firstName;
        $user->surname = $request->lastName;
        $user->suffix = $request->suffix ?? 'N/A';
        $user->gender = $request->gender;
        $user->birthday = $birthdayDate;
        $user->age = (int) $request->age;
        $user->contact_number = $request->contactNo;
        $user->facebook_link = $request->facebookLink;

        $user->course = $request->course;
        $user->university = $request->university;
        $user->year_level = $request->yearLevel;
        $user->studentId = $request->studentId;
        $user->region = $request->region;
        $user->island = $request->island;

        $user->ml_id = $request->userId;
        $user->ml_server = $request->serverId;
        $user->ml_ign = $request->ign;
        $user->ml_rank = $request->rank;
        $user->squadName = $request->squadName;
        $user->squadAbbreviation = $request->squadAbbreviation;
        $user->inGameRole = $request->inGameRole;
        $user->mainHero = $request->mainHero;

        // Reset status to pending and clear rejection info
        $user->status = 'pending';
        $user->rejection_reason = null;
        $user->rejection_checklist = null;

        $user->save();

        return redirect()->route('pending.verification');
    }
}
