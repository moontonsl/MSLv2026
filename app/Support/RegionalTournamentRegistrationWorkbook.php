<?php

namespace App\Support;

use App\Models\Campus;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RegionalTournamentRegistrationWorkbook
{
    public function download(
        Collection $participants,
        CarbonInterface $startDate,
        CarbonInterface $endDate,
        ?Campus $campus,
    ): StreamedResponse {
        $spreadsheet = $this->build($participants, $startDate, $endDate);
        $scope = $campus === null
            ? 'All'
            : Str::of($this->schoolName($campus))->ascii()->slug('_')->limit(60, '')->toString();
        $start = $startDate->toImmutable()->setTimezone('Asia/Manila')->format('Y-m-d');
        $end = $endDate->toImmutable()->setTimezone('Asia/Manila')->format('Y-m-d');
        $filename = "PreReg_{$scope}_{$start}_to_{$end}.xlsx";

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
        Collection $participants,
        CarbonInterface $startDate,
        CarbonInterface $endDate,
    ): Spreadsheet {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('PreReg');
        $spreadsheet->getProperties()
            ->setCreator('MSL Philippines')
            ->setTitle('Campus Tournament Pre-Registration Report')
            ->setSubject('Regional campus tournament registration roster');

        $sheet->setCellValue('A1', 'Registration Start Date:');
        $sheet->setCellValue('A2', 'Registration End Date:');
        $this->setDateCell($sheet, 'B1', $startDate);
        $this->setDateCell($sheet, 'B2', $endDate);
        $sheet->getStyle('A1:A2')->getFont()->setBold(true);

        $headerRow = 4;
        $headers = ['Island', 'School', 'Team Name', 'Player Name', 'IGN', 'Server', 'UID'];
        foreach ($headers as $columnIndex => $header) {
            $sheet->setCellValue([$columnIndex + 1, $headerRow], $header);
        }

        $row = $headerRow + 1;
        foreach ($participants as $participant) {
            $campus = $participant->tournament->campus;
            $values = [
                $campus?->city?->region?->island?->name ?? '',
                $campus ? $this->schoolName($campus) : '',
                $participant->team?->name ?? '',
                $participant->user?->name ?? 'Player',
                $participant->user?->ml_ign ?? '',
                $participant->user?->ml_server ?? '',
                $participant->user?->ml_id ?? '',
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

        $lastRow = max($headerRow, $row - 1);
        $sheet->freezePane('A5');
        $sheet->setAutoFilter("A{$headerRow}:G{$lastRow}");
        $sheet->getStyle("A{$headerRow}:G{$headerRow}")->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);
        $sheet->getStyle("A{$headerRow}:G{$lastRow}")->getBorders()->getAllBorders()
            ->setBorderStyle(Border::BORDER_THIN)
            ->getColor()->setRGB('666666');
        $sheet->getColumnDimension('A')->setWidth(18);
        $sheet->getColumnDimension('B')->setWidth(48);
        $sheet->getColumnDimension('C')->setWidth(28);
        $sheet->getColumnDimension('D')->setWidth(28);
        $sheet->getColumnDimension('E')->setWidth(24);
        $sheet->getColumnDimension('F')->setWidth(16);
        $sheet->getColumnDimension('G')->setWidth(20);

        return $spreadsheet;
    }

    private function schoolName(Campus $campus): string
    {
        $institution = $campus->institution?->name;

        return trim(($institution ?: 'MSL School').($campus->name ? '-'.$campus->name : ''));
    }

    private function setDateCell(Worksheet $sheet, string $coordinate, CarbonInterface $date): void
    {
        $manilaDate = $date->toImmutable()->setTimezone('Asia/Manila');

        $sheet->setCellValue($coordinate, ExcelDate::PHPToExcel($manilaDate->toDateTimeImmutable()));
        $sheet->getStyle($coordinate)->getNumberFormat()->setFormatCode('mmmm d, yyyy');
    }
}
