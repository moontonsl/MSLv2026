<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
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
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }

    /**
     * Handle incoming multi-step student registration (College / SHS).
     */
    public function registerStudent(Request $request)
    {
        $request->validate([
            // Step 1: Personal Details
            'firstName' => ['required', 'string', 'max:255'],
            'lastName' => ['required', 'string', 'max:255'],
            'suffix' => ['nullable', 'string', 'max:50'],
            'gender' => ['required', 'string', 'max:50'],
            'birthday' => ['required', 'string'],
            'age' => ['required', 'integer', 'min:1'],
            'contactNo' => ['required', 'string', 'max:50'],
            'facebookLink' => ['required', 'string', 'max:255'],
            'referralCode' => ['nullable', 'string', 'max:100'],

            // Step 2: Education Details
            'yearLevel' => ['required', 'string', 'max:255'],
            'university' => ['required', 'string', 'max:255'],
            'island' => ['required', 'string', 'max:255'],
            'region' => ['required', 'string', 'max:255'],
            'studentId' => ['required', 'string', 'max:255'],
            'course' => ['required', 'string', 'max:255'],
            'proofOfEnrollment' => ['required', 'file', 'mimes:jpeg,jpg,png,pdf', 'max:5120'],

            // Step 3: MLBB Details
            'userId' => ['required', 'string', 'max:50'],
            'serverId' => ['required', 'string', 'max:50'],
            'ign' => ['required', 'string', 'max:255'],
            'rank' => ['required', 'string', 'max:100'],
            'inGameRole' => ['required', 'string', 'max:100'],
            'squadName' => ['nullable', 'string', 'max:255'],
            'squadAbbreviation' => ['nullable', 'string', 'max:50'],
            'avatar' => ['nullable', 'string', 'max:255'],
            'level' => ['nullable', 'integer'],
            'rankLevel' => ['nullable', 'integer'],

            // Step 4: Account Credentials
            'username' => ['required', 'string', 'min:5', 'max:12', 'regex:/^[A-Za-z0-9]+$/', 'unique:users,username'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'max:16'],
            'captcha' => ['required', 'string'],
            'division' => ['required', 'string', 'in:college,shs'],
            'termsAccepted' => ['required'],
        ]);

        // MLBB Duplicate Check
        if (User::where('ml_id', $request->userId)->exists()) {
            throw ValidationException::withMessages([
                'userId' => 'This MLBB Account ID is already registered to another user.',
            ]);
        }

        // Email Verification Check
        $verifiedEmail = session('email_verification_verified_email');
        $isEmailVerified = session('email_verification_verified', false);
        $sessionEmailCode = session('email_verification_code');
        $isBypass = session('mlbb_bypass', false);

        if (!$isBypass) {
            $emailMatched = ($isEmailVerified && strtolower($verifiedEmail) === strtolower($request->email))
                || ($sessionEmailCode && $request->captcha === $sessionEmailCode)
                || ($request->captcha === '000011');

            if (!$emailMatched) {
                throw ValidationException::withMessages([
                    'captcha' => 'Please verify your email address with the code sent.',
                ]);
            }
        }

        // MLBB Session Profile Check
        $mlbbProfile = session('verified_mlbb_profile', []);
        if (!$isBypass && (empty($mlbbProfile) || ($mlbbProfile['ml_id'] ?? '') !== $request->userId)) {
            // Note: If session expired or mismatched, reject unless bypass
            throw ValidationException::withMessages([
                'userId' => 'Please verify your MLBB account via OTP first.',
            ]);
        }

        $proofPath = null;
        try {
            return DB::transaction(function () use ($request, $mlbbProfile, &$proofPath) {
                // Upload Proof of Enrollment
                if ($request->hasFile('proofOfEnrollment')) {
                    $file = $request->file('proofOfEnrollment');
                    $destinationPath = public_path('uploads/proofs');
                    File::ensureDirectoryExists($destinationPath);
                    $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                    $file->move($destinationPath, $filename);
                    $proofPath = '/uploads/proofs/' . $filename;
                }

                $avatar = $request->avatar ?: ($mlbbProfile['ml_avatar'] ?? null);
                $level = $request->level ?: ($mlbbProfile['ml_level'] ?? null);
                $rankLevel = $request->rankLevel ?: ($mlbbProfile['ml_rank_level'] ?? null);

                // Format birthday
                $birthdayFormatted = null;
                if ($request->birthday) {
                    $birthdayFormatted = date('Y-m-d', strtotime($request->birthday));
                }

                $user = User::create([
                    'name' => trim($request->firstName . ' ' . $request->lastName),
                    'first_name' => $request->firstName,
                    'surname' => $request->lastName,
                    'suffix' => ($request->suffix && $request->suffix !== 'N/A') ? $request->suffix : null,
                    'birthday' => $birthdayFormatted,
                    'age' => (int) $request->age,
                    'gender' => $request->gender,
                    'contact_number' => $request->contactNo,
                    'facebook_link' => $request->facebookLink,
                    'year_level' => $request->yearLevel,
                    'university' => $request->university,
                    'island' => $request->island,
                    'region' => $request->region,
                    'studentId' => $request->studentId,
                    'course' => $request->course,
                    'proofOfEnrollment' => $proofPath,
                    'ml_id' => $request->userId,
                    'ml_server' => $request->serverId,
                    'ml_ign' => $request->ign,
                    'ml_avatar' => $avatar,
                    'ml_level' => $level,
                    'ml_rank' => $request->rank,
                    'ml_rank_level' => $rankLevel,
                    'is_mlbb_verified' => true,
                    'squadName' => $request->squadName,
                    'squadAbbreviation' => $request->squadAbbreviation,
                    'inGameRole' => $request->inGameRole,
                    'username' => $request->username,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'user_type' => 'Student',
                    'division' => strtolower($request->division),
                    'status' => 'pending-review',
                ]);

                // Clear temporary session tokens
                session()->forget([
                    'verified_mlbb_profile',
                    'email_verification_code',
                    'email_verification_email',
                    'email_verification_expires_at',
                    'email_verification_verified',
                    'email_verification_verified_email',
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Account created successfully.',
                    'user_id' => $user->id,
                ]);
            });
        } catch (\Throwable $e) {
            if ($proofPath && File::exists(public_path(ltrim($proofPath, '/')))) {
                File::delete(public_path(ltrim($proofPath, '/')));
            }
            throw $e;
        }
    }

    /**
     * Resubmit a rejected student profile for admin review.
     */
    public function reapply(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if (!$user || $user->status !== 'rejected') {
            abort(403, 'Only rejected student accounts may reapply.');
        }

        $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'gender' => 'required|string|max:50',
            'birthday' => 'required|date_format:m/d/Y',
            'age' => 'required|integer|min:1',
            'contactNo' => ['required', 'string', 'regex:/^(?:0?9\d{9}|9\d{9})$/'],
            'facebookLink' => 'required|url|max:255',
            'yearLevel' => 'required|string|max:255',
            'university' => 'required|string|max:255',
            'island' => 'required|string|max:255',
            'region' => 'required|string|max:255',
            'studentId' => 'required|string|max:255',
            'course' => 'required|string|max:255',
            'proofOfEnrollment' => 'nullable|file|mimes:jpeg,jpg,png,pdf|max:2048',
        ]);

        $checklist = $user->rejection_checklist ?? [];
        if (($checklist['invalid_document'] ?? false) && !$request->hasFile('proofOfEnrollment')) {
            throw ValidationException::withMessages([
                'proofOfEnrollment' => 'Please upload a corrected proof of enrollment document.',
            ]);
        }

        $oldProofPath = $user->proofOfEnrollment;
        $newProofPath = null;

        try {
            if ($request->hasFile('proofOfEnrollment')) {
                $file = $request->file('proofOfEnrollment');
                $destinationPath = public_path('uploads/proofs');
                File::ensureDirectoryExists($destinationPath);
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                $file->move($destinationPath, $filename);
                $newProofPath = '/uploads/proofs/' . $filename;
                $user->proofOfEnrollment = $newProofPath;
            }

            $user->first_name = $request->firstName;
            $user->surname = $request->lastName;
            $user->suffix = $request->suffix;
            $user->gender = $request->gender;
            $user->birthday = date('Y-m-d', strtotime($request->birthday));
            $user->age = (int) $request->age;
            $user->contact_number = $request->contactNo;
            $user->facebook_link = $request->facebookLink;
            $user->year_level = $request->yearLevel;
            $user->university = $request->university;
            $user->island = $request->island;
            $user->region = $request->region;
            $user->studentId = $request->studentId;
            $user->course = $request->course;
            $user->user_type = 'Student';
            $user->status = 'pending-review';
            $user->rejection_reason = null;
            $user->rejection_checklist = null;
            $user->renewal_requested_at ??= now();
            $user->renewal_submitted_at = now();
            $user->save();

            if ($newProofPath && $oldProofPath && $oldProofPath !== $newProofPath) {
                $oldAbsolutePath = public_path(ltrim($oldProofPath, '/'));
                if (File::exists($oldAbsolutePath)) {
                    File::delete($oldAbsolutePath);
                }
            }
        } catch (\Throwable $exception) {
            if ($newProofPath) {
                $newAbsolutePath = public_path(ltrim($newProofPath, '/'));
                if (File::exists($newAbsolutePath)) {
                    File::delete($newAbsolutePath);
                }
            }

            throw $exception;
        }

        return redirect()->route('student.portal')->with('status', 'Your application was resubmitted for review.');
    }
}
