<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
