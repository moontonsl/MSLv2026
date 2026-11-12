import AwardsShell from '@/Components/NetworkAwards/AwardsShell';
import VoteSubmittedModal from '@/Components/NetworkAwards/VoteSubmittedModal';
import { getNominationForm } from '@/data/networkAwardsData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const FIELD_CLASS =
    'w-full rounded-lg border border-[#FBBF24] bg-transparent px-4 py-3 text-sm text-[#FBBF24] placeholder:text-[#FBBF24]/55 outline-none transition focus:border-[#FCD34D] focus:ring-1 focus:ring-[#FBBF24]';

/**
 * Nomination form (Figma mobile: stacked, no category title; desktop: title + 2-col).
 *
 * @param {{ category?: string }} props
 */
export default function Nominate({
    category: categoryId = 'student-talent-of-the-year',
}) {
    const form = useMemo(() => getNominationForm(categoryId), [categoryId]);

    const [values, setValues] = useState(() =>
        Object.fromEntries(form.fields.map((field) => [field.name, ''])),
    );
    const [submittedOpen, setSubmittedOpen] = useState(false);

    useEffect(() => {
        setValues(
            Object.fromEntries(form.fields.map((field) => [field.name, ''])),
        );
        setSubmittedOpen(false);
    }, [form]);

    const backHref =
        form.track === 'organization'
            ? '/Awards/Organization'
            : '/Awards/Individual';

    const setField = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmittedOpen(true);
    };

    const handleNominateAgain = () => {
        setSubmittedOpen(false);
        router.visit('/Awards#nominations');
    };

    const handleDone = () => {
        setSubmittedOpen(false);
        router.visit('/Awards');
    };

    return (
        <MainLayout fullWidth>
            <Head title={`MSL Network Awards — ${form.title}`} />

            <AwardsShell showBack backHref={backHref}>
                {/* Desktop Form_-_*_Awards only */}
                <h1 className="mt-8 hidden text-center text-2xl font-semibold text-white sm:text-3xl lg:block">
                    {form.title}
                </h1>

                <div className="mt-6 grid gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-12">
                    <div className="space-y-4 sm:space-y-5">
                        <h2 className="text-xl font-semibold text-white sm:text-2xl">
                            {form.headline}
                        </h2>
                        <p className="text-sm leading-relaxed text-white sm:text-base">
                            {form.description}
                        </p>
                        <div>
                            <h3 className="text-base font-semibold text-white">
                                Detailed Criteria and Mechanics:
                            </h3>
                            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-white sm:text-base">
                                {form.criteria.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="rounded-xl border border-[#FBBF24]/80 bg-[#121212] p-4 sm:p-6"
                    >
                        <div className="space-y-5">
                            {form.fields.map((field) => (
                                <div key={field.name} className="space-y-2">
                                    <label
                                        htmlFor={`nominate-${field.name}`}
                                        className="block text-sm font-semibold text-[#FBBF24]"
                                    >
                                        {field.label}
                                    </label>

                                    {field.type === 'textarea' ? (
                                        <textarea
                                            id={`nominate-${field.name}`}
                                            name={field.name}
                                            rows={5}
                                            placeholder={field.placeholder}
                                            value={values[field.name] ?? ''}
                                            onChange={(event) =>
                                                setField(
                                                    field.name,
                                                    event.target.value,
                                                )
                                            }
                                            className={`${FIELD_CLASS} resize-y`}
                                        />
                                    ) : null}

                                    {field.type === 'select' ? (
                                        <div className="relative">
                                            <select
                                                id={`nominate-${field.name}`}
                                                name={field.name}
                                                value={values[field.name] ?? ''}
                                                onChange={(event) =>
                                                    setField(
                                                        field.name,
                                                        event.target.value,
                                                    )
                                                }
                                                className={`${FIELD_CLASS} appearance-none pr-10`}
                                            >
                                                <option value="" disabled>
                                                    {field.placeholder}
                                                </option>
                                                {(field.options ?? []).map(
                                                    (option) => (
                                                        <option
                                                            key={option}
                                                            value={option}
                                                            className="bg-[#121212] text-white"
                                                        >
                                                            {option}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                            <ChevronDown
                                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FBBF24]"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    ) : null}

                                    {field.type === 'text' ? (
                                        <input
                                            id={`nominate-${field.name}`}
                                            name={field.name}
                                            type="text"
                                            placeholder={field.placeholder}
                                            value={values[field.name] ?? ''}
                                            onChange={(event) =>
                                                setField(
                                                    field.name,
                                                    event.target.value,
                                                )
                                            }
                                            className={FIELD_CLASS}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#FBBF24] px-6 text-base font-bold text-black transition-colors hover:bg-[#FCD34D]"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </AwardsShell>

            <VoteSubmittedModal
                isOpen={submittedOpen}
                onYes={handleNominateAgain}
                onNo={handleDone}
            />
        </MainLayout>
    );
}
