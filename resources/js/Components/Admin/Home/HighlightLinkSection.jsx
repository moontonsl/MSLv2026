import AdminFieldLabel from '@/Components/Admin/AdminFieldLabel';
import { ADMIN_INPUT_CLASS } from '@/Components/Admin/adminFormStyles';
import SectionCard from '@/Components/Admin/SectionCard';

const FIELDS = [
    { id: 'highlight-title', label: 'Title', placeholder: 'e.g. Jollibee Collaboration' },
    { id: 'highlight-article', label: 'Name of Article', placeholder: 'e.g. Jollibee Collaboration' },
    { id: 'highlight-link', label: 'Link of Article', placeholder: 'https://example.com/article' },
];

export default function HighlightLinkSection() {
    return (
        <SectionCard title="Highlight Link" description="Simple description here">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {FIELDS.map(({ id, label, placeholder }) => (
                    <div key={id}>
                        <AdminFieldLabel htmlFor={id}>{label}</AdminFieldLabel>
                        <input
                            id={id}
                            type="text"
                            placeholder={placeholder}
                            className={ADMIN_INPUT_CLASS}
                        />
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}
