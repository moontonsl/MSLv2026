import { Link } from "@inertiajs/react";
import {
    Building2,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Trophy,
    User,
    Users,
} from "lucide-react";

const ICONS = {
    user: User,
    users: Users,
    building: Building2,
    trophy: Trophy,
    graduation: GraduationCap,
};

const BUTTON_VARIANTS = {
    primary:
        "border-[#D4A810] bg-[#F2C21A] text-[#18181B] hover:bg-[#F8D54B] hover:text-[#18181B]",
    secondary:
        "border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white",
    outline:
        "border-[#A78109] bg-[#111111] text-[#F2C21A] hover:bg-[#24200F] hover:text-[#F2C21A]",
    partner:
        "border-blue-500 bg-[#27272A] text-white hover:bg-[#333338] hover:text-white",
};

export function HomeContainer({ children, className = "" }) {
    return (
        <div
            className={`mx-auto w-[calc(100%-3rem)] max-w-[1248px] ${className}`}
        >
            {children}
        </div>
    );
}

export function SectionHeading({ id, children, className = "" }) {
    return (
        <h2
            id={id}
            className={`font-heading text-[30px] font-bold uppercase leading-[38px] tracking-normal text-white md:text-[36px] md:leading-[44px] ${className}`}
        >
            {children}
        </h2>
    );
}

export function SectionDescription({ children, className = "" }) {
    return (
        <p
            className={`mt-4 max-w-[532px] font-sans text-[16px] font-normal leading-[26px] text-[#D1D5DB] md:text-[18px] md:leading-[28px] ${className}`}
        >
            {children}
        </p>
    );
}

export function ButtonLink({
    href,
    variant = "primary",
    className = "",
    children,
}) {
    return (
        <Link
            href={href}
            className={`inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border px-[18px] py-[11px] font-sans text-[16px] font-semibold leading-[26px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21A] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050505] motion-reduce:transition-none ${
                BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary
            } ${className}`}
        >
            {children}
        </Link>
    );
}

export function HomeIcon({ name, size = 24, className = "" }) {
    const Icon = ICONS[name] || Users;

    return <Icon size={size} className={className} aria-hidden="true" />;
}

export function CarouselButton({ direction, label, onClick, className = "" }) {
    const Icon = direction === "previous" ? ChevronLeft : ChevronRight;

    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/[0.12] bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C21A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${className}`}
        >
            <Icon size={20} aria-hidden="true" />
        </button>
    );
}
