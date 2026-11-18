<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

/**
 * Public "Contact Us" page. Inquiries are emailed to the MSL inbox
 * (config('mail.contact_inbox'), falling back to contact@moontonslph.org)
 * with Reply-To set to the sender, so the team can answer directly.
 */
class ContactController extends Controller
{
    public const MESSAGE_MIN_CHARS = 100;

    public const TOPICS = [
        'General Inquiry',
        'Campus Communities',
        'MSL Network & Partnerships',
        'Sponsorships & Brand Collaborations',
        'Events & Tournaments',
        'Content & Media',
        'Technical Support',
    ];

    public function show(): Response
    {
        return Inertia::render('Contact/Index', [
            'topics' => self::TOPICS,
            'contactEmail' => $this->inbox(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:60'],
            'last_name' => ['required', 'string', 'max:60'],
            'email' => ['required', 'email:rfc', 'max:120'],
            'phone' => ['nullable', 'string', 'regex:/^(?:\+?63|0)?9\d{9}$/'],
            'organization' => ['nullable', 'string', 'max:120'],
            'topic' => ['required', 'string', Rule::in(self::TOPICS)],
            'subject' => ['required', 'string', 'max:120'],
            'message' => ['required', 'string', 'min:'.self::MESSAGE_MIN_CHARS, 'max:2000'],
        ], [
            'phone.regex' => 'Please enter a valid PH mobile number (e.g. 09171234567).',
            'message.min' => 'Please write at least :min characters so we can help you properly.',
        ]);

        $fullName = trim("{$data['first_name']} {$data['last_name']}");

        $body = implode("\n", [
            "New inquiry from the MSL Philippines website",
            str_repeat('-', 44),
            "Name:          {$fullName}",
            "Email:         {$data['email']}",
            'Phone:         '.($data['phone'] ?: '—'),
            'Organization:  '.($data['organization'] ?: '—'),
            "Topic:         {$data['topic']}",
            "Subject:       {$data['subject']}",
            str_repeat('-', 44),
            $data['message'],
        ]);

        try {
            Mail::raw($body, function (Message $mail) use ($data, $fullName) {
                $mail->to($this->inbox())
                    ->replyTo($data['email'], $fullName)
                    ->subject("[MSL Contact] {$data['topic']}: {$data['subject']}");
            });
        } catch (Throwable $exception) {
            Log::error('Contact form email failed to send.', [
                'error' => $exception->getMessage(),
                'topic' => $data['topic'],
            ]);

            return response()->json([
                'message' => 'We could not send your message right now. Please try again in a moment.',
            ], 503);
        }

        return response()->json([
            'message' => 'Your message has been sent.',
        ]);
    }

    private function inbox(): string
    {
        return config('mail.contact_inbox') ?: 'contact@moontonslph.org';
    }
}
