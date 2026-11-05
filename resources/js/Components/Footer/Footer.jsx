import { Link, usePage } from '@inertiajs/react';
import { comingSoonHref, MSL_NETWORK_HREF } from '@/data/siteNavigation';
import {
    Facebook,
    Youtube,
    ShieldAlert,
    Heart,
    Lock,
    ShieldCheck,
    ScrollText,
    Accessibility,
} from 'lucide-react';

const PROGRAM_LINKS = [
    { label: 'The MSL Network', href: MSL_NETWORK_HREF },
    { label: 'Campus Tournaments', href: '/campus-tournament' },
    { label: 'MCC League', originalHref: '/programs/mcc-league', href: comingSoonHref('mcc-league'), comingSoon: true },
    { label: 'Buffs & Support', href: '/Buffs&Support' },
];

const RESOURCE_LINKS = [
    { label: 'Partner With Us', href: MSL_NETWORK_HREF },
    { label: 'Join the Team', href: '/careers' },
    { label: 'News & Updates', originalHref: '/News', href: comingSoonHref('news'), comingSoon: true },
];

const TRUST_BADGES = [
    {
        Icon: Heart,
        title: 'Safe Space Zone',
        subtitle: 'RA 11313 Compliant',
    },
    {
        Icon: Lock,
        title: 'Data Privacy',
        subtitle: 'Encrypted & Secure',
    },
    {
        Icon: ShieldCheck,
        title: 'Child Protection',
        subtitle: 'Strictly Enforced',
    },
    {
        Icon: ScrollText,
        title: 'Intellectual Property',
        subtitle: 'Moonton Authorized',
    },
    {
        Icon: Accessibility,
        title: 'Accessibility',
        subtitle: 'WCAG 2.1 Level AA',
    },
];

const LEGAL_LINKS = [
    { label: 'Privacy Policy', href: '/PrivacyPolicy' },
    { label: 'Terms of Service', href: '/TermsAndConditions' },
];

function TikTokIcon({ className }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="currentColor"
            aria-hidden
        >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64v-3.4a6.32 6.32 0 0 0-1.13-.1A6.26 6.26 0 0 0 5 20.26a6.26 6.26 0 0 0 10.86-4.26V9.68a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
    );
}

const footerLinkClass =
    'inline-flex w-fit flex-wrap items-center gap-x-2 gap-y-1 rounded-sm text-sm text-gray-400 transition-colors duration-150 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 motion-reduce:transition-none';

function FooterNavLink({ label, href }) {
    return (
        <Link href={href} className={footerLinkClass}>
            <span>{label}</span>
        </Link>
    );
}

