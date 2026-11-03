<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->redirectGuestsTo(function (Request $request): string {
            $adminDomain = config('app.admin_domain') ?: env('ADMIN_DOMAIN');
            $isAdminHost = $adminDomain && $request->getHost() === $adminDomain;

            return $isAdminHost || $request->is('admin/*') || $request->is('admin') || $request->is('Oppo-settings')
                ? route('admin.login')
                : route('login');
        });

        $middleware->web(append: [
            \App\Http\Middleware\TrackPageViews::class,
            \App\Http\Middleware\EnsureActiveStudent::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'active.student' => \App\Http\Middleware\EnsureActiveStudent::class,
            'campus.tournament.page' => \App\Http\Middleware\EnsureCampusTournamentPageAccess::class,
            'redirect.status' => \App\Http\Middleware\RedirectIfAuthenticatedByStatus::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'admin.permission' => \App\Http\Middleware\CheckAdminPermission::class,
            'admin.audit' => \App\Http\Middleware\RecordAdminAudit::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function (Response $response, \Throwable $exception, Request $request): Response {
            if ($response->getStatusCode() !== 404 || $request->expectsJson() || $request->is('api/*')) {
                return $response;
            }

            return Inertia::render('Errors/NotFound')
                ->toResponse($request)
                ->setStatusCode(404);
        });
    })->create();
