<?php

namespace App\Support;

class TournamentBracketResolver
{
    public function describe(int $teamCount): string
    {
        return match (true) {
            $teamCount < 4 => 'Insufficient teams',
            $teamCount <= 7 => '1 Bracket of 4-7 Teams',
            $teamCount <= 15 => '1 Bracket of 8-15 Teams',
            $teamCount <= 23 => '1 Bracket of 16-23 Teams',
            $teamCount <= 31 => '1 Bracket of 16 Teams + 1 Bracket of 8-15 Teams',
            $teamCount === 32 => '2 Brackets of 16 Teams',
            $teamCount <= 39 => '2 Brackets of 16-23 Teams',
            $teamCount <= 47 => '2 Brackets of 16 Teams + 1 Bracket of 8-15 Teams',
            $teamCount === 48 => '3 Brackets of 16 Teams',
            default => (int) ceil($teamCount / 16).' Brackets of 16 Teams',
        };
    }
}
