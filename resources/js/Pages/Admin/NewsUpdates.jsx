import NewsManagement from '@/Components/Admin/NewsManagement';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function NewsUpdates({ newsItems = [] }) {
    return (
        <AdminLayout activeNavId="news" showGlobalSearch>
            <Head title="News & Updates Settings" />
            <NewsManagement initialNews={newsItems} />
        </AdminLayout>
    );
}
