<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class TrackPageViews
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only track page views for GET web requests (exclude api and debug calls)
        if ($request->isMethod('GET') && !$request->is('api/*') && !$request->is('build/*') && !$request->is('assets/*')) {
            $this->trackPageView($request);
        }

        return $response;
    }

    /**
     * Track page view in cache for real analytics.
     */
    private function trackPageView(Request $request)
    {
        try {
            $sessionId = $request->hasSession() ? $request->session()->getId() : $request->ip();

            $pageView = [
                'url' => $request->fullUrl(),
                'path' => $request->path() === '' ? '/' : $request->path(),
                'method' => $request->method(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'referer' => $request->header('referer'),
                'user_id' => auth()->id(),
                'session_id' => $sessionId,
                'created_at' => Carbon::now()->toIso8601String(),
            ];

            $cacheKey = 'page_views_' . date('Y-m-d');
            $pageViews = Cache::get($cacheKey, []);
            $pageViews[] = $pageView;
            
            // Keep up to 2000 page views per day
            if (count($pageViews) > 2000) {
                $pageViews = array_slice($pageViews, -2000);
            }
            
            Cache::put($cacheKey, $pageViews, Carbon::now()->addDays(14));

            // Also keep a running unique visitor cache per day
            $visitorsKey = 'unique_visitors_' . date('Y-m-d');
            $visitors = Cache::get($visitorsKey, []);
            $visitorIdentifier = auth()->id() ? 'user_' . auth()->id() : 'ip_' . md5($request->ip() . $request->userAgent());
            if (!in_array($visitorIdentifier, $visitors)) {
                $visitors[] = $visitorIdentifier;
                Cache::put($visitorsKey, $visitors, Carbon::now()->addDays(14));
            }

        } catch (\Exception $e) {
            \Log::error('Page view tracking failed: ' . $e->getMessage());
        }
    }
}
