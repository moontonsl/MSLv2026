import AwardsFaq from '@/Components/NetworkAwards/AwardsFaq';
import AwardsShell from '@/Components/NetworkAwards/AwardsShell';
import NominationTrackCard from '@/Components/NetworkAwards/NominationTrackCard';
import VerifyMlbbModal from '@/Components/NetworkAwards/VerifyMlbbModal';
import {
    NETWORK_AWARDS_ABOUT,
    NETWORK_AWARDS_FAQS,
    NOMINATION_TRACKS,
} from '@/data/networkAwardsData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

/**
 * MSL Network Awards landing (Figma Homepage mobile + desktop).
 */
export default function Index() {
    const [verifyOpen, setVerifyOpen] = useState(false);
    const [pendingHref, setPendingHref] = useState(null);

    const openVerify = (href) => {
        setPendingHref(href);
        setVerifyOpen(true);
    };

    const handleContinue = () => {
        setVerifyOpen(false);
        if (pendingHref) {
            router.visit(pendingHref);
        }
        setPendingHref(null);
    };

    const handleCancel = () => {
        setVerifyOpen(false);
        setPendingHref(null);
    };

    return (
        <MainLayout fullWidth>
            <Head title="MSL Network Awards" />

            <AwardsShell>
                {/* Desktop homepage nav only */}
                <nav
                    aria-label="Network Awards sections"
                    className="mt-6 hidden flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-[#D1D5DB] lg:flex"
                >
                    <a
                        href="#about"
                        className="transition-colors hover:text-[#FBBF24]"
                    >
                        About MSL Network Awards
                    </a>
                    <a
                        href="#nominations"
                        className="transition-colors hover:text-[#FBBF24]"
                    >
                        Nominations
                    </a>
                    <a
                        href="#faqs"
                        className="transition-colors hover:text-[#FBBF24]"
                    >
                        FAQs
                    </a>
                </nav>

                <section
                    id="about"
                    className="mx-auto mt-8 max-w-3xl scroll-mt-28 text-center sm:mt-12 lg:mt-16"
                >
                    <h1 className="text-xl font-semibold text-white sm:text-2xl lg:text-3xl">
                        About MSL Network Awards
                    </h1>
                    <p className="mt-4 text-sm leading-relaxed text-white sm:mt-5 sm:text-base sm:leading-7">
                        {NETWORK_AWARDS_ABOUT}
                    </p>
                </section>

                <section
                    id="nominations"
                    className="mt-10 scroll-mt-28 sm:mt-14 lg:mt-20"
                >
                    <h2 className="text-center text-xl font-semibold text-white sm:text-2xl lg:text-3xl">
                        MSL Network Awards Nomination
                    </h2>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 lg:mx-auto lg:flex lg:max-w-3xl lg:justify-center lg:gap-8">
                        {NOMINATION_TRACKS.map((track) => (
                            <NominationTrackCard
                                key={track.id}
                                label={track.label}
                                image={track.image}
                                onClick={() => openVerify(track.href)}
                            />
                        ))}
                    </div>
                </section>

                <section id="faqs" className="mt-12 scroll-mt-28 sm:mt-16 lg:mt-24">
                    <h2 className="mb-6 text-center text-xl font-semibold text-white sm:mb-10 sm:text-2xl lg:text-3xl">
                        Frequently Asked Questions
                    </h2>
                    <AwardsFaq items={NETWORK_AWARDS_FAQS} />
                </section>
            </AwardsShell>

            <VerifyMlbbModal
                isOpen={verifyOpen}
                onContinue={handleContinue}
                onCancel={handleCancel}
            />
        </MainLayout>
    );
}
