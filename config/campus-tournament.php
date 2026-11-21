<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Deployment test fixtures
    |--------------------------------------------------------------------------
    |
    | These fixtures create test accounts and operational tournament records.
    | They must be explicitly enabled and must never be used in the live
    | production database that contains real user data.
    |
    */
    'deployment_test_seeding' => [
        'enabled' => env('CAMPUS_TOURNAMENT_TEST_SEEDING_ENABLED', false),
        'password' => env('CAMPUS_TOURNAMENT_TEST_PASSWORD'),
    ],
];
