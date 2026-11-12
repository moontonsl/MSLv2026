<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ComingSoonController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $feature = $request->query('feature', 'msl');
        abort_unless(in_array($feature, [
            'msl', 'campus', 'partnerships', 'general-affairs', 'collegiate-cup',
            'referral', 'events', 'news', 'membership', 'leadership-summit', 'mcc-league', 'careers',
        ], true), 404);

        return Inertia::render('ComingSoon', ['feature' => $feature]);
    }
}
