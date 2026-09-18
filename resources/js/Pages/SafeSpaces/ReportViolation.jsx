import SuccessModal from '@/Components/Admin/SuccessModal';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import {
    ChevronDown,
    Info,
    Lock,
    Mail,
    Megaphone,
    Paperclip,
    Shield,
    ShieldAlert,
} from 'lucide-react';
import { useState } from 'react';

const INCIDENT_TYPES = [
    'Gender-based sexual harassment',
    'Bullying',
    'Cyber-harassment',
    'Abuse of authority',
    'Other',
];

const INITIAL_FORM = {
    anonymous: true,
    name: '',
    school: '',
    incidentType: '',
    description: '',
    evidenceUrl: '',
    attested: false,
};

const FIELD_CLASS =
    'w-full min-h-[44px] rounded-lg border border-neutral-800 bg-[#0a0a0a] px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-[#FBBF24]';

function stripProtocol(value) {
    return value.trim().replace(/^(https?:\/\/)/i, '');
}

function PolicyBanner({ icon: Icon, title, children }) {
    return (
        <div className="flex gap-3 rounded-xl border border-[#1E4A8C]/80 bg-[#0B1733] px-4 py-3.5 sm:px-5 sm:py-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#132A55] text-[#5BA3F5]">
                <Icon className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-semibold text-[#5BA3F5]">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#9BB4D4]">{children}</p>
            </div>
        </div>
    );
}

function FieldLabel({ htmlFor, children, required = false, hint }) {
    return (
        <label htmlFor={htmlFor} className="mb-2 flex items-center gap-1.5 text-sm font-medium text-white">
            {children}
            {required ? <span className="text-red-500">*</span> : null}
            {hint}
        </label>
    );
}

export default function ReportViolation() {
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const update = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = 'Please enter your name.';
        if (!form.school.trim()) next.school = 'Please enter your school or organization.';
        if (!form.incidentType) next.incidentType = 'Please select a type of incident.';
        if (!form.description.trim()) next.description = 'Please describe the incident.';
        if (!stripProtocol(form.evidenceUrl)) next.evidenceUrl = 'Please attach a link to evidence.';
        if (!form.attested) next.attested = 'You must attest that the information is true.';
        return next;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const nextErrors = validate();
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        setSubmitted(true);
    };

    const handleCloseSuccess = () => {
        setSubmitted(false);
        setForm(INITIAL_FORM);
    };

    const fieldErrorClass = (key) =>
        errors[key] ? 'border-red-500 focus:border-red-500' : '';

    return (
        <MainLayout>
            <Head title="Report Violation" />

            <div className="py-10 font-sans sm:py-14 lg:py-16">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center">
                        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-red-900/90 bg-red-950/20 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-red-500">
                            <ShieldAlert className="h-3.5 w-3.5" strokeWidth={2} />
                            MSL INTEGRITY PORTAL
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            Safe Spaces Reporting
                        </h1>
                        <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-neutral-400 sm:text-base">
                            In compliance with{' '}
                            <span className="font-semibold text-white">
                                Republic Act 11313 (Safe Spaces Act)
                            </span>
                            , MSL Philippines is committed to maintaining a harassment-free
                            environment for all student-gamers.
                        </p>
                    </div>

                    <div className="mt-8 space-y-3 sm:mt-10">
                        <PolicyBanner icon={Megaphone} title="Zero Tolerance Policy">
                            This form covers incidents of gender-based sexual harassment,
                            bullying, cyber-harassment, and abuse of authority within the MSL
                            ecosystem (Tournaments, Discord, Campus Events).
                        </PolicyBanner>
                        <PolicyBanner
                            icon={Shield}
                            title="For Child Protection (Minors under 18)"
                        >
                            We strictly adhere to RA 7610. Reports involving minors are
                            prioritized immediately.
                        </PolicyBanner>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="mt-6 rounded-2xl border border-neutral-800 bg-[#111111] p-4 sm:mt-8 sm:p-6 lg:p-8"
                    >
                        <div className="flex items-center justify-between gap-4 border-b border-neutral-800 pb-5">
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1C1C1C]">
                                    <Lock className="h-4 w-4 text-neutral-300" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white">
                                        File Anonymously
                                    </p>
                                    <p className="mt-0.5 text-xs text-neutral-500">
                                        Your identity will be hidden from the accused.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={form.anonymous}
                                aria-label="File anonymously"
                                onClick={() => update('anonymous', !form.anonymous)}
                                className="relative h-6 w-11 shrink-0 rounded-full bg-neutral-700 transition-colors"
                            >
                                <span
                                    className={`absolute top-0.5 h-5 w-5 rounded-full shadow-sm transition-all ${
                                        form.anonymous
                                            ? 'left-[22px] bg-[#FBBF24]'
                                            : 'left-0.5 bg-neutral-400'
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                            <div>
                                <FieldLabel htmlFor="reporter-name" required>
                                    Your Name
                                </FieldLabel>
                                <input
                                    id="reporter-name"
                                    type="text"
                                    autoComplete="name"
                                    value={form.name}
                                    onChange={(event) => update('name', event.target.value)}
                                    placeholder="e.g. Juan Dela Cruz"
                                    className={`${FIELD_CLASS} ${fieldErrorClass('name')}`}
                                />
                                {errors.name ? (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
                                ) : null}
                            </div>
                            <div>
                                <FieldLabel htmlFor="reporter-school" required>
                                    School / Organization
                                </FieldLabel>
                                <input
                                    id="reporter-school"
                                    type="text"
                                    autoComplete="organization"
                                    value={form.school}
                                    onChange={(event) => update('school', event.target.value)}
                                    placeholder="e.g. University of the Philippines"
                                    className={`${FIELD_CLASS} ${fieldErrorClass('school')}`}
                                />
                                {errors.school ? (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.school}</p>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-5">
                            <FieldLabel htmlFor="incident-type" required>
                                Type of Incident
                            </FieldLabel>
                            <div className="relative">
                                <select
                                    id="incident-type"
                                    value={form.incidentType}
                                    onChange={(event) => update('incidentType', event.target.value)}
                                    className={`${FIELD_CLASS} appearance-none pr-10 ${
                                        form.incidentType ? 'text-white' : 'text-neutral-500'
                                    } ${fieldErrorClass('incidentType')}`}
                                >
                                    <option value="" disabled>
                                        Select type of incident
                                    </option>
                                    {INCIDENT_TYPES.map((type) => (
                                        <option key={type} value={type} className="bg-[#111111] text-white">
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                            </div>
                            {errors.incidentType ? (
                                <p className="mt-1.5 text-xs text-red-400">{errors.incidentType}</p>
                            ) : null}
                        </div>

                        <div className="mt-4 sm:mt-5">
                            <FieldLabel
                                htmlFor="incident-description"
                                required
                                hint={
                                    <span className="group relative inline-flex text-neutral-500 transition hover:text-[#FBBF24]">
                                        <span
                                            tabIndex={0}
                                            className="focus:outline-none"
                                            aria-label="Description guidance"
                                        >
                                            <Info className="h-3.5 w-3.5" />
                                        </span>
                                        <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-56 -translate-x-1/2 rounded-lg border border-white/10 bg-[#0B0B0B] px-3 py-2 text-left text-xs font-normal leading-[18px] text-neutral-400 shadow-xl group-hover:block group-focus-within:block">
                                            Include dates, people involved, where it happened, and
                                            any other details that can help the Integrity team
                                            review the report.
                                        </span>
                                    </span>
                                }
                            >
                                Description
                            </FieldLabel>
                            <textarea
                                id="incident-description"
                                value={form.description}
                                onChange={(event) => update('description', event.target.value)}
                                placeholder="Enter a description..."
                                rows={6}
                                className={`min-h-[140px] resize-y ${FIELD_CLASS} ${fieldErrorClass('description')}`}
                            />
                            {errors.description ? (
                                <p className="mt-1.5 text-xs text-red-400">{errors.description}</p>
                            ) : null}
                        </div>

                        <div className="mt-5 sm:mt-6">
                            <div className="mb-3 flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1C1C1C]">
                                    <Paperclip className="h-4 w-4 text-neutral-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Evidence</p>
                                    <p className="mt-0.5 text-xs text-neutral-500">
                                        Attach link to evidence below for further checking.
                                    </p>
                                </div>
                            </div>
                            <FieldLabel htmlFor="evidence-url" required>
                                Input link to Evidence
                            </FieldLabel>
                            <div
                                className={`flex min-h-[44px] overflow-hidden rounded-lg border bg-[#0a0a0a] ${
                                    errors.evidenceUrl
                                        ? 'border-red-500'
                                        : 'border-neutral-800 focus-within:border-[#FBBF24]'
                                }`}
                            >
                                <span className="flex shrink-0 items-center border-r border-neutral-800 px-3 text-sm text-neutral-400">
                                    https://
                                </span>
                                <input
                                    id="evidence-url"
                                    type="text"
                                    inputMode="url"
                                    autoComplete="url"
                                    value={form.evidenceUrl}
                                    onChange={(event) =>
                                        update('evidenceUrl', stripProtocol(event.target.value))
                                    }
                                    placeholder="www.link-to-evidence.com"
                                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-600"
                                />
                            </div>
                            {errors.evidenceUrl ? (
                                <p className="mt-1.5 text-xs text-red-400">{errors.evidenceUrl}</p>
                            ) : null}
                        </div>

                        <div className="mt-5 border-t border-neutral-800 pt-5">
                            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-neutral-300">
                                <input
                                    type="checkbox"
                                    checked={form.attested}
                                    onChange={(event) => update('attested', event.target.checked)}
                                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-600 bg-transparent text-[#FBBF24] accent-[#FBBF24] focus:ring-[#FBBF24]"
                                />
                                <span>
                                    I attest that the information provided is true to the best of
                                    my knowledge. I understand that filing a false report is a
                                    violation of the MSL Code of Conduct.
                                </span>
                            </label>
                            {errors.attested ? (
                                <p className="mt-1.5 text-xs text-red-400">{errors.attested}</p>
                            ) : null}
                        </div>

                        <button
                            type="submit"
                            className="mt-5 w-full rounded-lg bg-[#E53935] py-3 text-sm font-semibold text-white transition hover:bg-[#F04440] active:scale-[0.99]"
                        >
                            Submit Report
                        </button>

                        <p className="mt-5 text-center text-xs leading-relaxed text-neutral-500">
                            Reports are handled confidentially by the MSL Integrity team. For
                            urgent concerns, contact{' '}
                            <a
                                href="mailto:contact@moontonslph.org"
                                className="inline-flex items-center gap-1 font-medium text-[#FBBF24] hover:underline"
                            >
                                contact@moontonslph.org
                                <Mail className="h-3.5 w-3.5" />
                            </a>
                        </p>
                    </form>
                </div>
            </div>

            <SuccessModal
                isOpen={submitted}
                onClose={handleCloseSuccess}
                message="Report submitted"
                description="Thank you. The MSL Integrity team will review your report confidentially."
            />
        </MainLayout>
    );
}
