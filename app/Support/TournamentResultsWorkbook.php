<?php

namespace App\Support;

use App\Models\CampusTournament;
use App\Models\TournamentResultRevision;
use Carbon\CarbonInterface;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TournamentResultsWorkbook
{
    private const PLACEMENT_ORDER = [
        '1st' => 1,
        '2nd' => 2,
        '3rd' => 3,
        '4th' => 4,
        'participant' => 5,
    ];

    public function __construct(
        private TournamentBracketResolver $bracketResolver,
    ) {}

    public function download(
        CampusTournament $tournament,
        TournamentResultRevision $revision,
    ): StreamedResponse {
        $spreadsheet = $this->build($tournament, $revision);
        $campusName = $tournament->campus?->name
            ?? $tournament->campus?->institution?->name
            ?? 'campus';
        $slug = Str::of($campusName)->ascii()->slug('_')->limit(60, '')->toString();
        $date = $revision->submitted_at->timezone('Asia/Manila')->format('Y-m-d');
        $filename = "Tournament_Results_{$slug}_{$date}_v{$revision->version}.xlsx";

        return response()->streamDownload(function () use ($spreadsheet): void {
            (new Xlsx($spreadsheet))->save('php://output');
            $spreadsheet->disconnectWorksheets();
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Cache-Control' => 'private, no-store, no-cache, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    public function build(
        CampusTournament $tournament,
        TournamentResultRevision $revision,
    ): Spreadsheet {
        $tournament->loadMissing(['campus.institution', 'tournamentType']);
        $revision->loadMissing(['submitter', 'adminSubmitter', 'entries']);

        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Results');
        $spreadsheet->getProperties()
            ->setCreator('MSL Philippines')
            ->setTitle($tournament->name.' Tournament Results')
            ->setSubject('Campus Tournament post-event report');

        $school = $tournament->campus?->institution?->name ?? 'MSL Campus';
        $campus = $tournament->campus?->name;
        $teamCount = $revision->entries->count();

        $sheet->setCellValue('A1', 'Tournament');
        $sheet->setCellValueExplicit('B1', $tournament->name, DataType::TYPE_STRING);
        $sheet->mergeCells('B1:F1');

        $metadata = [
            ['School / Campus', trim($school.($campus ? ' - '.$campus : '')), 'text'],
            ['Registration Start Date', $tournament->registration_opens_at, 'date'],
            ['Registration End Date', $tournament->registration_closes_at, 'date'],
            ['Event Start Date', $tournament->starts_at, 'date'],
            ['Event End Date', $tournament->ends_at, 'date'],
            ['Results Submitted', $revision->submitted_at, 'date'],
            ['Submitted By', $revision->adminSubmitter?->name ?? $revision->submitter?->name ?? 'Unknown user', 'text'],
            ['Tournament Type', $tournament->tournamentType?->name ?? ucfirst($tournament->tournament_type_code), 'text'],
            ['Registered Teams', $teamCount.' registered '.Str::plural('team', $teamCount), 'text'],
            ['Bracket Type', $this->bracketResolver->describe($teamCount), 'text'],
            ['Revision', 'Version '.$revision->version, 'text'],
        ];

        foreach ($metadata as $index => [$label, $value, $type]) {
            $row = $index + 2;
            $sheet->setCellValue("A{$row}", $label);
            if ($type === 'date') {
                $this->setDateCell($sheet, "B{$row}", $value);
            } else {
                $sheet->setCellValueExplicit("B{$row}", (string) $value, DataType::TYPE_STRING);
            }
            $sheet->mergeCells("B{$row}:F{$row}");
        }

        $headerRow = count($metadata) + 3;
        $headers = ['Rank', 'Team Name', 'Player Name', 'IGN', 'Server', 'UID'];
        foreach ($headers as $columnIndex => $header) {
            $sheet->setCellValue([$columnIndex + 1, $headerRow], $header);
        }

        $entries = $revision->entries
            ->sortBy(fn ($entry): array => [
                self::PLACEMENT_ORDER[$entry->placement_code] ?? 99,
                mb_strtolower($entry->team_name_snapshot),
            ]);
        $row = $headerRow + 1;

        foreach ($entries as $entry) {
            foreach ($entry->roster_snapshot as $player) {
                $values = [
                    $entry->placement_code === 'participant' ? 'Participant' : $entry->placement_code,
                    $entry->team_name_snapshot,
                    $player['name'] ?? 'Player',
                    $player['ign'] ?? '',
                    $player['server'] ?? '',
                    $player['uid'] ?? '',
                ];

                foreach ($values as $columnIndex => $value) {
                    $sheet->setCellValueExplicit(
                        [$columnIndex + 1, $row],
                        (string) $value,
                        DataType::TYPE_STRING,
                    );
                }
                $row++;
            }
        }

        $lastRow = max($headerRow, $row - 1);
        $sheet->freezePane('A'.($headerRow + 1));
        $sheet->setAutoFilter("A{$headerRow}:F{$lastRow}");
        $sheet->getStyle('A1:F1')->getFont()->setBold(true)->setSize(14);
        $sheet->getStyle("A{$headerRow}:F{$headerRow}")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => '000000']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FACC15']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);
        $sheet->getStyle("A{$headerRow}:F{$lastRow}")->getBorders()->getAllBorders()
            ->setBorderStyle(Border::BORDER_THIN)
            ->getColor()->setRGB('B7B7B7');
        $sheet->getStyle('A2:A'.(count($metadata) + 1))->getFont()->setBold(true);
        $sheet->getColumnDimension('A')->setWidth(24);
        $sheet->getColumnDimension('B')->setWidth(30);
        $sheet->getColumnDimension('C')->setWidth(28);
        $sheet->getColumnDimension('D')->setWidth(24);
        $sheet->getColumnDimension('E')->setWidth(16);
        $sheet->getColumnDimension('F')->setWidth(20);

        return $spreadsheet;
    }

    private function setDateCell(Worksheet $sheet, string $coordinate, CarbonInterface $date): void
    {
        $manilaDate = $date->toImmutable()->setTimezone('Asia/Manila');

        $sheet->setCellValue($coordinate, ExcelDate::PHPToExcel($manilaDate->toDateTimeImmutable()));
        $sheet->getStyle($coordinate)->getNumberFormat()->setFormatCode('mmmm d, yyyy h:mm AM/PM');
    }
}
