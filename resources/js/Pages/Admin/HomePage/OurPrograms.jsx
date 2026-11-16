import ProgramsSection from '@/Components/Admin/Home/ProgramsSection';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function OurPrograms() {
    return (
        <AdminLayout activeNavId="home-programs">
            <Head title="Our Programs — Home Page" />
            <header className="mb-6 sm:mb-8">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-400">
                    Home Page Settings
                </p>
                <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                    Our Programs
                </h1>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                    Manage featured MSL programs and destination links showcased on the public homepage.
                </p>
            </header>

            <ProgramsSection />
        </AdminLayout>
    );
}
