import CommunityVoiceSection from '@/Components/Admin/Home/CommunityVoiceSection';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function CommunityVoice() {
    return (
        <AdminLayout activeNavId="home-community-voice">
            <Head title="MSL Campus Community — Home Page" />
            <header className="mb-6 sm:mb-8">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-400">
                    Home Page Settings
                </p>
                <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                    MSL Campus Community
                </h1>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                    Curate campus community highlights and student testimonials featured on the public homepage.
                </p>
            </header>

            <CommunityVoiceSection />
        </AdminLayout>
    );
}
