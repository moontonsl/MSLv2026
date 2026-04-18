import { Link, usePage } from '@inertiajs/react';
import {
    Facebook,
    Youtube,
    ShieldAlert,
    Heart,
    Lock,
    ShieldCheck,
    BadgeCheck,
    Accessibility,
} from 'lucide-react';

const PROGRAM_LINKS = [
    { label: 'The MSL Network', href: '/programs/msl-network' },
    { label: 'Campus Tournaments', href: '/programs/campus-tournaments' },
    { label: 'MCC League', href: '/programs/mcc-league' },
    { label: 'Leadership Summit', href: '/programs/leadership-summit' },
    { label: 'Community Grants', href: '/programs/community-grants' },
];

const RESOURCE_LINKS = [
    { label: 'Partner With Us', href: '/partner' },
    { label: 'Join the Team', href: '/careers' },
    { label: 'News & Updates', href: '/news' },
];

const TRUST_BADGES = [
    {
        Icon: Heart,
        iconClass: 'text-[#FFC107]',
        title: 'Safe Space Zone',
        subtitle: 'RA 11313 Compliant',
    },
    {
        Icon: Lock,
        iconClass: 'text-gray-400',
        title: 'Data Privacy',
        subtitle: 'Encrypted & Secure',
    },
    {
        Icon: ShieldCheck,
        iconClass: 'text-gray-400',
        title: 'Child Protection',
        subtitle: 'Strictly Enforced',
    },
    {
        Icon: BadgeCheck,
        iconClass: 'text-gray-400',
        title: 'Intellectual Property',
        subtitle: 'Moonton Authorized',
    },
    {
        Icon: Accessibility,
        iconClass: 'text-gray-400',
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

const Footer = () => {
    const { footer } = usePage().props;

    const logo = footer?.logo || '/msl-logo.png';
    const facebookUrl = footer?.facebook_url || 'https://www.facebook.com/MSLPhilippines';
    const youtubeUrl = footer?.youtube_url || 'https://www.youtube.com/@MSLPhilippines';
    const tiktokUrl = footer?.tiktok_url || 'https://www.tiktok.com/@mslphilippines';
    const mlbbLogo = footer?.mlbb_logo || '/mlbb-logo.png';
    const moontonLogo = footer?.moonton_logo || '/moonton-logo.png';

    const socialClass =
        'text-gray-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC107]';

    return (
        <footer className="relative z-10 border-t border-white/10 bg-[#0a0a0a] pb-8 pt-16 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                {/* Tier 1 */}
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <Link href="/" className="inline-flex">
                            <img
                                src={logo}
                                alt="MSL Philippines"
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                        <p className="mt-6 text-sm text-gray-400">
                            The official student leader body of Mobile Legends: Bang Bang in the
                            Philippines.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-6">
                            <Link href="/" className="block h-9 opacity-90 transition-opacity hover:opacity-100">
                                <img
                                    src={moontonLogo}
                                    alt="Moonton"
                                    className="h-full w-auto max-h-9 object-contain"
                                />
                            </Link>
                            <Link href="/" className="block h-9 opacity-90 transition-opacity hover:opacity-100">
                                <img
                                    src={mlbbLogo}
                                    alt="Mobile Legends: Bang Bang"
                                    className="h-full w-auto max-h-9 object-contain"
                                />
                            </Link>
                        </div>
                        <div className="mt-6 flex items-center gap-4">
                            <a
                                href={facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={socialClass}
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" strokeWidth={1.75} />
                            </a>
                            <a
                                href={tiktokUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={socialClass}
                                aria-label="TikTok"
                            >
                                <TikTokIcon className="h-5 w-5" />
                            </a>
                            <a
                                href={youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={socialClass}
                                aria-label="YouTube"
                            >
                                <Youtube className="h-5 w-5" strokeWidth={1.75} />
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-bold text-white">Programs</h3>
                        <nav className="mt-6 flex flex-col gap-3 text-sm text-gray-400" aria-label="Programs">
                            {PROGRAM_LINKS.map(({ label, href }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="transition-colors hover:text-white"
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-bold text-white">Resources</h3>
                        <nav className="mt-6 flex flex-col gap-3 text-sm text-gray-400" aria-label="Resources">
                            {RESOURCE_LINKS.map(({ label, href }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="transition-colors hover:text-white"
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-bold text-white">Safe Spaces</h3>
                        <p className="mb-6 mt-6 text-sm text-gray-400">
                            We are committed to RA11313 compliance.
                        </p>
                        <Link
                            href="/report-violation"
                            className="inline-flex items-center justify-center gap-2 rounded-md border border-red-900 bg-red-950/30 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-950/50 hover:text-red-400"
                        >
                            <ShieldAlert className="h-4 w-4 shrink-0" />
                            Report Violation
                        </Link>
                    </div>
                </div>

                {/* Tier 2 */}
                <div className="mt-16 grid grid-cols-2 gap-6 pt-8 md:grid-cols-3 lg:grid-cols-5">
                    {TRUST_BADGES.map(({ Icon, iconClass, title, subtitle }) => (
                        <div key={title} className="flex items-start gap-3">
                            <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} strokeWidth={1.75} />
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-white">{title}</p>
                                <p className="text-[10px] text-gray-400">{subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tier 3 */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 pt-8 text-xs text-gray-500 md:flex-row">
                    <p className="text-center md:text-left">
                        © 2025 Moonton Student Leaders Philippines. All rights reserved.
                    </p>
                    <nav
                        className="flex flex-wrap items-center justify-center gap-6 md:justify-end"
                        aria-label="Legal"
                    >
                        {LEGAL_LINKS.map(({ label, href }) => (
                            <Link
                                key={href}
                                href={href}
                                className="transition-colors hover:text-white"
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
