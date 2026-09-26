<?php

namespace App\Http\Middleware;

use App\Models\AdminAuditLog;
use App\Support\AdminNotificationService;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class RecordAdminAudit
{
    public function handle(Request $request, \Closure $next): Response
    {
        $adminId = Auth::guard('admin')->id();

        if ($request->isMethodSafe()) {
            return $next($request);
        }

        try {
            $response = $next($request);
            $this->record($request, $adminId, $response->getStatusCode());

            return $response;
        } catch (Throwable $exception) {
            $status = $exception instanceof HttpExceptionInterface
                ? $exception->getStatusCode()
                : 500;

            $this->record($request, $adminId, $status);

            throw $exception;
        }
    }

    private function record(Request $request, mixed $adminId, int $statusCode): void
    {
        if (!$adminId) {
            return;
        }

        $route = $request->route();
        $routeName = $route instanceof Route ? $route->getName() : null;
        $routeName ??= $request->path();
        $segments = array_values(array_filter(explode('.', $routeName)));
        $action = Str::headline((string) end($segments));
        $module = count($segments) > 2
            ? Str::headline((string) $segments[count($segments) - 2])
            : 'Admin';

        [$targetType, $targetId] = $this->target($route);
        $routeParameters = collect($route instanceof Route ? $route->parameters() : [])
            ->mapWithKeys(function (mixed $value, string|int $key): array {
                if (is_scalar($value)) {
                    return [(string) $key => (string) $value];
                }

                if (is_object($value) && method_exists($value, 'getKey')) {
                    return [(string) $key => (string) $value->getKey()];
                }

                return [];
            })
            ->all();

        try {
            AdminAuditLog::create([
                'admin_user_id' => $adminId,
                'route_name' => $routeName,
                'module' => $module,
                'action' => $action ?: 'Admin action',
                'method' => strtoupper($request->method()),
                'status_code' => $statusCode,
                'target_type' => $targetType,
                'target_id' => $targetId,
                'metadata' => ['route_parameters' => $routeParameters],
                'ip_address' => $request->ip(),
                'user_agent' => Str::limit((string) $request->userAgent(), 1000, ''),
            ]);

            AdminNotificationService::notifyForAdminAction($request, (int) $adminId, $statusCode);
        } catch (Throwable $exception) {
            report($exception);
        }
    }

    private function target(?Route $route): array
    {
        if (!$route) {
            return [null, null];
        }

        foreach ($route->parameters() as $value) {
            if (is_object($value) && method_exists($value, 'getKey')) {
                return [class_basename($value), (string) $value->getKey()];
            }

            if (is_scalar($value)) {
                return ['RouteParameter', (string) $value];
            }
        }

        return [null, null];
    }
}
