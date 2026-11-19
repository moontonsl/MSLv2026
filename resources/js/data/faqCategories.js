import { ArrowLeftRight, Building2, Contact, Handshake, MessagesSquare, School, UserRound, Workflow } from 'lucide-react';

// FAQ page categories (order matches the "FAQ web" / "FAQ mobile" designs).
// `id` is the value stored in the FAQ's `category` column (Admin > FAQ).
export const FAQ_PAGE_CATEGORIES = [
    { id: 'MSL Account', label: 'MSL Account', icon: UserRound },
    { id: 'Campus Tournament', label: 'Campus Tournament', icon: Building2 },
    { id: 'Buff & Support', label: 'Buff & Support', icon: ArrowLeftRight },
    { id: 'The MSL Network', label: 'The MSL Network', icon: MessagesSquare },
    { id: 'Campus', label: 'Campus', icon: School },
    { id: 'Partnership', label: 'Partnership', icon: Handshake },
    { id: 'Content & Social Media', label: 'Content & Social Media', icon: Contact },
    { id: 'General Affairs', label: 'General Affairs', icon: Workflow },
];

// Older admin categories mapped onto the new page categories. Anything not listed
// (e.g. "General") only appears when no category card is selected.
export const LEGACY_FAQ_CATEGORY_MAP = {
    Account: 'MSL Account',
    Registration: 'MSL Account',
    Events: 'Campus Tournament',
};

export const faqPageCategoryOf = (category) => LEGACY_FAQ_CATEGORY_MAP[category] ?? category;
