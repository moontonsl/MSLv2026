<?php

namespace Tests\Feature\Console;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ImportLegacyUsersCommandTest extends TestCase
{
    use RefreshDatabase;

    private string $tempJsonPath;

    protected function setUp(): void
    {
        parent::setUp();
        $this->tempJsonPath = storage_path('framework/testing/legacy_users_test.json');
    }

    protected function tearDown(): void
    {
        if (File::exists($this->tempJsonPath)) {
            File::delete($this->tempJsonPath);
        }
        parent::tearDown();
    }

    public function test_dry_run_does_not_insert_any_records(): void
    {
        User::factory()->create([
            'email' => 'existing@msl.ph',
            'username' => 'existinguser',
        ]);

        File::ensureDirectoryExists(dirname($this->tempJsonPath));
        File::put($this->tempJsonPath, json_encode([
            [
                'id' => 101,
                'name' => 'Juan',
                'surname' => 'Dela Cruz',
                'email' => 'juan.legacy@msl.ph',
                'password' => Hash::make('secret123'),
                'username' => 'juandc',
                'role' => 'SL',
                'state' => 'Verified',
                'region' => 1,
                'island' => 'Luzon',
                'year_level' => 'Grade 12 SHS',
                'ml_id' => '998877',
                'ml_server' => '1234',
                'rank' => 'Mythic',
            ],
        ]));

        $this->artisan('msl:import-legacy-users', [
            '--dry-run' => true,
            '--file' => $this->tempJsonPath,
        ])->assertSuccessful();

        $this->assertSame(1, User::count());
        $this->assertDatabaseMissing('users', ['email' => 'juan.legacy@msl.ph']);
    }

    public function test_file_import_maps_fields_deduplicates_and_is_idempotent(): void
    {
        $passwordHash = Hash::make('legacyPass123');

        User::factory()->create([
            'email' => 'sambelen11@gmail.com',
            'username' => 'dupuser',
            'ml_id' => '555111',
        ]);

        // Simulate phpMyAdmin JSON export format
        $phpMyAdminPayload = [
            ['type' => 'header', 'version' => '5.2.1'],
            [
                'type' => 'table',
                'name' => 'users',
                'data' => [
                    [
                        'id' => 10,
                        'name' => 'Sam',
                        'surname' => 'Legacy',
                        'email' => 'sambelen11@gmail.com',
                        'password' => $passwordHash,
                        'username' => 'usersam',
                        'role' => 'Student',
                        'state' => 'Renew',
                    ],
                    [
                        'id' => 25,
                        'name' => 'Maria',
                        'surname' => 'Clara',
                        'suffix' => null,
                        'email' => 'maria.legacy@msl.ph',
                        'password' => $passwordHash,
                        'username' => 'dupuser', // collides with existing username
                        'role' => 'SL',
                        'state' => 'Verified',
                        'region' => 12, // Davao -> Region XI
                        'island' => 'Mindanao',
                        'year_level' => 'Grade 11 SHS',
                        'ml_id' => '555111', // collides with existing ml_id
                        'ml_server' => '3001',
                        'rank' => 'Mythical Glory',
                        'gender' => 'female',
                        'age' => 2025, // invalid age -> should become null
                    ],
                ],
            ],
        ];

        File::ensureDirectoryExists(dirname($this->tempJsonPath));
        File::put($this->tempJsonPath, json_encode($phpMyAdminPayload));

        $this->artisan('msl:import-legacy-users', [
            '--file' => $this->tempJsonPath,
            '--force' => true,
        ])->assertSuccessful();

        $this->assertSame(2, User::count());

        $maria = User::where('email', 'maria.legacy@msl.ph')->firstOrFail();
        $this->assertSame('Maria Clara', $maria->name);
        $this->assertSame('Maria', $maria->first_name);
        $this->assertSame('Clara', $maria->surname);
        $this->assertSame('dupuser_25', $maria->username);
        $this->assertNull($maria->ml_id);
        $this->assertSame('Student Leader', $maria->user_type);
        $this->assertSame('active', $maria->status);
        $this->assertSame('Region XI', $maria->region);
        $this->assertSame('shs', $maria->division);
        $this->assertSame('Mythical Glory', $maria->ml_rank);
        $this->assertNull($maria->age);
        $this->assertTrue(Hash::check('legacyPass123', $maria->password));

        // Running a second time is completely idempotent (0 duplicates added)
        $this->artisan('msl:import-legacy-users', [
            '--file' => $this->tempJsonPath,
            '--force' => true,
        ])->assertSuccessful();

        $this->assertSame(2, User::count());
    }
}
