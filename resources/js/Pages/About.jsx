import {
    CORE_VALUES,
    NATIONAL_ADMINS,
    ORGANIZATION_DEPARTMENTS,
} from '@/data/aboutData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { MSL_NETWORK_HREF } from '@/data/siteNavigation';

export default function About() {
    return (
        <MainLayout fullWidth>
            <Head title="About Us" />

            <div className="min-h-screen bg-bg py-4 font-sans text-white sm:py-8 lg:py-12">
                <div className="mx-auto max-w-7xl space-y-12 px-5 sm:space-y-16 sm:px-6 lg:space-y-20">
                    <section className="border-b border-white/10 pb-6 sm:pb-8">
                        <div className="mb-3 flex justify-start">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="flex min-h-11 items-center gap-2 text-body-sm text-gray-100 transition-colors hover:text-brand-400"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Back to Previous
                            </button>
                        </div>

                        <div className="text-center sm:mt-8">
                            <h1 className="mb-6 text-subsection font-bold sm:text-4xl md:text-5xl">
                                More Than Just{' '}
                                <span className="text-[#FBBF24]">A Game</span>
                            </h1>
                            <p className="mx-auto max-w-3xl text-body-sm text-gray-200 sm:text-body-md">
                                Moonton Student Leaders (MSL) PH is the official student body
                                powered by Moonton Games. We unite campus communities across
                                the Philippines, empowering student leaders to grow through
                                esports, collaboration, and service—proving that passion for
                                Mobile Legends can go hand-in-hand with leadership and academic
                                excellence.
                            </p>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                        <article className="flex min-h-56 flex-col rounded-xl border border-brand-500/30 bg-bg-surface p-6 transition-colors hover:border-brand-500/50 sm:p-8 lg:p-10">
                            <h2 className="mb-3 text-body-md font-bold sm:text-card-title">
                                Our <span className="text-[#FBBF24]">Mission</span>
                            </h2>
                            <p className="text-body-sm text-gray-200 sm:text-body-md">
                                To empower student leaders across the Philippines by
                                creating inclusive campus initiatives, meaningful esports
                                experiences, and platforms where young leaders can grow,
                                serve their communities, and represent their schools with
                                pride.
                            </p>
                        </article>
                        <article className="flex min-h-56 flex-col rounded-xl border border-brand-500/30 bg-bg-surface p-6 transition-colors hover:border-brand-500/50 sm:p-8 lg:p-10">
                            <h2 className="mb-3 text-body-md font-bold sm:text-card-title">
                                Our <span className="text-[#FBBF24]">Vision</span>
                            </h2>
                            <p className="text-body-sm text-gray-200 sm:text-body-md">
                                To be the leading student-led esports organization in the
                                Philippines—recognized for developing responsible leaders,
                                thriving campus communities, and a culture where gaming,
                                academics, and service move forward together.
                            </p>
                        </article>
                    </section>

                    <section>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white md:text-4xl">
                                Our Core Values
                            </h2>
                            <p className="mx-auto mt-3 max-w-2xl text-body-sm text-gray-200 sm:text-body-md">
                                The principles that guide how we lead, collaborate, and
                                serve our communities every day.
                            </p>
                        </div>
                        <div className="mt-10 flex flex-wrap justify-center gap-5 md:gap-6">
                            {CORE_VALUES.map((value) => (
                                <article
                                    key={value.title}
                                    className="flex min-h-44 w-[calc(50%-0.625rem)] flex-col rounded-xl border border-brand-500/30 bg-bg-surface p-4 sm:min-h-48 sm:p-6 md:w-[calc(33.333333%-1rem)] lg:w-[calc(25%-1.125rem)]"
                                >
                                    <h3 className="mb-3 text-body-sm font-bold text-white sm:text-body-md">
                                        {value.title}
                                    </h3>
                                    <p className="text-body-xs text-gray-200 sm:text-body-sm">
                                        {value.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white md:text-4xl">
                                Our Organization
                            </h2>
                            <p className="mx-auto mt-3 max-w-2xl text-body-sm text-gray-200 sm:text-body-md">
                                MSL PH is organized into specialized departments, each
                                driving impact across campuses, content, partnerships, and
                                operations.
                            </p>
                        </div>
                        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                            {ORGANIZATION_DEPARTMENTS.map((dept) => (
                                <article
                                    key={dept.title}
                                    className="flex min-h-80 flex-col rounded-xl border border-brand-500/30 bg-bg-surface p-6 transition-colors hover:border-brand-500/50 sm:p-8"
                                >
                                    <h3 className="text-body-md font-bold text-white sm:text-xl">
                                        {dept.title}
                                    </h3>
                                    <p className="mt-4 text-body-sm text-gray-200">
                                        {dept.description}
                                    </p>
                                    <ul className="mt-6 space-y-4">
                                        {dept.items.map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-start gap-2 text-body-sm text-gray-200"
                                            >
                                                <span
                                                    className={`mt-2 h-1 w-1 shrink-0 rounded-full ${dept.bulletColor}`}
                                                />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="text-center">
                            <h2 className="mb-4 text-3xl font-bold">
                                Meet Our National Admin
                            </h2>
                            <p className="mx-auto mb-10 max-w-xl text-body-sm text-gray-200 sm:text-body-md">
                                The core team dedicated to serving the student-gaming
                                community across the Philippines.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                            {NATIONAL_ADMINS.map((admin) => (
                                <article
                                    key={`${admin.name}-${admin.roleLines.join('-')}`}
                                    className="group overflow-hidden rounded-xl border border-brand-500/20 bg-bg-surface"
                                >
                                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-800">
                                        <img
                                            src={admin.image}
                                            alt={admin.name}
                                            className="h-full w-full object-cover object-top"
                                        />
                                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#0A0A0A] to-transparent p-3 sm:p-4">
                                            <h3 className="mb-0.5 text-body-xs font-normal text-white sm:mb-1 sm:text-base sm:font-bold">
                                                {admin.name}
                                            </h3>
                                            <p
                                                className={`text-[8px] font-bold uppercase leading-tight tracking-wider sm:text-[10px] ${admin.roleColor}`}
                                            >
                                                {admin.roleLines.map((line, index) => (
                                                    <span key={line}>
                                                        {index > 0 ? <br /> : null}
                                                        {line}
                                                    </span>
                                                ))}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="relative flex min-h-44 flex-col justify-center overflow-hidden rounded-xl border border-gray-500/50 bg-gradient-to-b from-[#111111] to-[#1a0b2e] px-6 py-10 text-center sm:p-12">
                        <h2 className="relative z-10 mb-4 text-body-sm font-bold text-white sm:mb-6 sm:text-card-title">
                            Ready to Lead?
                        </h2>
                        <div className="relative z-10 mx-auto flex w-full max-w-md items-stretch justify-center gap-3">
                            <Link
                                href="/"
                                className="flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-md border border-brand-400 bg-brand-400 px-2 py-2 text-body-xs font-bold text-black transition-colors hover:bg-brand-300 sm:px-6 sm:py-3 sm:text-body-sm"
                            >
                                Contact Us
                            </Link>
                            <Link
                                href={MSL_NETWORK_HREF}
                                className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white/5 px-2 py-2 text-body-xs font-bold text-white transition-colors hover:bg-white/10 sm:px-6 sm:py-3 sm:text-body-sm"
                            >
                                View Programs
                                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </MainLayout>
    );
}