const Footer = () => {
    const { footer } = usePage().props;

    const logo = footer?.logo || '/msl-logo.png';
    const facebookUrl = footer?.facebook_url || 'https://www.facebook.com/MSLPhilippines';
    const youtubeUrl = footer?.youtube_url || 'https://www.youtube.com/@MSLPhilippines';
    const tiktokUrl = footer?.tiktok_url || 'https://www.tiktok.com/@mslphilippines';
    const mlbbLogo = footer?.mlbb_logo || '/mlbb-logo.png';
    const moontonLogo = footer?.moonton_logo || '/moonton-logo.png';
    const description = footer?.description || 'The official student leader body of Mobile Legends: Bang Bang in the Philippines.';
    const copyright = footer?.copyright || '© 2026 Moonton Student Leaders Philippines. All rights reserved.';
    const customNavSections = Array.isArray(footer?.nav_sections) && footer.nav_sections.length > 0 ? footer.nav_sections : null;

    const socialBase =
        'inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A] text-white transition-colors';

    return (
        <footer className="relative z-10 border-t border-white/10 bg-black pb-24 pt-16 text-white lg:pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                {/* Desktop: 4-column brand + nav */}
                <div className="hidden gap-10 lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <Link href="/" className="inline-flex">
                            <img
                                src={logo}
                                alt="MSL Philippines"
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                        <p className="mt-5 max-w-xs text-sm leading-relaxed text-gray-400">
                            The official student leader body of Mobile Legends: Bang Bang in the
                            Philippines.
                        </p>
                        <div className="mt-6 flex w-full max-w-xs items-center justify-center gap-8">
                            <a
                                href={facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${socialBase} hover:bg-[#1877F2]`}
                                aria-label="Facebook"
                            >
                                <Facebook className="h-4 w-4" strokeWidth={1.75} />
                            </a>
                            <a
                                href={tiktokUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${socialBase} hover:bg-black hover:ring-1 hover:ring-white/20`}
                                aria-label="TikTok"
                            >
                                <TikTokIcon className="h-4 w-4" />
                            </a>
                            <a
                                href={youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${socialBase} hover:bg-[#FF0000]`}
                                aria-label="YouTube"
                            >
                                <Youtube className="h-4 w-4" strokeWidth={1.75} />
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-bold text-white">Programs</h3>
                        <nav className="mt-5 flex flex-col gap-3" aria-label="Programs">
                            {PROGRAM_LINKS.map((item) => (
                                <FooterNavLink key={item.href} {...item} />
                            ))}
                        </nav>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-bold text-white">Resources</h3>
                        <nav className="mt-5 flex flex-col gap-3" aria-label="Resources">
                            {RESOURCE_LINKS.map((item) => (
                                <FooterNavLink key={item.href} {...item} />
                            ))}
                        </nav>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-bold text-white">Safe Spaces</h3>
                        <Link
                            href="/report-violation"
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-700/80 bg-red-950/40 px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-950/60 hover:text-red-400"
                        >
                            <ShieldAlert className="h-4 w-4 shrink-0" />
                            Report Violation
                        </Link>
                    </div>
                </div>

                {/* Mobile / tablet layout */}
                <div className="lg:hidden">
                    <div className="flex flex-col items-start text-left">
                        <Link href="/" className="inline-flex">
                            <img
                                src={logo}
                                alt="MSL Philippines"
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-400">
                            The official student leader body of Mobile Legends: Bang Bang in the
                            Philippines.
                        </p>

                        <div className="mt-6 flex w-full items-center justify-center gap-8">
                            <a
                                href={facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${socialBase} hover:bg-[#1877F2]`}
                                aria-label="Facebook"
                            >
                                <Facebook className="h-4 w-4" strokeWidth={1.75} />
                            </a>
                            <a
                                href={tiktokUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${socialBase} hover:bg-black hover:ring-1 hover:ring-white/20`}
                                aria-label="TikTok"
                            >
                                <TikTokIcon className="h-4 w-4" />
                            </a>
                            <a
                                href={youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${socialBase} hover:bg-[#FF0000]`}
                                aria-label="YouTube"
                            >
                                <Youtube className="h-4 w-4" strokeWidth={1.75} />
                            </a>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-y-8 text-center">
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold text-white">Programs</h3>
                            <nav className="mt-6 flex flex-col items-center gap-4" aria-label="Programs">
                                {PROGRAM_LINKS.map((item) => (
                                    <FooterNavLink key={item.href} {...item} />
                                ))}
                            </nav>
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold text-white">Resources</h3>
                            <nav className="mt-6 flex flex-col items-center gap-4" aria-label="Resources">
                                {RESOURCE_LINKS.map((item) => (
                                    <FooterNavLink key={item.href} {...item} />
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="mt-10 text-center">
                        <h3 className="text-sm font-bold text-white">Safe Spaces</h3>
                        <Link
                            href="/report-violation"
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-700/80 bg-red-950/40 px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-950/60 hover:text-red-400"
                        >
                            <ShieldAlert className="h-4 w-4 shrink-0" />
                            Report Violation
                        </Link>
                    </div>

                    <div className="mt-8 flex flex-row-reverse items-center justify-center gap-6 border-t border-white/10 pt-8">
                        <img
                            src={moontonLogo}
                            alt="Moonton"
                            className="h-12 w-auto max-w-[72px] object-contain opacity-90"
                        />
                        <img
                            src={mlbbLogo}
                            alt="Mobile Legends: Bang Bang"
                            className="h-12 w-auto max-w-[144px] object-contain opacity-90"
                        />
                    </div>

                    {/* Retained for reactivation; omitted from the mobile reference layout. */}
                    <div className="mt-10 hidden grid-cols-2 gap-x-4 gap-y-6">
                        {TRUST_BADGES.map(({ Icon, title, subtitle }) => (
                            <div key={title} className="flex items-start gap-2.5">
                                <Icon
                                    className="mt-0.5 h-5 w-5 shrink-0 text-[#FFC107]"
                                    strokeWidth={1.75}
                                />
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-white">{title}</p>
                                    <p className="text-[10px] leading-snug text-gray-400">
                                        {subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop: partner logos row */}
                <div className="mt-14 hidden items-center justify-center gap-10 border-t border-white/10 pt-10 lg:flex">
                    <img
                        src={mlbbLogo}
                        alt="Mobile Legends: Bang Bang"
                        className="h-10 w-auto object-contain opacity-90"
                    />
                    <img
                        src={moontonLogo}
                        alt="Moonton"
                        className="h-9 w-auto object-contain opacity-90"
                    />
                </div>

                {/* Copyright + legal */}
                <div className="mt-6 flex flex-col items-stretch gap-6 text-sm text-gray-500 lg:mt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:text-xs">
                    <p className="text-left text-body-sm lg:text-body-md">
                        © 2026 Moonton Student Leaders Philippines. All rights reserved.
                    </p>
                    <nav
                        className="flex w-full flex-col items-center gap-7 lg:w-auto lg:flex-row lg:gap-6"
                        aria-label="Legal"
                    >
                        {LEGAL_LINKS.map(({ label, href }) => (
                            <Link
                                key={href}
                                href={href}
                                className="text-gray-500 transition-colors hover:text-white"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
