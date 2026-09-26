<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BasicEducationInstitution extends Model
{
    use HasFactory;

    protected $table = 'basic_education_institutions';

    protected $fillable = [
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
}
