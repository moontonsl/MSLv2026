<?php

namespace App\Enums;

enum CampusTournamentLifecycle: string
{
    case Scheduled = 'scheduled';
    case RegistrationOpen = 'registration_open';
    case RegistrationClosed = 'registration_closed';
    case Ongoing = 'ongoing';
    case Completed = 'completed';
}
