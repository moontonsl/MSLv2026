<?php

namespace App\Http\Controllers\Admin;

use App\Models\AdminAuditLog;
use App\Models\AdminUser;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminAuditLogController
{
    public function index(Request $request): Response
    {
        $query = AdminAuditLog::query()->with('adminUser:id,name,email');
        $search = trim((string) $request->input('search', ''));
        $routeName = trim((string) $request->input('route_name', ''));

        if ($search !== '') {
            $query->where(function ($builder) use ($search): void {
                $builder->where('route_name', 'like', '%' . $search . '%')
                    ->orWhere('module', 'like', '%' . $search . '%')
                    ->orWhere('action', 'like', '%' . $search . '%')
                    ->orWhere('target_type', 'like', '%' . $search . '%')
                    ->orWhere('target_id', 'like', '%' . $search . '%')
                    ->orWhereHas('adminUser', function ($adminQuery) use ($search): void {
                        $adminQuery->where('name', 'like', '%' . $search . '%')
                            ->orWhere('email', 'like', '%' . $search . '%');
                    });
            });
        }

        if ($routeName !== '') {
            $query->where('route_name', $routeName);
        }

        if ($request->filled('admin_id') && ctype_digit((string) $request->input('admin_id'))) {
            $query->where('admin_user_id', (int) $request->input('admin_id'));
        }

        foreach (['from', 'to'] as $dateFilter) {
            if ($request->filled($dateFilter) && preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) $request->input($dateFilter))) {
                $query->whereDate('created_at', $dateFilter === 'from' ? '>=' : '<=', $request->input($dateFilter));
            }
        }

        $logs = $query->latest()->paginate(25)->withQueryString();
        $logs->setCollection($logs->getCollection()->map(fn (AdminAuditLog $log): array => [
            'id' => $log->id,
            'admin' => $log->adminUser ? [
                'name' => $log->adminUser->name,
                'email' => $log->adminUser->email,
            ] : null,
            'route_name' => $log->route_name,
            'module' => $log->module,
            'action' => $log->action,
            'method' => $log->method,
            'status_code' => $log->status_code,
            'target_type' => $log->target_type,
            'target_id' => $log->target_id,
            'metadata' => $log->metadata,
            'ip_address' => $log->ip_address,
            'created_at' => $log->created_at?->toIso8601String(),
        ]));

        return Inertia::render('Admin/AuditLogs', [
            'logs' => $logs,
            'actions' => AdminAuditLog::query()->whereNotNull('route_name')->distinct()->orderBy('route_name')->pluck('route_name')->values(),
            'admins' => AdminUser::query()->select('id', 'name', 'email')->orderBy('name')->get(),
            'filters' => [
                'search' => $search,
                'route_name' => $routeName,
                'admin_id' => (string) $request->input('admin_id', ''),
                'from' => (string) $request->input('from', ''),
                'to' => (string) $request->input('to', ''),
            ],
        ]);
    }
}
