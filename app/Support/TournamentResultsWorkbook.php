<?php

namespace App\Support;

use App\Models\CampusTournament;
use App\Models\TournamentResultRevision;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
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
        ]);
    }

    public function build(
        CampusTournament $tournament,
        TournamentResultRevision $revision,
    ): Spreadsheet {
        $tournament->loadMissing(['campus.institution', 'tournamentType']);
        $revision->loadMissing(['submitter', 'entries']);

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
            ['School / Campus', trim($school.($campus ? ' - '.$campus : ''))],
            ['Registration Start Date', $this->formatDate($tournament->registration_opens_at)],
            ['Registration End Date', $this->formatDate($tournament->registration_closes_at)],
            ['Event Start Date', $this->formatDate($tournament->starts_at)],
            ['Event End Date', $this->formatDate($tournament->ends_at)],
            ['Results Submitted', $revision->submitted_at->timezone('Asia/Manila')->format('F j, Y g:i A')],
            ['Submitted By', $revision->submitter?->name ?? 'Unknown user'],
            ['Tournament Type', $tournament->tournamentType?->name ?? ucfirst($tournament->tournament_type_code)],
            ['Bracket Type', $teamCount.' registered '.Str::plural('team', $teamCount)],
            ['Revision', 'Version '.$revision->version],
        ];

        foreach ($metadata as $index => [$label, $value]) {
            $row = $index + 2;
            $sheet->setCellValue("A{$row}", $label);
            $sheet->setCellValueExplicit("B{$row}", $value, DataType::TYPE_STRING);
            $sheet->mergeCells("B{$row}:F{$row}");
        }

        $headerRow = 13;
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
        $sheet->freezePane('A14');
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
        $sheet->getStyle('A2:A11')->getFont()->setBold(true);
        $sheet->getColumnDimension('A')->setWidth(24);
        $sheet->getColumnDimension('B')->setWidth(30);
        $sheet->getColumnDimension('C')->setWidth(28);
        $sheet->getColumnDimension('D')->setWidth(24);
        $sheet->getColumnDimension('E')->setWidth(16);
        $sheet->getColumnDimension('F')->setWidth(20);

        return $spreadsheet;
    }

    private function formatDate($date): string
    {
        return $date->timezone('Asia/Manila')->format('F j, Y g:i A');
    }
}
