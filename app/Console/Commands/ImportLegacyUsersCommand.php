<?php

namespace App\Console\Commands;

use App\Models\Institution;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Throwable;

class ImportLegacyUsersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'msl:import-legacy-users
        {--dry-run : Simulate the migration and print a terminal summary without writing to the database}
        {--file= : Import from an exported JSON file (supports raw array or phpMyAdmin JSON export) instead of a live DB connection}
        {--export-json= : Export legacy DB users table to the given JSON file path without importing}
        {--connection=legacy_mysql : Database connection name for the legacy MSL-1 database}
        {--chunk=500 : Batch size per insert chunk}
        {--copy-proofs-from= : Optional path to legacy storage/app/public directory to copy proofOfEnrollment files}
        {--force : Skip confirmation prompt when executing a live import}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import legacy MSL-1 users into MSLv2026 safely (supports --dry-run, direct DB connection, or portable JSON file)';

    /**
     * Verified numeric region ID mapping used in MSL-1.
     *
     * @var array<string, string>
     */
    private const LEGACY_REGION_MAP = [
        '1' => 'NCR',
        '2' => 'Region IV-A',
        '3' => 'Region III',
        '4' => 'Region VI',
        '5' => 'Region I',
        '6' => 'Region II',
        '7' => 'Region V',
        '8' => 'Region VII',
        '9' => 'Region VIII',
        '10' => 'Region IX',
        '11' => 'Region X',
        '12' => 'Region XI',
        '13' => 'Region XII',
        '14' => 'CAR',
        '15' => 'BARMM',
        '16' => 'CARAGA',
        '17' => 'Region IV-B',
    ];

    public function handle(): int
    {
        $isDryRun = (bool) $this->option('dry-run');
        $filePath = $this->option('file');
        $exportJsonPath = $this->option('export-json');
        $connection = (string) $this->option('connection');
        $chunkSize = max(50, (int) $this->option('chunk'));
        $copyProofsFrom = $this->option('copy-proofs-from');

        if ($exportJsonPath) {
            return $this->exportLegacyDatabaseToJson($connection, (string) $exportJsonPath, $chunkSize);
        }

        if ($isDryRun) {
            $this->components->info('DRY-RUN MODE ENABLED: Walang isusulat o babaguhin sa kasalukuyang database (terminal simulation lang).');
        } elseif (! $this->option('force')) {
            if (! $this->confirm('LIVE IMPORT MODE: Isusulat na ang mga legacy users sa kasalukuyang database. Ituloy?', false)) {
                $this->components->warn('Import cancelled. Walang binago sa database.');

                return self::SUCCESS;
            }
        }

        // Load existing unique keys in memory (fast O(1) hash lookups)
        $existingEmails = [];
        $usedUsernames = [];
        $usedMlIds = [];

        DB::table('users')
            ->select(['email', 'username', 'ml_id'])
            ->orderBy('id')
            ->chunk(1000, function ($rows) use (&$existingEmails, &$usedUsernames, &$usedMlIds): void {
                foreach ($rows as $row) {
                    if ($row->email !== null && $row->email !== '') {
                        $existingEmails[mb_strtolower(trim((string) $row->email))] = true;
                    }
                    if ($row->username !== null && $row->username !== '') {
                        $usedUsernames[mb_strtolower(trim((string) $row->username))] = true;
                    }
                    if ($row->ml_id !== null && $row->ml_id !== '') {
                        $usedMlIds[trim((string) $row->ml_id)] = true;
                    }
                }
            });

        // Load institution region/island lookup from MSLv2026 if available
        $institutionMap = [];
        if (Schema::hasTable('institutions')) {
            Institution::query()
                ->select(['name', 'region', 'island'])
                ->chunk(1000, function ($schools) use (&$institutionMap): void {
                    foreach ($schools as $school) {
                        $key = mb_strtolower(trim((string) $school->name));
                        if ($key !== '') {
                            $institutionMap[$key] = [
                                'region' => $school->region,
                                'island' => $school->island,
                            ];
                        }
                    }
                });
        }

        $stats = [
            'scanned' => 0,
            'imported' => 0,
            'skipped_existing_email' => 0,
            'skipped_invalid' => 0,
            'deduped_usernames' => 0,
            'nulled_duplicate_ml_ids' => 0,
            'copied_proofs' => 0,
            'missing_proofs' => 0,
            'by_user_type' => [],
            'by_status' => [],
            'by_division' => [],
        ];

        $samplePreview = [];
        $pendingBatch = [];

        $processRow = function (array $legacy) use (
            $isDryRun,
            $chunkSize,
            $copyProofsFrom,
            &$existingEmails,
            &$usedUsernames,
            &$usedMlIds,
            &$institutionMap,
            &$stats,
            &$samplePreview,
            &$pendingBatch
        ): void {
            $stats['scanned']++;

            $email = isset($legacy['email']) ? trim((string) $legacy['email']) : '';
            $password = isset($legacy['password']) ? (string) $legacy['password'] : '';

            if ($email === '' || $password === '') {
                $stats['skipped_invalid']++;

                return;
            }

            $emailKey = mb_strtolower($email);
            if (isset($existingEmails[$emailKey])) {
                $stats['skipped_existing_email']++;

                return;
            }
            $existingEmails[$emailKey] = true;

            $legacyId = $legacy['id'] ?? $stats['scanned'];

            // Username deduplication
            $rawUsername = isset($legacy['username']) ? trim((string) $legacy['username']) : '';
            $username = $rawUsername !== '' ? mb_substr($rawUsername, 0, 240) : null;
            if ($username !== null) {
                $uKey = mb_strtolower($username);
                if (isset($usedUsernames[$uKey])) {
                    $stats['deduped_usernames']++;
                    $candidate = mb_substr($username, 0, 230).'_'.$legacyId;
                    $suffixCounter = 2;
                    while (isset($usedUsernames[mb_strtolower($candidate)])) {
                        $candidate = mb_substr($username, 0, 225).'_'.$legacyId.'_'.$suffixCounter;
                        $suffixCounter++;
                    }
                    $username = $candidate;
                }
                $usedUsernames[mb_strtolower($username)] = true;
            }

            // ML ID deduplication
            $rawMlId = isset($legacy['ml_id']) ? trim((string) $legacy['ml_id']) : '';
            $mlId = $rawMlId !== '' ? mb_substr($rawMlId, 0, 255) : null;
            if ($mlId !== null) {
                if (isset($usedMlIds[$mlId])) {
                    $stats['nulled_duplicate_ml_ids']++;
                    $mlId = null;
                } else {
                    $usedMlIds[$mlId] = true;
                }
            }

            // Name normalization
            $firstName = $this->cleanNullableString($legacy['name'] ?? null);
            $surname = $this->cleanNullableString($legacy['surname'] ?? ($legacy['lastName'] ?? null));
            $suffix = $this->cleanNullableString($legacy['suffix'] ?? null);

            $fullNameParts = array_values(array_filter([$firstName, $surname, $suffix], fn ($v) => $v !== null && $v !== ''));
            $fullName = count($fullNameParts) > 0
                ? mb_substr(implode(' ', $fullNameParts), 0, 255)
                : ($username ?? explode('@', $email)[0]);

            // Role -> user_type mapping
            $userType = $this->mapUserType($legacy['role'] ?? null, $legacy['user_type'] ?? null);

            // State -> status mapping
            $legacyState = trim((string) ($legacy['state'] ?? ''));
            $status = $this->mapStatus($legacyState, $legacy['status'] ?? null);

            // University, Region & Island mapping
            $university = $this->cleanNullableString($legacy['university'] ?? null);
            [$region, $island] = $this->resolveLocation(
                $university,
                $legacy['region'] ?? null,
                $legacy['island'] ?? null,
                $institutionMap
            );

            // Year level & Division detection
            $yearLevel = $this->cleanNullableString($legacy['year_level'] ?? null);
            $division = $this->detectDivision($yearLevel, $legacy['role'] ?? null);

            // Gender enum ('male', 'female', 'other')
            $rawGender = isset($legacy['gender']) ? mb_strtolower(trim((string) $legacy['gender'])) : '';
            $gender = in_array($rawGender, ['male', 'female', 'other'], true) ? $rawGender : null;

            // Age & Birthday sanitization
            $rawAge = $legacy['age'] ?? null;
            $age = is_numeric($rawAge) && (int) $rawAge >= 10 && (int) $rawAge <= 100 ? (int) $rawAge : null;
            $birthday = $this->sanitizeDate($legacy['birthday'] ?? null);

            $mlServer = $this->cleanNullableString($legacy['ml_server'] ?? null);
            $isMlbbVerified = ($mlId !== null && $mlServer !== null && strcasecmp($legacyState, 'Verified') === 0) ? 1 : 0;

            $nowString = now()->format('Y-m-d H:i:s');
            $createdAt = $this->sanitizeTimestamp($legacy['created_at'] ?? null) ?? $nowString;
            $updatedAt = $this->sanitizeTimestamp($legacy['updated_at'] ?? null) ?? $createdAt;
            $emailVerifiedAt = $this->sanitizeTimestamp($legacy['email_verified_at'] ?? null);

            $renewalRequestedAt = null;
            if ($status === 'renewal-required') {
                $renewalRequestedAt = $this->sanitizeTimestamp($legacy['renew_date'] ?? null) ?? $updatedAt;
            }

            $proofPath = $this->cleanNullableString($legacy['proofOfEnrollment'] ?? null);
            if ($proofPath !== null && $copyProofsFrom) {
                $sourceFile = rtrim((string) $copyProofsFrom, '/\\').DIRECTORY_SEPARATOR.ltrim($proofPath, '/\\');
                if (File::isFile($sourceFile)) {
                    $stats['copied_proofs']++;
                    if (! $isDryRun) {
                        $targetFile = storage_path('app/public/'.ltrim($proofPath, '/\\'));
                        File::ensureDirectoryExists(dirname($targetFile));
                        if (! File::exists($targetFile)) {
                            File::copy($sourceFile, $targetFile);
                        }
                    }
                } else {
                    $stats['missing_proofs']++;
                }
            }

            $record = [
                'name' => $fullName,
                'first_name' => $firstName,
                'surname' => $surname,
                'suffix' => $suffix,
                'email' => mb_substr($email, 0, 255),
                'email_verified_at' => $emailVerifiedAt,
                'password' => $password,
                'username' => $username,
                'ml_id' => $mlId,
                'ml_server' => $mlServer,
                'ml_ign' => $this->cleanNullableString($legacy['ml_ign'] ?? null),
                'ml_rank' => $this->cleanNullableString($legacy['rank'] ?? ($legacy['ml_rank'] ?? null)),
                'is_mlbb_verified' => $isMlbbVerified,
                'status' => $status,
                'rejection_reason' => $status === 'blocked' ? $this->cleanNullableText($legacy['blocked_reason'] ?? null) : null,
                'birthday' => $birthday,
                'age' => $age,
                'gender' => $gender,
                'contact_number' => $this->cleanNullableString($legacy['contact_number'] ?? null),
                'facebook_link' => $this->cleanNullableString($legacy['facebook_link'] ?? null),
                'course' => $this->cleanNullableString($legacy['course'] ?? null),
                'university' => $university,
                'year_level' => $yearLevel,
                'studentId' => $this->cleanNullableString($legacy['studentId'] ?? null),
                'proofOfEnrollment' => $proofPath,
                'region' => $region,
                'island' => $island,
                'squadAbbreviation' => $this->cleanNullableString($legacy['squadAbbreviation'] ?? null),
                'squadName' => $this->cleanNullableString($legacy['squadName'] ?? null),
                'inGameRole' => $this->cleanNullableString($legacy['inGameRole'] ?? null),
                'mainHero' => $this->cleanNullableString($legacy['mainHero'] ?? null),
                'user_type' => $userType,
                'division' => $division,
                'renewal_requested_at' => $renewalRequestedAt,
                'created_at' => $createdAt,
                'updated_at' => $updatedAt,
            ];

            $stats['imported']++;
            $stats['by_user_type'][$userType] = ($stats['by_user_type'][$userType] ?? 0) + 1;
            $stats['by_status'][$status] = ($stats['by_status'][$status] ?? 0) + 1;
            $stats['by_division'][$division] = ($stats['by_division'][$division] ?? 0) + 1;

            if (count($samplePreview) < 5) {
                $samplePreview[] = [
                    $record['name'],
                    $record['email'],
                    $record['username'] ?? '—',
                    $record['user_type'],
                    $record['status'],
                    $record['region'] ?? '—',
                ];
            }

            if (! $isDryRun) {
                $pendingBatch[] = $record;
                if (count($pendingBatch) >= $chunkSize) {
                    DB::table('users')->insert($pendingBatch);
                    $pendingBatch = [];
                }
            }
        };

        try {
            if ($filePath) {
                $rows = $this->readJsonSource((string) $filePath);
                foreach ($rows as $row) {
                    if (is_array($row)) {
                        $processRow($row);
                    }
                }
            } else {
                DB::connection($connection)
                    ->table('users')
                    ->orderByRaw("CASE WHEN state = 'Verified' THEN 0 ELSE 1 END")
                    ->orderBy('id')
                    ->chunk($chunkSize, function ($rows) use ($processRow): void {
                        foreach ($rows as $row) {
                            $processRow((array) $row);
                        }
                    });
            }

            if (! $isDryRun && count($pendingBatch) > 0) {
                DB::table('users')->insert($pendingBatch);
                $pendingBatch = [];
            }
        } catch (Throwable $e) {
            $this->components->error('Migration error: '.$e->getMessage());

            return self::FAILURE;
        }

        $this->renderSummary($stats, $samplePreview, $isDryRun);

        return self::SUCCESS;
    }

    private function exportLegacyDatabaseToJson(string $connection, string $targetPath, int $chunkSize): int
    {
        try {
            $all = [];
            DB::connection($connection)
                ->table('users')
                ->orderBy('id')
                ->chunk($chunkSize, function ($rows) use (&$all): void {
                    foreach ($rows as $row) {
                        $all[] = (array) $row;
                    }
                });

            File::ensureDirectoryExists(dirname($targetPath));
            File::put($targetPath, json_encode($all, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            $this->components->info(sprintf('Exported %d legacy users to %s', count($all), $targetPath));

            return self::SUCCESS;
        } catch (Throwable $e) {
            $this->components->error('Export failed: '.$e->getMessage());

            return self::FAILURE;
        }
    }

    /**
     * Supports both a plain JSON array of user objects and phpMyAdmin's JSON table export format.
     *
     * @return array<int, array<string, mixed>>
     */
    private function readJsonSource(string $filePath): array
    {
        if (! File::isFile($filePath)) {
            throw new \RuntimeException("JSON file not found: {$filePath}");
        }

        $decoded = json_decode(File::get($filePath), true, 512, JSON_THROW_ON_ERROR);
        if (! is_array($decoded)) {
            throw new \RuntimeException('Invalid JSON structure.');
        }

        // Handle phpMyAdmin JSON export format: [{"type":"header",...}, {"type":"table","name":"users","data":[...]}]
        foreach ($decoded as $entry) {
            if (is_array($entry) && ($entry['type'] ?? null) === 'table' && isset($entry['data']) && is_array($entry['data'])) {
                return $entry['data'];
            }
        }

        return $decoded;
    }

    private function mapUserType(mixed $legacyRole, mixed $legacyUserType): string
    {
        $raw = trim((string) ($legacyRole ?: $legacyUserType ?: 'Student'));

        return match (mb_strtolower($raw)) {
            'sl', 'student leader' => 'Student Leader',
            'regional admin' => 'Regional Admin',
            'super admin' => 'Super Admin',
            default => 'Student',
        };
    }

    private function mapStatus(string $legacyState, mixed $legacyStatus): string
    {
        return match (mb_strtolower($legacyState)) {
            'verified' => 'active',
            'renew' => 'renewal-required',
            'blocked' => 'blocked',
            'new', 'verify' => 'pending-review',
            default => mb_strtolower(trim((string) $legacyStatus)) === 'active' ? 'active' : 'pending-review',
        };
    }

    /**
     * @param  array<string, array{region: ?string, island: ?string}>  $institutionMap
     * @return array{0: ?string, 1: ?string}
     */
    private function resolveLocation(?string $university, mixed $rawRegion, mixed $rawIsland, array $institutionMap): array
    {
        if ($university !== null) {
            $lookupKey = mb_strtolower($university);
            if (isset($institutionMap[$lookupKey])) {
                $matchedRegion = $institutionMap[$lookupKey]['region'] ?? null;
                $matchedIsland = $institutionMap[$lookupKey]['island'] ?? null;
                if ($matchedRegion !== null) {
                    return [$matchedRegion, $matchedIsland ?? $this->cleanNullableString($rawIsland)];
                }
            }
        }

        $regionStr = $rawRegion !== null ? trim((string) $rawRegion) : '';
        $mappedRegion = self::LEGACY_REGION_MAP[$regionStr] ?? ($regionStr !== '' ? mb_substr($regionStr, 0, 255) : null);
        $island = $this->cleanNullableString($rawIsland);

        return [$mappedRegion, $island];
    }

    private function detectDivision(?string $yearLevel, mixed $legacyRole): string
    {
        $combined = mb_strtolower(($yearLevel ?? '').' '.((string) $legacyRole));
        if (str_contains($combined, 'grade 11') || str_contains($combined, 'grade 12') || str_contains($combined, 'shs')) {
            return 'shs';
        }

        return 'college';
    }

    private function cleanNullableString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }
        $trimmed = trim((string) $value);

        return $trimmed === '' ? null : mb_substr($trimmed, 0, 255);
    }

    private function cleanNullableText(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }
        $trimmed = trim((string) $value);

        return $trimmed === '' ? null : $trimmed;
    }

    private function sanitizeDate(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }
        $str = trim((string) $value);
        if ($str === '' || str_starts_with($str, '0000')) {
            return null;
        }

        try {
            $date = Carbon::parse($str);
            if ($date->year < 1920 || $date->year > (int) date('Y')) {
                return null;
            }

            return $date->format('Y-m-d');
        } catch (Throwable) {
            return null;
        }
    }

    private function sanitizeTimestamp(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }
        $str = trim((string) $value);
        if ($str === '' || str_starts_with($str, '0000')) {
            return null;
        }

        try {
            $dt = Carbon::parse($str);
            if ($dt->year < 2000 || $dt->year > 2100) {
                return null;
            }

            return $dt->format('Y-m-d H:i:s');
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * @param  array<string, mixed>  $stats
     * @param  array<int, array<int, string>>  $samplePreview
     */
    private function renderSummary(array $stats, array $samplePreview, bool $isDryRun): void
    {
        $modeLabel = $isDryRun ? 'DRY-RUN SIMULATION (NO DB CHANGES)' : 'LIVE IMPORT COMPLETED';
        $this->newLine();
        $this->components->twoColumnDetail('<fg=yellow;options=bold>Migration Summary</>', $modeLabel);
        $this->components->twoColumnDetail('Total Legacy Rows Scanned', number_format($stats['scanned']));
        $this->components->twoColumnDetail($isDryRun ? 'Would Import (Clean Rows)' : 'Successfully Imported', number_format($stats['imported']));
        $this->components->twoColumnDetail('Skipped (Email Already Exists in MSLv2026)', number_format($stats['skipped_existing_email']));
        $this->components->twoColumnDetail('Skipped (Missing Email/Password)', number_format($stats['skipped_invalid']));
        $this->components->twoColumnDetail('Auto-Deduplicated Usernames', number_format($stats['deduped_usernames']));
        $this->components->twoColumnDetail('Cleared Duplicate ML IDs', number_format($stats['nulled_duplicate_ml_ids']));

        if ($stats['copied_proofs'] > 0 || $stats['missing_proofs'] > 0) {
            $this->components->twoColumnDetail('Proof Files Found / Copied', number_format($stats['copied_proofs']));
            $this->components->twoColumnDetail('Proof Files Missing Locally', number_format($stats['missing_proofs']));
        }

        $this->newLine();
        $this->line('<fg=cyan;options=bold>Breakdown by Mapped User Type:</>');
        foreach ($stats['by_user_type'] as $type => $count) {
            $this->components->twoColumnDetail("  • {$type}", number_format($count));
        }

        $this->newLine();
        $this->line('<fg=cyan;options=bold>Breakdown by Mapped Status:</>');
        foreach ($stats['by_status'] as $status => $count) {
            $this->components->twoColumnDetail("  • {$status}", number_format($count));
        }

        $this->newLine();
        $this->line('<fg=cyan;options=bold>Breakdown by Division:</>');
        foreach ($stats['by_division'] as $division => $count) {
            $this->components->twoColumnDetail("  • {$division}", number_format($count));
        }

        if (count($samplePreview) > 0) {
            $this->newLine();
            $this->line('<fg=cyan;options=bold>Sample Mapped Records (First 5):</>');
            $this->table(['Full Name', 'Email', 'Username', 'User Type', 'Status', 'Region'], $samplePreview);
        }
    }
}
