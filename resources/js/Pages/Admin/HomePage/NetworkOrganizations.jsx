import NetworkOrganizationsSection from '@/Components/Admin/Home/NetworkOrganizationsSection';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function NetworkOrganizations({ networkOrganizations = [] }) {
    return (
        <AdminLayout activeNavId="home-network-organizations">
            <Head title="MSL Network Organizations — Home Page" />
            <header className="mb-6 sm:mb-8">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-400">
                    The MSL Network
                </p>
                <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                    MSL Network Organizations
                </h1>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                    Manage all partner and campus organization logos and clickable links shown in the MSL Network marquee.
                </p>
            </header>

            <NetworkOrganizationsSection initialItems={networkOrganizations} />
        </AdminLayout>
    );
}
