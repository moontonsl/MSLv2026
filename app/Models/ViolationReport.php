<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ViolationReport extends Model
{
    protected $fillable = ['name', 'school', 'incident_type', 'description', 'evidence', 'is_anonymous', 'status'];

    protected function casts(): array
    {
        return ['is_anonymous' => 'boolean'];
    }
}
