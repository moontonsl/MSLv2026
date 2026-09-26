<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MCCSeason extends Model
{
    use SoftDeletes;

    protected $table = 'mcc_seasons';
    protected $fillable = ['season_number', 'season_name', 'is_active', 'start_date', 'end_date', 'route_slug', 'description'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean', 'start_date' => 'date', 'end_date' => 'date'];
    }

    public function content()
    {
        return $this->hasMany(MCCSeasonContent::class, 'season_id');
    }

    public function setAsActive(): void
    {
        static::query()->update(['is_active' => false]);
        $this->refresh();
        $this->update(['is_active' => true]);
    }
}
