<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MCCSeasonContent extends Model
{
    protected $table = 'mcc_season_content';
    protected $fillable = ['season_id', 'content_type', 'content_key', 'content_value', 'display_order'];

    protected function casts(): array
    {
        return ['content_value' => 'array'];
    }

    public function season()
    {
        return $this->belongsTo(MCCSeason::class, 'season_id');
    }
}
