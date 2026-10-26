import { Head } from "@inertiajs/react";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import AdminAccountPage from "@/Components/Admin/AdminAccountPage";
import AdminPagination from "@/Components/Admin/AdminPagination";
import CreateAdminModal from "@/Components/Admin/CreateAdminModal";
import DeleteConfirmationModal from "@/Components/Admin/DeleteConfirmationModal";
import EditAdminModal from "@/Components/Admin/EditAdminModal";
import AdminLayout from "@/Layouts/AdminLayout";

import {
    ADMIN_PAGE_SIZE,
    ADMIN_ROLE_LABELS,
    MOCK_ADMIN_ACCOUNTS,
} from "@/data/adminAccountsMockData";

function toRoleSlug(role) {
    return String(role ?? "admin")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
}

function formatCreatedDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function normalizeAccount(account = {}, index = 0) {
    const role = toRoleSlug(account.role ?? account.user_type ?? "admin");

    const createdAt =
        account.created_at ?? account.createdAt ?? new Date().toISOString();

    const isProtected =
        account.protected === true ||
        account.email === "admin@msl.com" ||
        role === "super_admin";

    return {
        ...account,
        id: account.id ?? `admin-account-${index + 1}`,
        name: account.name ?? "",
        email: account.email ?? "",
        role,
        roleLabel:
            ADMIN_ROLE_LABELS[role] ??
            account.role ??
            account.user_type ??
            "Admin",
        created_at: createdAt,
        createdDate: formatCreatedDate(createdAt),
        protected: isProtected,
    };
}

function normalizeAccounts(accounts) {
    if (!Array.isArray(accounts)) {
        return [];
    }

    return accounts.map(normalizeAccount);
}

function createLocalId() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `admin-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function AccountManagement({ adminUsers }) {
    const [accounts, setAccounts] = useState(() =>
        normalizeAccounts(
            Array.isArray(adminUsers) ? adminUsers : MOCK_ADMIN_ACCOUNTS,
        ),
    );

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [expandedAccountId, setExpandedAccountId] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [editingAccount, setEditingAccount] = useState(null);

    const [deleteAccount, setDeleteAccount] = useState(null);

    useEffect(() => {
        if (!Array.isArray(adminUsers)) {
            return;
        }

        setAccounts(normalizeAccounts(adminUsers));
        setCurrentPage(1);
        setExpandedAccountId(null);
    }, [adminUsers]);

    const filteredAccounts = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return accounts;
        }

        return accounts.filter((account) =>
            [account.name, account.email, account.role, account.roleLabel]
                .join(" ")
                .toLowerCase()
                .includes(query),
        );
    }, [accounts, search]);

    const pageCount = Math.max(
        1,
        Math.ceil(filteredAccounts.length / ADMIN_PAGE_SIZE),
    );

    const activePage = Math.min(currentPage, pageCount);

    const visibleAccounts = useMemo(() => {
        const startIndex = (activePage - 1) * ADMIN_PAGE_SIZE;

        return filteredAccounts.slice(startIndex, startIndex + ADMIN_PAGE_SIZE);
    }, [activePage, filteredAccounts]);

    useEffect(() => {
        setCurrentPage(1);
        setExpandedAccountId(null);
    }, [search]);

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, pageCount));
    }, [pageCount]);

    const goToPage = (page) => {
        const nextPage = Math.min(Math.max(Number(page) || 1, 1), pageCount);

        setCurrentPage(nextPage);
        setExpandedAccountId(null);
    };

    const handleCreate = (values) => {
        const account = normalizeAccount({
            id: createLocalId(),
            name: values.name,
            email: values.email,
            role: values.role,
            created_at: new Date().toISOString(),
            protected: false,
        });

        /*
         * Replace this local state update with
         * router.post() when the backend is ready.
         */
        setAccounts((current) => [account, ...current]);

        setSearch("");
        setCurrentPage(1);
        setShowCreateModal(false);
    };

    const handleUpdate = (values) => {
        if (!editingAccount) {
            return;
        }

        const account = normalizeAccount({
            ...editingAccount,
            ...values,
            id: editingAccount.id,
        });

        /*
         * Replace this local state update with
         * router.put() when the backend is ready.
         */
        setAccounts((current) =>
            current.map((item) => (item.id === account.id ? account : item)),
        );

        setEditingAccount(null);
    };

    const handleDeleteRequest = (event, account) => {
        event.stopPropagation();

        if (!account.protected) {
            setDeleteAccount(account);
        }
    };

    const handleDeleteConfirm = () => {
        if (!deleteAccount) {
            return;
        }

        /*
         * Replace this local state update with
         * router.delete() when the backend is ready.
         */
        setAccounts((current) =>
            current.filter((account) => account.id !== deleteAccount.id),
        );

        setDeleteAccount(null);
        setExpandedAccountId(null);
    };

    const handleToggleAccount = (event, accountId) => {
        event.stopPropagation();

        setExpandedAccountId((currentId) =>
            currentId === accountId ? null : accountId,
        );
    };

    return (
        <AdminLayout activeNavId="account-management">
            <Head title="Account Management" />

            <div className="min-w-0 w-full overflow-x-hidden">
                <header className="mb-6 flex flex-col gap-4 sm:mb-8 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#FFFBEB] sm:text-3xl">
                            Account Management
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-gray-400">
                            Review and manage administrator accounts and access details.
                        </p>
                    </div>
                    <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                        <label className="relative block min-w-0 flex-1 sm:w-64 sm:flex-none">
                            <span className="sr-only">Search admin accounts</span>
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search admin accounts"
                                aria-label="Search admin accounts"
                                className="min-h-[44px] w-full rounded-md border border-neutral-800 bg-[#1a1a1a] py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-md bg-yellow-500 px-4 text-sm font-bold text-black transition hover:bg-yellow-400"
                        >
                            <Plus className="h-4 w-4" />
                            New Admin
                        </button>
                    </div>
                </header>

                <section className="max-w-full overflow-hidden bg-[#0B0B0B] md:rounded-xl md:border md:border-white/[0.08] md:px-11 md:py-11">
                    <div className="mb-6">
                        <h2 className="font-heading text-base font-bold text-[#FBBF24] sm:text-2xl">
                            Administrator list
                        </h2>
                    </div>

                    <div className="flex min-h-[360px] flex-col md:min-h-[400px]">
                        <div className="flex-1">
                            <AdminAccountPage
                                accounts={visibleAccounts}
                                expandedAccountId={expandedAccountId}
                                onToggle={handleToggleAccount}
                                onEdit={setEditingAccount}
                                onDelete={handleDeleteRequest}
                            />
                        </div>

                        <div className="mt-auto border-t border-white/10 pt-4 md:pt-6">
                            <AdminPagination
                                currentPage={activePage}
                                pageCount={pageCount}
                                onChange={goToPage}
                                ariaLabel="Admin account pagination"
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
                message={
                    deleteAccount
                        ? `Are you sure you want to delete ${deleteAccount.name}?`
                        : ""
                }
                onCancel={() => setDeleteAccount(null)}
                onConfirm={handleDeleteConfirm}
            />
        </AdminLayout>
    );
}
