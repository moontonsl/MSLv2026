export const ADMIN_PAGE_SIZE = 5;

export const ADMIN_ROLE_OPTIONS = [
    {
        value: "admin",
        label: "Admin",
    },
    {
        value: "content_admin",
        label: "Content Manager",
    },
    {
        value: "regional_admin",
        label: "Regional Admin",
    },
    {
        value: "event_admin",
        label: "Event Manager",
    },
    {
        value: "super_admin",
        label: "Super Admin",
    },
];

export const ADMIN_ROLE_LABELS = Object.fromEntries(
    ADMIN_ROLE_OPTIONS.map(({ value, label }) => [value, label]),
);

export const MOCK_ADMIN_ACCOUNTS = [
    {
        id: "admin-001",
        name: "Super Admin",
        email: "admin@msl.com",
        role: "super_admin",
        created_at: "2026-08-27T00:00:00+08:00",
        protected: true,
    },
    {
        id: "admin-002",
        name: "Content Manager",
        email: "content@msl.com",
        role: "content_admin",
        created_at: "2026-08-27T00:00:00+08:00",
        protected: false,
    },
    {
        id: "admin-003",
        name: "Crisostomo Ibarra",
        email: "crisostomo.ibarra@msl.com",
        role: "admin",
        created_at: "2026-08-28T00:00:00+08:00",
        protected: false,
    },
    {
        id: "admin-004",
        name: "Maria Clara",
        email: "maria.clara@msl.com",
        role: "regional_admin",
        created_at: "2026-08-29T00:00:00+08:00",
        protected: false,
    },
    {
        id: "admin-005",
        name: "Elias Santos",
        email: "elias.santos@msl.com",
        role: "event_admin",
        created_at: "2026-08-30T00:00:00+08:00",
        protected: false,
    },
    {
        id: "admin-006",
        name: "Jose Rizal",
        email: "jose.rizal@msl.com",
        role: "content_admin",
        created_at: "2026-08-31T00:00:00+08:00",
        protected: false,
    },
    {
        id: "admin-007",
        name: "Andres Bonifacio",
        email: "andres.bonifacio@msl.com",
        role: "regional_admin",
        created_at: "2026-09-01T00:00:00+08:00",
        protected: false,
    },
    {
        id: "admin-008",
        name: "Gabriela Silang",
        email: "gabriela.silang@msl.com",
        role: "event_admin",
        created_at: "2026-09-02T00:00:00+08:00",
        protected: false,
    },
    {
        id: "admin-009",
        name: "Apolinario Mabini",
        email: "apolinario.mabini@msl.com",
        role: "admin",
        created_at: "2026-09-03T00:00:00+08:00",
        protected: false,
    },
    {
        id: "admin-010",
        name: "Melchora Aquino",
        email: "melchora.aquino@msl.com",
        role: "content_admin",
        created_at: "2026-09-04T00:00:00+08:00",
        protected: false,
    },
];
