import AwardCategoryCard from '@/Components/NetworkAwards/AwardCategoryCard';
import AwardsShell from '@/Components/NetworkAwards/AwardsShell';
import { ORGANIZATION_AWARD_CATEGORIES } from '@/data/networkAwardsData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';

/**
 * Organization awards category grid (Figma Organization — mobile 2-col + last centered).
 */
export default function OrganizationNominations() {
    const total = ORGANIZATION_AWARD_CATEGORIES.length;

    return (
        <MainLayout fullWidth>
            <Head title="MSL Network Organization Awards Nomination" />

            <AwardsShell showBack backHref="/Awards">
                <h1 className="mt-6 text-center text-xl font-semibold text-white sm:mt-8 sm:text-2xl lg:text-3xl">
                    MSL Network Organization Awards Nomination
                </h1>

                <div className="mt-8 grid grid-cols-2 justify-items-center gap-3 sm:mt-10 sm:gap-4 md:gap-5 lg:flex lg:flex-wrap lg:justify-center lg:gap-6">
                    {ORGANIZATION_AWARD_CATEGORIES.map((category, index) => {
                        const isLastOdd =
                            index === total - 1 && total % 2 === 1;

                        return (
                            <AwardCategoryCard
                                key={category.id}
                                label={category.label}
                                image={category.image}
                                className={
                                    isLastOdd
                                        ? 'col-span-2 max-w-[calc(50%-0.375rem)] sm:max-w-[calc(50%-0.5rem)] lg:col-span-1 lg:max-w-[220px]'
                                        : 'max-w-none lg:max-w-[220px]'
                                }
                                onClick={() =>
                                    router.visit(
                                        `/Awards/Nominate/${category.formId}`,
                                    )
                                }
                            />
                        );
                    })}
                </div>
            </AwardsShell>
        </MainLayout>
    );
}
