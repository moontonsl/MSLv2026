<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->redirectGuestsTo(function (Request $request): string {
            return $request->is('admin/*') || $request->is('Oppo-settings')
                ? route('admin.login')
                : route('login');
        });

        $middleware->web(append: [
            \App\Http\Middleware\EnsureActiveStudent::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'active.student' => \App\Http\Middleware\EnsureActiveStudent::class,
            'redirect.status' => \App\Http\Middleware\RedirectIfAuthenticatedByStatus::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'admin.permission' => \App\Http\Middleware\CheckAdminPermission::class,
            'admin.audit' => \App\Http\Middleware\RecordAdminAudit::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
