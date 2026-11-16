import CarouselSection from '@/Components/Admin/Home/CarouselSection';
import HighlightLinkSection from '@/Components/Admin/Home/HighlightLinkSection';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function HeroCarousel({ carousels = [] }) {
    return (
        <AdminLayout activeNavId="home-hero-carousel">
            <Head title="Hero Carousel — Home Page" />
            <header className="mb-6 sm:mb-8">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-400">
                    Home Page Settings
                </p>
                <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                    Hero Carousel
                </h1>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                    Manage the featured announcement link and "Happening Now" hero slider displayed at the top of the public homepage.
                </p>
            </header>

            <HighlightLinkSection />
            <CarouselSection initialItems={carousels} />
        </AdminLayout>
    );
}
