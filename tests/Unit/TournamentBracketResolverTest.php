<?php

namespace Tests\Unit;

use App\Support\TournamentBracketResolver;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class TournamentBracketResolverTest extends TestCase
{
    #[DataProvider('bracketCases')]
    public function test_it_resolves_every_bracket_boundary(int $teamCount, string $expected): void
    {
        $this->assertSame($expected, (new TournamentBracketResolver)->describe($teamCount));
    }

    public static function bracketCases(): array
    {
        return [
            'zero teams' => [0, 'Insufficient teams'],
            'three teams' => [3, 'Insufficient teams'],
            'four teams' => [4, '1 Bracket of 4-7 Teams'],
            'seven teams' => [7, '1 Bracket of 4-7 Teams'],
            'eight teams' => [8, '1 Bracket of 8-15 Teams'],
            'fifteen teams' => [15, '1 Bracket of 8-15 Teams'],
            'sixteen teams' => [16, '1 Bracket of 16-23 Teams'],
            'twenty-three teams' => [23, '1 Bracket of 16-23 Teams'],
            'twenty-four teams' => [24, '1 Bracket of 16 Teams + 1 Bracket of 8-15 Teams'],
            'thirty-one teams' => [31, '1 Bracket of 16 Teams + 1 Bracket of 8-15 Teams'],
            'thirty-two teams' => [32, '2 Brackets of 16 Teams'],
            'thirty-three teams' => [33, '2 Brackets of 16-23 Teams'],
            'thirty-nine teams' => [39, '2 Brackets of 16-23 Teams'],
            'forty teams' => [40, '2 Brackets of 16 Teams + 1 Bracket of 8-15 Teams'],
            'forty-seven teams' => [47, '2 Brackets of 16 Teams + 1 Bracket of 8-15 Teams'],
            'forty-eight teams' => [48, '3 Brackets of 16 Teams'],
            'forty-nine teams' => [49, '4 Brackets of 16 Teams'],
            'sixty-four teams' => [64, '4 Brackets of 16 Teams'],
            'sixty-five teams' => [65, '5 Brackets of 16 Teams'],
        ];
    }
}
