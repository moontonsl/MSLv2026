<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

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
        $exceptions->render(function (Throwable $exception, Request $request) {
            if (
                $request->expectsJson()
                || $exception instanceof AuthenticationException
                || $exception instanceof ValidationException
            ) {
                return null;
            }

            $status = match (true) {
                $exception instanceof HttpExceptionInterface => $exception->getStatusCode(),
                $exception instanceof HttpResponseException => $exception->getResponse()->getStatusCode(),
                default => 500,
            };

            if (! in_array($status, [401, 403, 404, 419, 422, 429, 500, 503], true)) {
                return null;
            }

            // Keep Laravel's detailed exception page available during local development.
            if ($status === 500 && config('app.debug')) {
                return null;
            }

            $isAdminArea = $request->is('admin', 'admin/*');

            return Inertia::render('Errors/HttpStatus', [
                'status' => $status,
                'isAdminArea' => $isAdminArea,
            ])->toResponse($request)->setStatusCode($status);
        });
    })->create();
