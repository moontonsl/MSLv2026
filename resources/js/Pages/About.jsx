import {
    CORE_VALUES,
    NATIONAL_ADMINS,
    ORGANIZATION_DEPARTMENTS,
    SOFTWARE_ENGINEERING_DIVISION,
} from '@/data/aboutData';
import MainLayout from '@/Layouts/MainLayout';
import portraitStyles from './GeneralAffairs/GeneralAffairs.module.css';
import { Head } from '@inertiajs/react';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import HoverOutline from '@/Components/HoverOutline';
import SoftwareEngineeringTeam from '@/Components/SoftwareEngineeringTeam';
import { ButtonLink } from '@/Pages/Home/Components/HomeUI';
import { MSL_NETWORK_HREF, PUBLIC_ROUTES } from '@/data/siteNavigation';

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
                                className="flex min-h-11 items-center gap-2 text-body-sm text-gray-100 transition-colors hover:text-[#F2C21A]"
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
                        <article className="relative flex min-h-56 flex-col rounded-2xl border border-white/10 bg-bg-surface transition-colors hover:bg-bg-cardHover p-6 sm:p-8 lg:p-10">
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
                            <HoverOutline color="#F2C21A" />
                        </article>
                        <article className="relative flex min-h-56 flex-col rounded-2xl border border-white/10 bg-bg-surface transition-colors hover:bg-bg-cardHover p-6 sm:p-8 lg:p-10">
                            <h2 className="mb-3 text-body-md font-bold sm:text-card-title">
                                Our <span className="text-[#FBBF24]">Vision</span>
                            </h2>
                            <p className="text-body-sm text-gray-200 sm:text-body-md">
                                To be the leading student-led esports organization in the
                                Philippines—recognized for developing responsible leaders,
                                thriving campus communities, and a culture where gaming,
                                academics, and service move forward together.
                            </p>
                            <HoverOutline color="#F2C21A" />
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
                                    className="relative flex min-h-44 w-[calc(50%-0.625rem)] flex-col rounded-2xl border border-white/10 bg-bg-surface transition-colors hover:bg-bg-cardHover p-4 sm:min-h-48 sm:p-6 md:w-[calc(33.333333%-1rem)] lg:w-[calc(25%-1.125rem)]"
                                >
                                    <h3 className="mb-3 text-body-sm font-bold text-white sm:text-body-md">
                                        {value.title}
                                    </h3>
                                    <p className="text-body-xs text-gray-200 sm:text-body-sm">
                                        {value.description}
                                    </p>
                                    <HoverOutline color="#F2C21A" />
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
                                    style={{ '--dept-accent': dept.accentColor }}
                                    className="relative flex min-h-80 flex-col rounded-2xl border border-white/10 bg-bg-surface transition-colors hover:bg-bg-cardHover p-6 sm:p-8"
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
                                    <HoverOutline color="var(--dept-accent)" />
                                </article>
                            ))}
                        </div>
                    </section>

                    <section id="department-heads">
                        <div className="text-center">
                            <h2 className="mb-4 text-3xl font-bold">
                                Meet Our Department Heads
                            </h2>
                            <p className="mx-auto mb-10 max-w-xl text-body-sm text-gray-200 sm:text-body-md">
                                The core team dedicated to serving the student-gaming
                                community across the Philippines.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {NATIONAL_ADMINS.map((admin) => (
                                <article
                                    key={`${admin.name}-${admin.roleLines.join('-')}`}
                                    className="relative group w-[calc(50%-0.75rem)] overflow-hidden rounded-2xl border border-white/10 bg-bg-surface transition-colors hover:bg-bg-cardHover md:w-[calc(33.333333%-1rem)] lg:w-[calc(25%-1.125rem)]"
                                >
                                    <div className={`portrait-glass ${portraitStyles.teamPortrait} relative aspect-[3/4] w-full overflow-hidden`}>
                                        {admin.image ? <img
                                            src={admin.image}
                                            alt={admin.name}
                                            style={admin.portraitFrame}
                                            loading="lazy"
                                            className={portraitStyles.teamPortraitImage}
                                        /> : <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-[#F2C21A] text-7xl font-extrabold text-black/70">{admin.name.charAt(0)}</span>}
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
                                    <HoverOutline color="#F2C21A" />
                                </article>
                            ))}
                        </div>
                    </section>

                    <section aria-label="Software Engineering Division">
                        <SoftwareEngineeringTeam division={SOFTWARE_ENGINEERING_DIVISION} />
                    </section>

                    <section className="relative flex min-h-44 flex-col justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#111111] to-[#1a0b2e] px-6 py-10 text-center sm:p-12">
                        <h2 className="relative z-10 mb-4 text-body-sm font-bold text-white sm:mb-6 sm:text-card-title">
                            Ready to Lead?
                        </h2>
                        <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:flex-row">
                            <ButtonLink href={PUBLIC_ROUTES.contact} className="min-w-0 flex-1">
                                Contact Us
                            </ButtonLink>
                            <ButtonLink href={MSL_NETWORK_HREF} variant="secondary" className="min-w-0 flex-1">
                                View Programs
                                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                            </ButtonLink>
                        </div>
                    </section>
                </div>
            </div>
        </MainLayout>
    );
}
