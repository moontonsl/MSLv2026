<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use SimpleXMLElement;
use ZipArchive;

class BasicEducationInstitutionSeeder extends Seeder
{
    private const SOURCE = 'docs/files/List of Basic Education Schools.xlsx';

    private const COLUMNS = [
        'region',
        'division',
        'district',
        'beis_school_id',
        'school_name',
        'street_address',
        'municipality',
        'legislative_district',
        'barangay',
        'sector',
        'settlement_type',
        'school_subclassification',
        'modified_cultural_offering_classification',
        'masterlist_page',
    ];

    public function run(): void
    {
        $path = base_path(self::SOURCE);
        $zip = new ZipArchive;

        if (! is_file($path) || $zip->open($path) !== true) {
            throw new RuntimeException("Unable to open source workbook: {$path}");
        }

        try {
            $sharedStrings = $this->sharedStrings($zip->getFromName('xl/sharedStrings.xml'));
            $worksheet = simplexml_load_string($zip->getFromName($this->worksheetPath($zip)));

            if (! $worksheet instanceof SimpleXMLElement) {
                throw new RuntimeException('Unable to read the basic_education_institutions worksheet.');
            }

            $worksheet->registerXPathNamespace('x', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
            $rows = $worksheet->xpath('//x:sheetData/x:row');
            $timestamp = now();
            $batch = [];

            foreach ($rows as $rowNumber => $row) {
                if ($rowNumber === 0) {
                    continue;
                }

                $values = array_fill_keys(self::COLUMNS, null);
                foreach ($row->c as $cell) {
                    $reference = (string) $cell['r'];
                    $column = preg_replace('/\d+/', '', $reference);
                    $columnIndex = $this->columnIndex($column);
                    if ($columnIndex >= count(self::COLUMNS)) {
                        continue;
                    }

                    $value = (string) $cell->v;
                    if ((string) $cell['t'] === 's') {
                        $value = $sharedStrings[(int) $value] ?? '';
                    }

                    $values[self::COLUMNS[$columnIndex]] = $value === '' ? null : $value;
                }

                $values['beis_school_id'] = $this->normalizeNumber($values['beis_school_id']);
                $values['masterlist_page'] = $this->normalizeNumber($values['masterlist_page']);
                $values['created_at'] = $timestamp;
                $values['updated_at'] = $timestamp;
                $batch[] = $values;

                if (count($batch) === 1000) {
                    $this->upsert($batch);
                    $batch = [];
                }
            }

            $this->upsert($batch);
        } finally {
            $zip->close();
        }
    }

    private function sharedStrings(string|false $contents): array
    {
        if ($contents === false || ! $xml = simplexml_load_string($contents)) {
            throw new RuntimeException('Unable to read workbook shared strings.');
        }

        $xml->registerXPathNamespace('x', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
        $strings = [];
        foreach ($xml->xpath('//x:si') as $item) {
            $item->registerXPathNamespace('x', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
            $strings[] = implode('', array_map(
                static fn (SimpleXMLElement $text): string => (string) $text,
                $item->xpath('.//x:t')
            ));
        }

        return $strings;
    }

    private function worksheetPath(ZipArchive $zip): string
    {
        $workbook = simplexml_load_string($zip->getFromName('xl/workbook.xml'));
        $relationships = simplexml_load_string($zip->getFromName('xl/_rels/workbook.xml.rels'));

        if (! $workbook instanceof SimpleXMLElement || ! $relationships instanceof SimpleXMLElement) {
            throw new RuntimeException('Unable to read workbook metadata.');
        }

        $workbook->registerXPathNamespace('x', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
        $workbook->registerXPathNamespace('r', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships');
        $relationships->registerXPathNamespace('p', 'http://schemas.openxmlformats.org/package/2006/relationships');

        $sheet = $workbook->xpath("//x:sheet[@name='basic_education_institutions']")[0] ?? null;
        $relationshipId = $sheet?->attributes('http://schemas.openxmlformats.org/officeDocument/2006/relationships')['id'] ?? null;
        $relationship = $relationshipId
            ? $relationships->xpath("//p:Relationship[@Id='{$relationshipId}']")[0] ?? null
            : null;
        $target = $relationship?->attributes()['Target'] ?? null;

        if ($target === null) {
            throw new RuntimeException('Worksheet basic_education_institutions was not found.');
        }

        $target = ltrim((string) $target, '/');

        return str_starts_with($target, 'xl/') ? $target : "xl/{$target}";
    }

    private function columnIndex(string $column): int
    {
        $index = 0;
        foreach (str_split($column) as $letter) {
            $index = ($index * 26) + ord($letter) - 64;
        }

        return $index - 1;
    }

    private function normalizeNumber(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        return str_ends_with($value, '.0') ? substr($value, 0, -2) : $value;
    }

    private function upsert(array $rows): void
    {
        if ($rows !== []) {
            DB::table('basic_education_institutions')->upsert(
                $rows,
                ['beis_school_id'],
                array_merge(self::COLUMNS, ['updated_at'])
            );
        }
    }
}
