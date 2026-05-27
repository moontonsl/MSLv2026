<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $accountRenewal = null;
        if ($user && in_array($user->status, ['renewal-required', 'renewal_required', 'needupdate'])) {
            $accountRenewal = [
                'yearLevel' => 'needupdate',
                'age' => 'needupdate',
                'document' => 'needupdate',
            ];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'permissions' => $user 
                    ? ($user->user_type === 'Super Admin' 
                        ? \App\Models\Permission::pluck('slug')->toArray() 
                        : $user->permissions->pluck('slug')->toArray()) 
                    : [],
            ],
            'accountRenewal' => $accountRenewal,
        ];
    }
}
