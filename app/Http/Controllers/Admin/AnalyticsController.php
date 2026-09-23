<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\News;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Legacy/Index', [
            'module' => 'Analytics',
            'records' => collect([
                ['metric' => 'Users', 'value' => User::count()],
                ['metric' => 'News', 'value' => News::count()],
                ['metric' => 'Events', 'value' => Event::count()],
            ]),
        ]);
    }
}
