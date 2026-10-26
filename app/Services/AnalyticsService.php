<?php

namespace App\Services;

use App\Models\User;
use App\Models\News;
use App\Models\Event;
use App\Models\CampusTournament;
use App\Models\MCCSeason;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Get actual page views for the last 7 days from cache.
     */
    public function getPageViewsLast7Days(): array
    {
        $days = [];
        $pageViews = [];
        
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $days[] = $date->format('D');
            
            $cacheKey = 'page_views_' . $date->format('Y-m-d');
            $dailyViews = Cache::get($cacheKey, []);
            $pageViews[] = is_array($dailyViews) ? count($dailyViews) : 0;
        }
        
        $total = array_sum($pageViews);
        $growth = $this->calculateGrowth($pageViews);

        return [
            'days' => $days,
            'pageViews' => $pageViews,
            'total' => $total,
            'growth' => $growth,
        ];
    }

    /**
     * Get key engagement metrics strictly from actual data.
     */
    public function getKeyMetrics(): array
    {
        $totalUsers = User::count();
        $activeUsers = User::where('status', 'active')->count();

        // Calculate total views and unique visitors from actual cache tracking
        $totalViews = 0;
        $uniqueVisitorSet = [];

        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::now()->subDays($i);
            
            $cacheKey = 'page_views_' . $date->format('Y-m-d');
            $dailyViews = Cache::get($cacheKey, []);
            if (is_array($dailyViews)) {
                $totalViews += count($dailyViews);
            }

            $visitorsKey = 'unique_visitors_' . $date->format('Y-m-d');
            $dailyVisitors = Cache::get($visitorsKey, []);
            if (is_array($dailyVisitors)) {
                foreach ($dailyVisitors as $v) {
                    $uniqueVisitorSet[$v] = true;
                }
            }
        }

        $uniqueVisitors = count($uniqueVisitorSet);

        // Real engagement metrics from cached sessions
        $bounceRate = $this->calculateBounceRate();
        $avgSessionDuration = $this->calculateSessionDuration();
        $pagesPerSession = $this->calculatePagesPerSession();

        return [
            'totalViews' => $totalViews,
            'uniqueVisitors' => $uniqueVisitors,
            'bounceRate' => $bounceRate,
            'avgSessionDuration' => $avgSessionDuration,
            'pagesPerSession' => $pagesPerSession,
            'totalUsers' => $totalUsers,
            'activeUsers' => $activeUsers,
        ];
    }

    /**
     * Get actual top pages visited from cache.
     */
    public function getTopPages(): array
    {
        $pageCounts = [];

        for ($i = 0; $i < 14; $i++) {
            $date = Carbon::now()->subDays($i);
            $cacheKey = 'page_views_' . $date->format('Y-m-d');
            $dailyViews = Cache::get($cacheKey, []);

            if (is_array($dailyViews)) {
                foreach ($dailyViews as $view) {
                    $path = $view['path'] ?? '/';
                    if (!isset($pageCounts[$path])) {
                        $pageCounts[$path] = 0;
                    }
                    $pageCounts[$path]++;
                }
            }
        }

        arsort($pageCounts);
        $topPages = [];

        foreach (array_slice($pageCounts, 0, 10, true) as $path => $views) {
            $topPages[] = [
                'page' => $this->getPageName($path),
                'path' => $path === '' ? '/' : $path,
                'views' => $views,
            ];
        }

        return $topPages;
    }

    /**
     * Get actual real-time analytics data.
     */
    public function getRealTimeData(): array
    {
        // Actual online users active within the last 15 minutes
        $activeUsers = User::where('updated_at', '>=', Carbon::now()->subMinutes(15))->count();
        // Actual registrations created today
        $recentRegistrations = User::whereDate('created_at', Carbon::today())->count();

        return [
            'activeUsers' => $activeUsers,
            'recentRegistrations' => $recentRegistrations,
            'lastUpdated' => Carbon::now()->format('h:i:s A'),
        ];
    }

    /**
     * Calculate actual growth percentage between first half and second half of the week.
     */
    private function calculateGrowth(array $pageViews): float
    {
        $total = array_sum($pageViews);
        if ($total === 0) {
            return 0.0;
        }

        $mid = intval(count($pageViews) / 2);
        $firstHalf = array_sum(array_slice($pageViews, 0, $mid));
        $secondHalf = array_sum(array_slice($pageViews, $mid));

        if ($firstHalf === 0) {
            return $secondHalf > 0 ? 100.0 : 0.0;
        }

        $growth = (($secondHalf - $firstHalf) / $firstHalf) * 100;
        return round($growth, 1);
    }

    /**
     * Calculate bounce rate from actual recorded sessions.
     */
    private function calculateBounceRate(): float
    {
        $singlePageSessions = 0;
        $totalSessions = 0;

        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::now()->subDays($i);
            $cacheKey = 'page_views_' . $date->format('Y-m-d');
            $dailyViews = Cache::get($cacheKey, []);

            if (is_array($dailyViews) && count($dailyViews) > 0) {
                $sessions = [];
                foreach ($dailyViews as $view) {
                    $sessionId = $view['session_id'] ?? 'unknown';
                    $sessions[$sessionId][] = $view;
                }

                foreach ($sessions as $session) {
                    $totalSessions++;
                    if (count($session) === 1) {
                        $singlePageSessions++;
                    }
                }
            }
        }

        return $totalSessions > 0 ? round(($singlePageSessions / $totalSessions) * 100, 1) : 0.0;
    }

    /**
     * Calculate average session duration in seconds from actual recorded sessions.
     */
    private function calculateSessionDuration(): int
    {
        $totalDuration = 0;
        $multiPageSessionCount = 0;

        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::now()->subDays($i);
            $cacheKey = 'page_views_' . $date->format('Y-m-d');
            $dailyViews = Cache::get($cacheKey, []);

            if (is_array($dailyViews) && count($dailyViews) > 0) {
                $sessions = [];
                foreach ($dailyViews as $view) {
                    $sessionId = $view['session_id'] ?? 'unknown';
                    $sessions[$sessionId][] = $view;
                }

                foreach ($sessions as $session) {
                    if (count($session) > 1) {
                        $timestamps = [];
                        foreach ($session as $view) {
                            if (!empty($view['created_at'])) {
                                $ts = strtotime($view['created_at']);
                                if ($ts) {
                                    $timestamps[] = $ts;
                                }
                            }
                        }
                        if (count($timestamps) >= 2) {
                            $duration = max($timestamps) - min($timestamps);
                            if ($duration > 0 && $duration < 86400) {
                                $totalDuration += $duration;
                                $multiPageSessionCount++;
                            }
                        }
                    }
                }
            }
        }

        return $multiPageSessionCount > 0 ? intval(round($totalDuration / $multiPageSessionCount)) : 0;
    }

    /**
     * Calculate pages per session from actual recorded sessions.
     */
    private function calculatePagesPerSession(): float
    {
        $totalPages = 0;
        $totalSessions = 0;

        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::now()->subDays($i);
            $cacheKey = 'page_views_' . $date->format('Y-m-d');
            $dailyViews = Cache::get($cacheKey, []);

            if (is_array($dailyViews) && count($dailyViews) > 0) {
                $sessions = [];
                foreach ($dailyViews as $view) {
                    $sessionId = $view['session_id'] ?? 'unknown';
                    $sessions[$sessionId][] = $view;
                }

                foreach ($sessions as $session) {
                    $totalSessions++;
                    $totalPages += count($session);
                }
            }
        }

        return $totalSessions > 0 ? round($totalPages / $totalSessions, 1) : 0.0;
    }

    /**
     * Convert known path to readable display name.
     */
    private function getPageName(string $path): string
    {
        $path = trim($path, '/');
        if ($path === '') {
            return 'Homepage';
        }

        $pathMap = [
            'login' => 'Student Login',
            'register' => 'Registration Hub',
            'register/college' => 'College Registration',
            'register/shs' => 'SHS Registration',
            'admin/dashboard' => 'Admin Dashboard',
            'admin/users/pending' => 'Pending Registrations Queue',
            'admin/sl-management' => 'Student Leader Management',
            'admin/regional-admin-management' => 'Regional Admin Management',
            'admin/mcc-seasons' => 'MCC Seasons',
            'admin/msl-events' => 'MSL Tournaments',
            'admin/news-updates' => 'News & CMS',
            'student/portal' => 'Student Portal Hub',
            'student/profile' => 'Student Profile',
            'news' => 'News & Articles',
            'events' => 'Event Calendar',
            'about' => 'About MSL',
        ];

        return $pathMap[$path] ?? ucwords(str_replace(['/', '-', '_'], ' ', $path));
    }
}
