import CarouselSection from '@/Components/Admin/Home/CarouselSection';
import CommunityVoiceSection from '@/Components/Admin/Home/CommunityVoiceSection';
import HighlightLinkSection from '@/Components/Admin/Home/HighlightLinkSection';
import NetworkOrganizationsSection from '@/Components/Admin/Home/NetworkOrganizationsSection';
import ProgramsSection from '@/Components/Admin/Home/ProgramsSection';
import StatisticsSection from '@/Components/Admin/Home/StatisticsSection';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function HomePage({
    carousels = [],
    statistics = {},
    liveCounts = {},
    networkOrganizations = [],
}) {
    return (
        <AdminLayout activeNavId="home-page">
            <Head title="Home Page" />
            <header className="mb-6 sm:mb-8">
                <h1 className="text-2xl font-bold text-white sm:text-3xl">Home Page</h1>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                    Manage the content and visuals displayed on the public homepage.
                </p>
            </header>

            <HighlightLinkSection />
            <CarouselSection initialItems={carousels} />
            <StatisticsSection initialStatistics={statistics} liveCounts={liveCounts} />
            <NetworkOrganizationsSection initialItems={networkOrganizations} />
            <ProgramsSection />
            <CommunityVoiceSection />
        </AdminLayout>
    );
}
