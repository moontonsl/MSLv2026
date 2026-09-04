export const PAGE_SIZE = 5;

export function getRole(account) {
    return account.role ?? account.user_type ?? "admin";
}

export function roleToSlug(role) {
    return String(role ?? "admin")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
}

export function isProtectedAccount(account) {
    return (
        account.protected === true ||
        account.email === "admin@msl.com" ||
        roleToSlug(getRole(account)) === "super_admin"
    );
}

export function formatDate(value) {
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

export function normalizeAccount(account) {
    return {
        ...account,
        name: account.name ?? "",
        email: account.email ?? "",
        role: getRole(account),
        created_at:
            account.created_at ?? account.createdAt ?? new Date().toISOString(),
        protected: isProtectedAccount(account),
    };
}

