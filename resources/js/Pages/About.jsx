import {
    CORE_VALUES,
    NATIONAL_ADMINS,
    ORGANIZATION_DEPARTMENTS,
} from '@/data/aboutData';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, ChevronLeft } from 'lucide-react';

export default function About() {
    return (
        <MainLayout fullWidth>
            <Head title="About Us" />

            <div className="min-h-screen bg-[#0A0A0A] py-20 px-4 font-sans text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-16 sm:space-y-24">
                    <div className="mb-8 flex justify-start">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-[#FBBF24]"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back to Previous
                        </button>
                    </div>

                    <section className="text-center">
                        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
                            More Than Just{' '}
                            <span className="text-[#FBBF24]">A Game</span>
                        </h1>
                        <p className="mx-auto max-w-3xl leading-relaxed text-gray-400">
                            Moonton Student Leaders (MSL) PH is the official student body
                            powered by Moonton Games. We unite campus communities across
                            the Philippines, empowering student leaders to grow through
                            esports, collaboration, and service—proving that passion for
                            Mobile Legends can go hand-in-hand with leadership and academic
                            excellence.
                        </p>
                    </section>

                    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                        <article className="rounded-2xl border border-neutral-800 bg-[#111111] p-8 transition-colors hover:border-neutral-700 md:p-10">
                            <h2 className="mb-4 text-3xl font-bold">
                                Our <span className="text-[#FBBF24]">Mission</span>
                            </h2>
                            <p className="text-sm leading-relaxed text-gray-400 md:text-base">
                                To empower student leaders across the Philippines by
                                creating inclusive campus initiatives, meaningful esports
                                experiences, and platforms where young leaders can grow,
                                serve their communities, and represent their schools with
                                pride.
                            </p>
                        </article>
                        <article className="rounded-2xl border border-neutral-800 bg-[#111111] p-8 transition-colors hover:border-neutral-700 md:p-10">
                            <h2 className="mb-4 text-3xl font-bold">
                                Our <span className="text-[#FBBF24]">Vision</span>
                            </h2>
                            <p className="text-sm leading-relaxed text-gray-400 md:text-base">
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
                            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400 md:text-base">
                                The principles that guide how we lead, collaborate, and
                                serve our communities every day.
                            </p>
                        </div>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            {CORE_VALUES.map((value) => (
                                <article
                                    key={value.title}
                                    className="w-[calc(50%-0.5rem)] rounded-xl border border-neutral-800 bg-[#111111] p-5 md:w-[calc(25%-0.75rem)] xl:w-[300px]"
                                >
                                    <h3 className="mb-2 text-sm font-bold text-white">
                                        {value.title}
                                    </h3>
                                    <p className="text-xs leading-relaxed text-gray-400">
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
                            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400 md:text-base">
                                MSL PH is organized into specialized departments, each
                                driving impact across campuses, content, partnerships, and
                                operations.
                            </p>
                        </div>
                        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                            {ORGANIZATION_DEPARTMENTS.map((dept) => (
                                <article
                                    key={dept.title}
                                    className="rounded-2xl border border-neutral-800 bg-[#111111] p-8 transition-colors hover:border-neutral-700"
                                >
                                    <h3 className="text-xl font-bold text-white">
                                        {dept.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-gray-400">
                                        {dept.description}
                                    </p>
                                    <ul className="mt-6 space-y-3">
                                        {dept.items.map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-center gap-3 text-sm text-gray-300"
                                            >
                                                <span
                                                    className={`h-2 w-2 shrink-0 rounded-full ${dept.bulletColor}`}
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
                            <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-gray-400">
                                The core team dedicated to serving the student-gaming
                                community across the Philippines.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4">
                            {NATIONAL_ADMINS.map((admin) => (
                                <article
                                    key={`${admin.name}-${admin.roleLines.join('-')}`}
                                    className="group overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111]"
                                >
                                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-800">
                                        <img
                                            src={admin.image}
                                            alt={admin.name}
                                            className="h-full w-full object-cover object-top"
                                        />
                                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#0A0A0A] to-transparent p-2 sm:p-4">
                                            <h3 className="mb-0.5 text-xs font-bold text-white sm:mb-1 sm:text-base">
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

                    <section className="relative mt-20 overflow-hidden rounded-2xl border border-neutral-800/50 bg-gradient-to-b from-[#111111] to-[#1a0b2e] p-6 text-center shadow-2xl sm:mt-32 sm:rounded-3xl sm:p-12 md:p-20">
                        <h2 className="relative z-10 mb-6 text-2xl font-bold text-white sm:mb-8 sm:text-3xl md:text-4xl">
                            Ready to Lead?
                        </h2>
                        <div className="relative z-10 flex flex-row items-center justify-center gap-2 sm:gap-4">
                            <Link
                                href="/programs/msl-network"
                                className="rounded-lg bg-[#FBBF24] px-4 py-2 text-xs font-bold text-black transition-all hover:brightness-110 sm:px-8 sm:py-3 sm:text-base"
                            >
                                View Programs
                            </Link>
                            <Link
                                href="/"
                                className="flex items-center justify-center gap-2 rounded-lg border border-gray-500 bg-transparent px-4 py-2 text-xs font-bold text-white transition-all hover:bg-white/5 sm:px-8 sm:py-3 sm:text-base"
                            >
                                Contact Us
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </MainLayout>
    );
}
