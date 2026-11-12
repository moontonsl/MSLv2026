import AwardsShell from '@/Components/NetworkAwards/AwardsShell';
import NomineeCard from '@/Components/NetworkAwards/NomineeCard';
import VoteConfirmModal from '@/Components/NetworkAwards/VoteConfirmModal';
import VoteSubmittedModal from '@/Components/NetworkAwards/VoteSubmittedModal';
import { getNetworkAwardsCategory } from '@/data/networkAwardsData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

/**
 * MSL Network Awards — per-category voting (Figma mobile + desktop).
 *
 * @param {{ category?: string }} props
 */
export default function Voting({
    category: categoryId = 'organization-of-the-year',
}) {
    const category = useMemo(
        () => getNetworkAwardsCategory(categoryId),
        [categoryId],
    );

    const [selectedId, setSelectedId] = useState(
        () => category.nominees[1]?.id ?? category.nominees[0]?.id ?? null,
    );
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [submittedOpen, setSubmittedOpen] = useState(false);

    useEffect(() => {
        setSelectedId(
            category.nominees[1]?.id ?? category.nominees[0]?.id ?? null,
        );
        setConfirmOpen(false);
        setSubmittedOpen(false);
    }, [category]);

    const total = category.nominees.length;

    const handleSubmit = () => {
        if (!selectedId) return;
        setConfirmOpen(true);
    };

    const handleConfirmVote = () => {
        setConfirmOpen(false);
        setSubmittedOpen(true);
    };

    const handleNominateAgain = () => {
        setSubmittedOpen(false);
        setSelectedId(null);
        router.visit('/MNA');
    };

    const handleDone = () => {
        setSubmittedOpen(false);
        router.visit('/MNA');
    };

    return (
        <MainLayout fullWidth>
            <Head title={`MSL Network Awards — ${category.title}`} />

            <AwardsShell showBack backHref="/MNA">
                <h1 className="mt-6 text-center text-xl font-semibold text-white sm:mt-8 sm:text-2xl lg:text-3xl">
                    {category.title}
                </h1>

                <div className="mt-8 grid grid-cols-2 justify-items-center gap-3 sm:mt-10 sm:gap-4 md:gap-5 lg:flex lg:flex-wrap lg:justify-center lg:gap-6">
                    {category.nominees.map((nominee, index) => {
                        const selected = selectedId === nominee.id;
                        const dimmed = Boolean(selectedId) && !selected;
                        const isLastOdd =
                            index === total - 1 && total % 2 === 1;

                        return (
                            <NomineeCard
                                key={nominee.id}
                                nominee={nominee}
                                type={category.type}
                                selected={selected}
                                dimmed={dimmed}
                                className={
                                    isLastOdd
                                        ? 'col-span-2 max-w-[calc(50%-0.375rem)] sm:max-w-[calc(50%-0.5rem)] lg:col-span-1 lg:max-w-[260px]'
                                        : 'max-w-none lg:max-w-[260px]'
                                }
                                onSelect={() => setSelectedId(nominee.id)}
                            />
                        );
                    })}
                </div>

                <div className="mt-10 flex justify-center sm:mt-12">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!selectedId}
                        className="inline-flex min-h-[48px] w-full max-w-md items-center justify-center rounded-lg bg-[#FBBF24] px-10 text-base font-bold text-black transition-colors hover:bg-[#FCD34D] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[280px]"
                    >
                        Submit
                    </button>
                </div>
            </AwardsShell>

            <VoteConfirmModal
                isOpen={confirmOpen}
                onConfirm={handleConfirmVote}
                onCancel={() => setConfirmOpen(false)}
            />

            <VoteSubmittedModal
                isOpen={submittedOpen}
                onYes={handleNominateAgain}
                onNo={handleDone}
            />
        </MainLayout>
    );
}
