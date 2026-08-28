<?php

namespace App\Enums;

enum TeamStatus: string
{
    case Assembling = 'assembling';
    case Registered = 'registered';
    case Merged = 'merged';
    case Withdrawn = 'withdrawn';
    case NotQualified = 'not_qualified';
}
