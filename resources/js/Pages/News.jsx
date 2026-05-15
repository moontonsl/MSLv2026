import NewsUpdatesFullPage from '@/Components/News/NewsUpdatesFullPage';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function News() {
    return (
        <MainLayout>
            <Head title="News & Updates" />
            <NewsUpdatesFullPage />
        </MainLayout>
    );
}
