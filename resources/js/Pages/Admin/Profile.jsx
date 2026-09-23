import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { KeyRound, ShieldCheck, UserRound } from 'lucide-react';

const FIELD_CLASS = 'min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-yellow-500';
const ERROR_CLASS = 'mt-1 text-sm text-red-400';

function ErrorMessage({ message }) {
    return message ? <p className={ERROR_CLASS}>{message}</p> : null;
}

export default function Profile({ admin }) {
    const profileForm = useForm({ name: admin?.name ?? '', email: admin?.email ?? '' });
    const passwordForm = useForm({ current_password: '', password: '', password_confirmation: '' });

    const updateProfile = (event) => {
        event.preventDefault();
        profileForm.put(route('admin.profile.update'), { preserveScroll: true });
    };

    const updatePassword = (event) => {
        event.preventDefault();
        passwordForm.put(route('admin.profile.password.update'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    return <AdminLayout showGlobalSearch>
        <Head title="Admin Profile" />
        <div className="mb-6 sm:mb-8"><h1 className="text-2xl font-bold text-white sm:text-3xl">Admin Profile</h1><p className="mt-2 text-sm text-gray-400">Manage your administrator identity and sign-in security.</p></div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <section className="rounded-xl border border-neutral-800 bg-[#111111] p-5 sm:p-7">
                <div className="mb-6 flex items-center gap-3"><span className="rounded-lg bg-yellow-500/10 p-2 text-yellow-500"><UserRound className="h-5 w-5" /></span><div><h2 className="text-lg font-bold text-yellow-500">Profile details</h2><p className="mt-1 text-sm text-gray-400">Update the name and email used in the admin portal.</p></div></div>
                <form onSubmit={updateProfile} className="space-y-5">
                    <div><label htmlFor="admin-profile-name" className="mb-2 block text-sm font-medium text-gray-300">Full name</label><input id="admin-profile-name" type="text" value={profileForm.data.name} onChange={(event) => profileForm.setData('name', event.target.value)} className={FIELD_CLASS} autoComplete="name" /><ErrorMessage message={profileForm.errors.name} /></div>
                    <div><label htmlFor="admin-profile-email" className="mb-2 block text-sm font-medium text-gray-300">Email address</label><input id="admin-profile-email" type="email" value={profileForm.data.email} onChange={(event) => profileForm.setData('email', event.target.value)} className={FIELD_CLASS} autoComplete="email" /><ErrorMessage message={profileForm.errors.email} /></div>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 pt-5"><div className="text-xs text-gray-500">Role: <span className="text-gray-300">{admin?.is_super_admin ? 'Super Admin' : admin?.role}</span></div><button type="submit" disabled={profileForm.processing} className="min-h-[44px] rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50">{profileForm.processing ? 'Saving...' : 'Save profile'}</button></div>
                </form>
            </section>

            <section className="rounded-xl border border-neutral-800 bg-[#111111] p-5 sm:p-7">
                <div className="mb-6 flex items-center gap-3"><span className="rounded-lg bg-yellow-500/10 p-2 text-yellow-500"><KeyRound className="h-5 w-5" /></span><div><h2 className="text-lg font-bold text-yellow-500">Change password</h2><p className="mt-1 text-sm text-gray-400">Your current password is required before a new one can be saved.</p></div></div>
                <form onSubmit={updatePassword} className="space-y-5">
                    <div><label htmlFor="admin-current-password" className="mb-2 block text-sm font-medium text-gray-300">Current password</label><input id="admin-current-password" type="password" value={passwordForm.data.current_password} onChange={(event) => passwordForm.setData('current_password', event.target.value)} className={FIELD_CLASS} autoComplete="current-password" /><ErrorMessage message={passwordForm.errors.current_password} /></div>
                    <div><label htmlFor="admin-new-password" className="mb-2 block text-sm font-medium text-gray-300">New password</label><input id="admin-new-password" type="password" value={passwordForm.data.password} onChange={(event) => passwordForm.setData('password', event.target.value)} className={FIELD_CLASS} autoComplete="new-password" /><ErrorMessage message={passwordForm.errors.password} /></div>
                    <div><label htmlFor="admin-password-confirmation" className="mb-2 block text-sm font-medium text-gray-300">Confirm new password</label><input id="admin-password-confirmation" type="password" value={passwordForm.data.password_confirmation} onChange={(event) => passwordForm.setData('password_confirmation', event.target.value)} className={FIELD_CLASS} autoComplete="new-password" /><ErrorMessage message={passwordForm.errors.password_confirmation} /></div>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 pt-5"><p className="max-w-xs text-xs text-gray-500">Use at least 8 characters and avoid reusing your current password.</p><button type="submit" disabled={passwordForm.processing} className="min-h-[44px] rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50">{passwordForm.processing ? 'Updating...' : 'Change password'}</button></div>
                </form>
            </section>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-900/60 bg-blue-500/5 p-5 text-sm text-blue-200"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" /><p>Password updates regenerate your current admin session. Admin account creation, deletion, and permissions remain available only through their separately protected admin-management pages.</p></div>
    </AdminLayout>;
}
