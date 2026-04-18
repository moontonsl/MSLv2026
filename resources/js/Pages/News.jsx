import NewsGridSection from '@/Components/News/NewsGridSection';
import NewsHeroSection from '@/Components/News/NewsHeroSection';
import NewsletterSection from '@/Components/News/NewsletterSection';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

const HERO_IMG =
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=2000&q=80';

const featuredSlides = [
    {
        href: '/news/msl-collegiate-cup-season-4',
        imageSrc: HERO_IMG,
        title: 'MSL Collegiate Cup Season 4: The Road to Nationals Begins',
        excerpt:
            'Registration is officially open! Check out the new format, increased prize pool, and region-locking mechanics for this season. Teams from Luzon, Visayas, and Mindanao will battle for supremacy.',
        date: 'Nov 27, 2025',
        author: 'Tournament Admin',
    },
    {
        href: '/news/community-highlights',
        imageSrc:
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80',
        title: 'Community Highlights: Campuses That Went Above and Beyond',
        excerpt:
            'Spotlighting student-led initiatives, charity streams, and the partnerships shaping the next wave of campus esports.',
        date: 'Nov 20, 2025',
        author: 'MSL Editorial',
    },
    {
        href: '/news/patch-roadmap',
        imageSrc:
            'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=2000&q=80',
        title: 'Patch Roadmap: What Ranked Players Should Watch Next',
        excerpt:
            'A forward look at balance philosophy, upcoming hero adjustments, and how collegiate leagues are adapting.',
        date: 'Nov 15, 2025',
        author: 'Game Updates Desk',
    },
];

export default function News() {
    return (
        <MainLayout>
            <Head title="News & Updates" />
            <NewsHeroSection featuredSlides={featuredSlides} />
            <NewsGridSection />
            <NewsletterSection />
        </MainLayout>
    );
}
