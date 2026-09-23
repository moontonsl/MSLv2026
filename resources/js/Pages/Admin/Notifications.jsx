import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { useState } from 'react';

function formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

function Pagination({ paginator }) {
    if (!paginator?.links || paginator.links.length <= 3) return null;
    return <nav className="mt-6 flex flex-wrap justify-end gap-2" aria-label="Notification pagination">{paginator.links.map((link, index) => <Link key={`${index}-${link.label}`} href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} className={`min-h-[40px] rounded-md border px-3 py-2 text-sm ${link.active ? 'border-yellow-500 bg-yellow-500 text-black' : 'border-neutral-700 text-gray-300 hover:border-neutral-500'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`} />)}</nav>;
}

export default function Notifications({ notifications, unreadCount = 0, filter = 'all' }) {
    const [processingId, setProcessingId] = useState(null);
    const items = notifications?.data ?? [];

    const markRead = (notification) => {
        setProcessingId(notification.id);
        router.post(route('admin.notifications.read', notification.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                if (notification.action_url) router.visit(notification.action_url);
            },
            onFinish: () => setProcessingId(null),
        });
    };

    const markAllRead = () => {
        router.post(route('admin.notifications.read-all'), {}, { preserveScroll: true });
    };

    return <AdminLayout activeNavId="notifications" showGlobalSearch>
        <Head title="Notifications" />
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="flex items-center gap-3 text-2xl font-bold text-white sm:text-3xl"><Bell className="h-7 w-7 text-yellow-500" />Notifications</h1><p className="mt-2 text-sm text-gray-400">Important activity from other administrators and student operations.</p></div>{unreadCount > 0 ? <button type="button" onClick={markAllRead} className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-md border border-neutral-700 px-4 text-sm text-gray-300 hover:border-yellow-500 hover:text-yellow-400"><CheckCheck className="h-4 w-4" />Mark all as read</button> : null}</div>

        <div className="mb-5 flex gap-2"><Link href={route('admin.notifications.index', { filter: 'all' })} className={`rounded-md px-4 py-2 text-sm ${filter === 'all' ? 'bg-yellow-500 font-bold text-black' : 'border border-neutral-700 text-gray-300 hover:border-neutral-500'}`}>All</Link><Link href={route('admin.notifications.index', { filter: 'unread' })} className={`rounded-md px-4 py-2 text-sm ${filter === 'unread' ? 'bg-yellow-500 font-bold text-black' : 'border border-neutral-700 text-gray-300 hover:border-neutral-500'}`}>Unread ({unreadCount})</Link></div>

        <section className="rounded-xl border border-neutral-800 bg-[#111111] p-4 sm:p-6 md:p-8"><div className="mb-6 flex items-center justify-between gap-4"><div><h2 className="text-lg font-bold text-yellow-500 sm:text-xl">Activity inbox</h2><p className="mt-1 text-sm text-gray-400">{notifications?.total ?? items.length} notification{(notifications?.total ?? items.length) === 1 ? '' : 's'}</p></div><Bell className="h-7 w-7 text-yellow-500" /></div>{items.length === 0 ? <div className="py-14 text-center"><Check className="mx-auto mb-4 h-10 w-10 text-emerald-500" /><p className="text-sm text-gray-400">No notifications found.</p></div> : <div className="space-y-3">{items.map((notification) => <div key={notification.id} className={`flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between ${notification.read_at ? 'border-neutral-800 bg-[#151515]' : 'border-yellow-900/70 bg-yellow-500/5'}`}><div><div className="flex items-center gap-2"><h3 className="font-semibold text-white">{notification.title}</h3>{!notification.read_at ? <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] font-bold uppercase text-black">New</span> : null}</div><p className="mt-1 text-sm text-gray-300">{notification.message}</p><p className="mt-2 text-xs text-gray-500">{formatDate(notification.created_at)}</p></div>{!notification.read_at ? <button type="button" disabled={processingId === notification.id} onClick={() => markRead(notification)} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-neutral-700 px-3 text-sm text-gray-300 hover:border-yellow-500 hover:text-yellow-400 disabled:opacity-50"><Check className="h-4 w-4" />Read</button> : null}</div>)}</div>}<Pagination paginator={notifications} /></section>
    </AdminLayout>;
}
