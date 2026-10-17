import CarouselSection from '@/Components/Admin/Home/CarouselSection';
import CommunityVoiceSection from '@/Components/Admin/Home/CommunityVoiceSection';
import HighlightLinkSection from '@/Components/Admin/Home/HighlightLinkSection';
import ProgramsSection from '@/Components/Admin/Home/ProgramsSection';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function HomePage({ carousels = [] }) {
    return (
        <AdminLayout activeNavId="home-page">
            <Head title="Home Page Settings" />
            <header className="mb-6 sm:mb-8">
                <h1 className="text-2xl font-bold text-white sm:text-3xl">Home Page</h1>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                    Manage the content and visuals displayed on the public homepage.
                </p>
            </header>

            <HighlightLinkSection />
            <CarouselSection initialItems={carousels} />
            <ProgramsSection />
            <CommunityVoiceSection />
        </AdminLayout>
    );
}
