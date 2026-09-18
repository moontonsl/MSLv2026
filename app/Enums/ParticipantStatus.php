<?php

namespace App\Enums;

enum ParticipantStatus: string
{
    case Pending = 'pending';
    case Active = 'active';
    case Declined = 'declined';
    case Withdrawn = 'withdrawn';
    case NotQualified = 'not_qualified';
}
