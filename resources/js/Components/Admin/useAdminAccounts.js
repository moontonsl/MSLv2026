import { useEffect, useMemo, useState } from "react";

import { MOCK_ADMIN_ACCOUNTS } from "@/data/adminAccountsMockData";
import {
    PAGE_SIZE,
    getRole,
    isProtectedAccount,
    normalizeAccount,
    roleToSlug,
} from "@/Components/Admin/adminAccountUtils";

export default function useAdminAccounts(adminUsers = []) {
    const [accounts, setAccounts] = useState(() => {
        const source =
            Array.isArray(adminUsers) && adminUsers.length > 0
                ? adminUsers
                : MOCK_ADMIN_ACCOUNTS;

        return source.map(normalizeAccount);
    });

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedAccountId, setExpandedAccountId] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [deleteAccount, setDeleteAccount] = useState(null);

    const filteredAccounts = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return accounts;
        }

        return accounts.filter((account) =>
            [account.name, account.email, getRole(account)]
                .join(" ")
                .toLowerCase()
                .includes(query),
        );
    }, [accounts, search]);

    const pageCount = Math.max(
        1,
        Math.ceil(filteredAccounts.length / PAGE_SIZE),
    );

    const accountPages = useMemo(
        () =>
            Array.from({ length: pageCount }, (_, pageIndex) =>
                filteredAccounts.slice(
                    pageIndex * PAGE_SIZE,
                    (pageIndex + 1) * PAGE_SIZE,
                ),
            ),
        [filteredAccounts, pageCount],
    );

    const activePage = Math.min(currentPage, pageCount);
    const pageWidth = `${100 / pageCount}%`;
    const trackOffset = `${((activePage - 1) * 100) / pageCount}%`;

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

    const handleCreate = (newAccount) => {
        setAccounts((currentAccounts) => [
            ...currentAccounts,
            normalizeAccount({
                id: Date.now(),
                name: newAccount.name,
                email: newAccount.email,
                role: roleToSlug(newAccount.role),
                created_at: new Date().toISOString(),
                protected: false,
            }),
        ]);

        setCurrentPage(1);
        setShowCreateModal(false);
    };

    const handleUpdate = (updatedAccount) => {
        setAccounts((currentAccounts) =>
            currentAccounts.map((account) =>
                account.id === updatedAccount.id
                    ? normalizeAccount({
                          ...account,
                          name: updatedAccount.name,
                          email: updatedAccount.email,
                          role: roleToSlug(updatedAccount.role),
                      })
                    : account,
            ),
        );

        setEditingAccount(null);
    };

    const handleDeleteRequest = (event, account) => {
        event.stopPropagation();

        if (!isProtectedAccount(account)) {
            setDeleteAccount(account);
        }
    };

    const handleDeleteConfirm = () => {
        if (!deleteAccount) {
            return;
        }

        setAccounts((currentAccounts) =>
            currentAccounts.filter(
                (account) => account.id !== deleteAccount.id,
            ),
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

    return {
        accountPages,
        activePage,
        currentPage,
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
    };
}

