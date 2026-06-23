import CarouselSection from '@/Components/Admin/Home/CarouselSection';
import CommunityVoiceSection from '@/Components/Admin/Home/CommunityVoiceSection';
import HighlightLinkSection from '@/Components/Admin/Home/HighlightLinkSection';
import ProgramsSection from '@/Components/Admin/Home/ProgramsSection';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function HomePage() {
    return (
        <AdminLayout activeNavId="home-page">
            <Head title="Home Page Settings" />
            <h1 className="mb-8 text-3xl font-bold text-white">Home Page</h1>

            <HighlightLinkSection />
            <CarouselSection />
            <ProgramsSection />
            <CommunityVoiceSection />
        </AdminLayout>
    );
}
