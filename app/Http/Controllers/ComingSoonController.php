<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ComingSoonController extends Controller
{
    public function __invoke(string $feature = 'msl'): Response
    {
        abort_unless(in_array($feature, [
            'msl', 'campus', 'partnerships', 'general-affairs', 'collegiate-cup',
            'referral', 'events', 'news', 'membership', 'leadership-summit', 'mcc-league',
        ], true), 404);

        return Inertia::render('ComingSoon', ['feature' => $feature]);
    }
}
