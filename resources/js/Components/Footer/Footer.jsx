import { Link, usePage } from '@inertiajs/react';
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
    { label: 'The MSL Network', href: '/Programs' },
    { label: 'Campus Tournaments', href: '/Tournament/Organizer' },
    { label: 'MCC League', href: '/programs/mcc-league' },
    { label: 'Leadership Summit', href: '/programs/leadership-summit' },
    { label: 'Community Grants', href: '/programs/community-grants' },
];

const RESOURCE_LINKS = [
    { label: 'Partner With Us', href: '/Partnerships' },
    { label: 'Join the Team', href: '/careers' },
    { label: 'News & Updates', href: '/News' },
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
    { label: 'Accessibility', href: '/accessibility' },
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
    'text-sm text-gray-400 transition-colors hover:text-white';

const Footer = () => {
    const { footer } = usePage().props;

    const logo = footer?.logo || '/msl-logo.png';
    const facebookUrl = footer?.facebook_url || 'https://www.facebook.com/MSLPhilippines';
    const youtubeUrl = footer?.youtube_url || 'https://www.youtube.com/@MSLPhilippines';
    const tiktokUrl = footer?.tiktok_url || 'https://www.tiktok.com/@mslphilippines';
    const mlbbLogo = footer?.mlbb_logo || '/mlbb-logo.png';
    const moontonLogo = footer?.moonton_logo || '/moonton-logo.png';
    const description = footer?.description || 'The official student leader body of Mobile Legends: Bang Bang in the Philippines.';
    const copyright = footer?.copyright || '© 2025 Moonton Student Leaders Philippines. All rights reserved.';
    const customNavSections = Array.isArray(footer?.nav_sections) && footer.nav_sections.length > 0 ? footer.nav_sections : null;

    const socialBase =
        'inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A] text-white transition-colors';

    return (
        <footer className="relative z-10 border-t border-white/10 bg-black pb-8 pt-14 text-white sm:pt-16">
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
                        <div className="mt-6 flex items-center gap-3">
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
                            {PROGRAM_LINKS.map(({ label, href }) => (
                                <Link key={href} href={href} className={footerLinkClass}>
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-bold text-white">Resources</h3>
                        <nav className="mt-5 flex flex-col gap-3" aria-label="Resources">
                            {RESOURCE_LINKS.map(({ label, href }) => (
                                <Link key={href} href={href} className={footerLinkClass}>
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-bold text-white">Safe Spaces</h3>
                        <p className="mb-5 mt-5 text-sm text-gray-400">
                            We are committed to RA11313 compliance.
                        </p>
                        <Link
                            href="/report-violation"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-700/80 bg-red-950/40 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-950/60 hover:text-red-400"
                        >
                            <ShieldAlert className="h-4 w-4 shrink-0" />
                            Report Violation
                        </Link>
                    </div>
                </div>

                {/* Mobile / tablet layout */}
                <div className="lg:hidden">
                    <div className="flex flex-col items-start sm:items-center sm:text-center">
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

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
                            <img
                                src={moontonLogo}
                                alt="Moonton"
                                className="h-8 w-auto object-contain opacity-90"
                            />
                            <img
                                src={mlbbLogo}
                                alt="Mobile Legends: Bang Bang"
                                className="h-8 w-auto object-contain opacity-90"
                            />
                        </div>

                        <div className="mt-6 flex items-center gap-3">
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

                    <div className="mt-10 grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-bold text-white">Programs</h3>
                            <nav className="mt-4 flex flex-col gap-3" aria-label="Programs">
                                {PROGRAM_LINKS.map(({ label, href }) => (
                                    <Link key={href} href={href} className={footerLinkClass}>
                                        {label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Resources</h3>
                            <nav className="mt-4 flex flex-col gap-3" aria-label="Resources">
                                {RESOURCE_LINKS.map(({ label, href }) => (
                                    <Link key={href} href={href} className={footerLinkClass}>
                                        {label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-sm font-bold text-white">Safe Spaces</h3>
                        <p className="mb-4 mt-3 text-sm text-gray-400">
                            We are committed to RA11313 compliance.
                        </p>
                        <Link
                            href="/report-violation"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-700/80 bg-red-950/40 px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-950/60 hover:text-red-400"
                        >
                            <ShieldAlert className="h-4 w-4 shrink-0" />
                            Report Violation
                        </Link>
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6">
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
                <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/10 pt-8 text-xs text-gray-500 lg:mt-8 lg:flex-row lg:items-center lg:justify-between lg:border-0 lg:pt-0">
                    <p className="text-center lg:text-left">
                        © 2025 Moonton Student Leaders Philippines. All rights reserved.
                    </p>
                    <nav
                        className="flex flex-col items-center gap-3 lg:flex-row lg:gap-6"
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
