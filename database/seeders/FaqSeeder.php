<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            [
                'category' => 'General',
                'question' => 'Who can join MSL?',
                'answer' => 'Any student, campus esports organization, or recognized school-based group with a passion for Mobile Legends and esports development can be part of MSL.',
                'is_pinned' => true,
                'is_active' => true,
            ],
            [
                'category' => 'Registration',
                'question' => "How can I join if I'm just an individual student?",
                'answer' => 'Individual students can join through their campus MSL chapter or register as a student gamer on our portal to participate in scrims, workshops, and community events.',
                'is_pinned' => true,
                'is_active' => true,
            ],
            [
                'category' => 'General',
                'question' => 'How do we start an MSL Community in our school?',
                'answer' => 'You can apply through our Campus Ambassador / Student Leader program or reach out to our team to establish an officially accredited MSL chapter in your school.',
                'is_pinned' => true,
                'is_active' => true,
            ],
            [
                'category' => 'General',
                'question' => 'What benefits do MSL Communities receive?',
                'answer' => 'Accredited chapters receive official Moonton support, diamond sponsorships for campus tournaments, exclusive merchandise, leadership training, and tournament broadcasting exposure.',
                'is_pinned' => true,
                'is_active' => true,
            ],
            [
                'category' => 'Events',
                'question' => 'How does MSL support esports tournaments?',
                'answer' => 'MSL provides tournament organizers with tournament kits, prize pool diamond sponsorships, rulebooks, marshaling assistance, and official publicity support.',
                'is_pinned' => true,
                'is_active' => true,
            ],
            [
                'category' => 'General',
                'question' => 'Can brands and partners collaborate with MSL?',
                'answer' => 'Yes! We welcome brand partnerships, campus activations, equipment sponsorships, and career workshops that help empower Filipino student-gamers.',
                'is_pinned' => false,
                'is_active' => true,
            ],
            [
                'category' => 'General',
                'question' => 'What benefits do partners gain when collaborating with MSL?',
                'answer' => 'Partners gain direct access to a highly engaged nationwide collegiate audience across 150+ campuses, authentic grassroots esports activations, and digital co-branding.',
                'is_pinned' => false,
                'is_active' => true,
            ],
            [
                'category' => 'General',
                'question' => 'Do MSL members receive training or development opportunities?',
                'answer' => 'Yes, student leaders and organizers are offered specialized leadership bootcamps, production and casting workshops, event management mentorship, and career pathways in the esports industry.',
                'is_pinned' => false,
                'is_active' => true,
            ],
            [
                'category' => 'General',
                'question' => 'Is MSL exclusive to Mobile Legends?',
                'answer' => 'While our core competitive title is Mobile Legends: Bang Bang in partnership with Moonton, our leadership and community initiatives support broad student development and collegiate esports excellence.',
                'is_pinned' => false,
                'is_active' => true,
            ],
            [
                'category' => 'General',
                'question' => 'How can we contact MSL Philippines?',
                'answer' => 'You can contact us through our official social media channels, email us at partnerships@moontonslph.org, or message your designated Regional Student Leader.',
                'is_pinned' => false,
                'is_active' => true,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::updateOrCreate(
                ['question' => $faq['question']],
                [
                    'category' => $faq['category'],
                    'answer' => $faq['answer'],
                    'is_pinned' => $faq['is_pinned'],
                    'is_active' => $faq['is_active'],
                ]
            );
        }
    }
}
