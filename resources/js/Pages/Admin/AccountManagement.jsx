import { Head } from "@inertiajs/react";
import { Plus, Search } from "lucide-react";

import AdminLayout from "@/Layouts/AdminLayout";
import AdminPagination from "@/Components/Admin/AdminPagination";
import AdminAccountPage from "@/Components/Admin/AdminAccountPage";
import CreateAdminModal from "@/Components/Admin/CreateAdminModal";
import EditAdminModal from "@/Components/Admin/EditAdminModal";
import DeleteConfirmationModal from "@/Components/Admin/DeleteConfirmationModal";
import useAdminAccounts from "@/Components/Admin/useAdminAccounts";

export default function AccountManagement({ adminUsers = [] }) {
    const {
        accountPages,
        activePage,
        deleteAccount,
        editingAccount,
        expandedAccountId,
        goToPage,
        handleCreate,
        handleDeleteConfirm,
        handleDeleteRequest,
        handleToggleAccount,
        handleUpdate,
        pageCount,
        pageWidth,
        search,
        setEditingAccount,
        setSearch,
        setShowCreateModal,
        showCreateModal,
        trackOffset,
    } = useAdminAccounts(adminUsers);

    return (
        <AdminLayout activeNavId="account-management">
            <Head title="Account Management" />

            <div className="min-w-0 max-w-full overflow-x-hidden">
                <h1 className="mb-6 font-heading text-xl font-bold tracking-tight text-[#FFFBEB] sm:mb-10 sm:text-4xl">
                    Account Management
                </h1>

                <section className="max-w-full overflow-hidden bg-[#0B0B0B] px-0 py-0 md:rounded-xl md:border md:border-white/[0.08] md:px-11 md:py-11">
                    <div className="mb-5 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-center md:justify-between">
                        <h2 className="font-heading text-base font-bold text-[#FBBF24] sm:text-2xl">
                            Admin Account
                        </h2>

                        <div className="flex w-full min-w-0 items-center gap-2 sm:gap-3 md:w-auto">
                            <div className="relative min-w-0 flex-1 md:w-[196px] md:flex-none">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search..."
                                    aria-label="Search admin accounts"
                                    className="h-9 w-full rounded-lg bg-[#1A1A1A] pl-9 pr-3 text-xs text-white outline-none placeholder:text-gray-600 focus:ring-1 focus:ring-[#FBBF24]"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#FBBF24] px-3 text-xs font-bold text-black transition hover:bg-[#FCD34D] sm:gap-2 sm:px-4"
                            >
                                <Plus className="h-4 w-4" />

                                <span className="hidden min-[360px]:inline">
                                    New Admin
                                </span>

                                <span className="min-[360px]:hidden">New</span>
                            </button>
                        </div>
                    </div>

                    {/*
                     * Every page stays in a horizontal track. Changing the
                     * page translates that track, so pagination behaves like
                     * moving to the next/previous page instead of replacing
                     * rows in one vertical list.
                     */}
                    <div className="flex min-h-[360px] flex-col md:min-h-[400px]">
                        <div className="flex-1 overflow-hidden">
                            <div
                                className="flex items-start transition-transform duration-300 ease-out motion-reduce:transition-none"
                                style={{
                                    width: `${pageCount * 100}%`,
                                    transform: `translate3d(-${trackOffset}, 0, 0)`,
                                }}
                            >
                                {accountPages.map((pageAccounts, pageIndex) => {
                                    const pageNumber = pageIndex + 1;

                                    return (
                                        <div
                                            key={`account-page-${pageNumber}`}
                                            className="min-w-0 shrink-0"
                                            style={{
                                                flex: `0 0 ${pageWidth}`,
                                            }}
                                        >
                                            <AdminAccountPage
                                                accounts={pageAccounts}
                                                isActive={
                                                    pageNumber === activePage
                                                }
                                                expandedAccountId={
                                                    expandedAccountId
                                                }
                                                onToggle={handleToggleAccount}
                                                onEdit={setEditingAccount}
                                                onDelete={handleDeleteRequest}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-auto max-w-full overflow-hidden border-t border-white/10 pt-4 md:pt-6">
                            <AdminPagination
                                currentPage={activePage}
                                pageCount={pageCount}
                                onChange={goToPage}
                            />
                        </div>
                    </div>
                </section>
            </div>

            <CreateAdminModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreate}
            />

            <EditAdminModal
                isOpen={Boolean(editingAccount)}
                account={editingAccount}
                onClose={() => setEditingAccount(null)}
                onSubmit={handleUpdate}
            />

            <DeleteConfirmationModal
                isOpen={Boolean(deleteAccount)}
                onCancel={() => setDeleteAccount(null)}
                onConfirm={handleDeleteConfirm}
            />
        </AdminLayout>
    );
}
