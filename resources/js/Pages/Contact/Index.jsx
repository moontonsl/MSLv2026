import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    ChevronDown,
    Loader2,
    Mail,
    Send,
} from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import { PUBLIC_ROUTES } from '@/data/siteNavigation';
import ContactModal from './ContactModal';
import styles from './Contact.module.css';

const VIDEO_SRC =
    'https://player.vimeo.com/video/1091173390?context=Vimeo%5CController%5CApi%5CResources%5CVideoController.&h=b2f78d509b&s=e3ba5b9062fe0eb9a97262a95d7f03fe2cb1c579_1778490740&autoplay=1&loop=1&muted=1';

const STEPS = [
    { id: 1, label: 'Contact Details' },
    { id: 2, label: 'Your Inquiry' },
];

const STEP_FIELDS = {
    1: ['first_name', 'last_name', 'email', 'phone', 'organization'],
    2: ['topic', 'subject', 'message'],
};

const INITIAL_FORM = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    organization: '',
    topic: '',
    subject: '',
    message: '',
};

const MESSAGE_MIN = 100; // characters
const MESSAGE_MAX = 2000; // characters
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^(?:\+?63|0)?9\d{9}$/;

const FIELD_CLASS =
    'w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3.5 text-[15px] text-white placeholder:text-gray-500 transition-colors focus:border-[#F2C21A] focus:outline-none focus:ring-0';
const PRIMARY_BUTTON =
    'inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-xl border border-[#D4A810] bg-[#F2C21A] px-5 text-[15px] font-semibold text-[#18181B] transition-colors hover:bg-[#F8D54B] disabled:cursor-not-allowed disabled:opacity-60';
const SECONDARY_BUTTON =
    'inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60';

function validateStep(step, form) {
    const errors = {};
    if (step === 1) {
        if (!form.first_name.trim()) errors.first_name = 'Please enter your first name.';
        if (!form.last_name.trim()) errors.last_name = 'Please enter your last name.';
        if (!form.email.trim()) errors.email = 'Please enter your email address.';
        else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'Please enter a valid email address.';
        if (form.phone.trim() && !PHONE_PATTERN.test(form.phone.replace(/[\s-]/g, ''))) {
            errors.phone = 'Please enter a valid PH mobile number (e.g. 09171234567).';
        }
    }
    if (step === 2) {
        if (!form.topic) errors.topic = 'Please choose a topic.';
        if (!form.subject.trim()) errors.subject = 'Please add a subject.';
        if (form.message.trim().length < MESSAGE_MIN) errors.message = `Please write at least ${MESSAGE_MIN} characters so we can help you properly.`;
    }
    return errors;
}

function Field({ id, label, optional = false, error, children }) {
    return (
        <div>
            <label htmlFor={id} className="mb-2 flex items-center gap-1.5 text-sm font-medium text-white">
                {label}
                {optional ? <span className="text-xs font-normal text-gray-500">(optional)</span> : <span className="text-[#F2C21A]">*</span>}
            </label>
            {children}
            {error ? <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400">{error}</p> : null}
        </div>
    );
}

function Stepper({ step }) {
    return (
        <ol className="flex items-center gap-3" aria-label="Progress">
            {STEPS.map((item, index) => {
                const done = step > item.id;
                const current = step === item.id;
                return (
                    <li key={item.id} className="flex flex-1 items-center gap-3" aria-current={current ? 'step' : undefined}>
                        <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                                done || current
                                    ? 'border-[#F2C21A] bg-[#F2C21A] text-[#18181B]'
                                    : 'border-white/15 bg-transparent text-gray-500'
                            }`}
                        >
                            {done ? <Check className="h-4 w-4" aria-hidden="true" /> : item.id}
                        </span>
                        <span className={`text-sm font-semibold ${current ? 'text-white' : done ? 'text-gray-300' : 'text-gray-500'}`}>
                            {item.label}
                        </span>
                        {index < STEPS.length - 1 ? (
                            <span aria-hidden="true" className={`h-px flex-1 ${done ? 'bg-[#F2C21A]' : 'bg-white/10'}`} />
                        ) : null}
                    </li>
                );
            })}
        </ol>
    );
}

export default function ContactIndex({ topics = [], contactEmail = 'contact@moontonslph.org' }) {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [modal, setModal] = useState(null); // 'confirm' | 'success' | 'failed'
    const [sending, setSending] = useState(false);
    const [failure, setFailure] = useState('');

    const update = (key, value) => {
        setForm((previous) => ({ ...previous, [key]: value }));
        if (errors[key]) {
            setErrors((previous) => {
                const next = { ...previous };
                delete next[key];
                return next;
            });
        }
    };

    const inputProps = (key) => ({
        id: `contact-${key}`,
        value: form[key],
        onChange: (event) => update(key, event.target.value),
        'aria-invalid': Boolean(errors[key]),
        'aria-describedby': errors[key] ? `contact-${key}-error` : undefined,
        className: `${FIELD_CLASS} ${errors[key] ? 'border-red-500 focus:border-red-500' : ''}`,
    });

    const goNext = (event) => {
        event.preventDefault();
        const stepErrors = validateStep(step, form);
        if (Object.keys(stepErrors).length) {
            setErrors(stepErrors);
            return;
        }
        if (step === 1) setStep(2);
        else setModal('confirm');
    };

    const send = async () => {
        setSending(true);
        try {
            await window.axios.post(PUBLIC_ROUTES.contact, {
                ...form,
                phone: form.phone.replace(/[\s-]/g, ''),
            });
            setModal('success');
        } catch (error) {
            const status = error.response?.status;
            if (status === 422) {
                const serverErrors = Object.fromEntries(
                    Object.entries(error.response.data.errors ?? {}).map(([key, messages]) => [key, messages[0]]),
                );
                setErrors(serverErrors);
                setStep(STEP_FIELDS[1].some((key) => serverErrors[key]) ? 1 : 2);
                setModal(null);
            } else {
                setFailure(
                    status === 429
                        ? 'You’ve sent several messages in a short time. Please wait a minute and try again.'
                        : error.response?.data?.message || 'We couldn’t reach our servers. Please check your connection and try again.',
                );
                setModal('failed');
            }
        } finally {
            setSending(false);
        }
    };

    const startOver = () => {
        setForm(INITIAL_FORM);
        setErrors({});
        setStep(1);
        setModal(null);
    };

    const summary = [
        ['Name', `${form.first_name} ${form.last_name}`.trim()],
        ['Email', form.email],
        ['Phone', form.phone || '—'],
        ['School / Organization', form.organization || '—'],
        ['Topic', form.topic],
        ['Subject', form.subject],
    ];

    return (
        <MainLayout>
            <Head title="Contact Us" />

            <div className="flex min-h-screen items-start justify-center px-md pb-12 pt-[100px] md:items-center md:py-12">
                <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-bg-card min-h-[450px] md:flex-row md:gap-[32px]">
                    {/* ================= LEFT: VIDEO (same video as the Login page) ================= */}
                    <div className={`${styles.videoPanel} relative aspect-video w-full md:aspect-auto md:flex-1`}>
                        <iframe
                            src={VIDEO_SRC}
                            title="MSL Philippines highlight video"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            tabIndex={-1}
                            aria-hidden="true"
                            className={styles.videoFrame}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/90" aria-hidden="true" />

                        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F2C21A]">MSL Philippines</p>
                            <p className="mt-2 text-2xl font-bold leading-tight text-white md:text-3xl">
                                We’d love to hear from you.
                            </p>
                            <a
                                href={`mailto:${contactEmail}`}
                                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-200 transition-colors hover:text-[#F2C21A]"
                            >
                                <Mail className="h-4 w-4" aria-hidden="true" />
                                {contactEmail}
                            </a>
                        </div>
                    </div>

                    {/* ================= RIGHT: STEP-BY-STEP FORM ================= */}
                    <div className="flex w-full flex-col justify-center px-[20px] py-lg md:w-[55%] md:shrink-0 md:px-[48px] md:py-xl lg:w-[560px]">
                        <div className="mx-auto w-full">
                        <div className="mb-6 space-y-1">
                            <h1 className="text-xl font-bold leading-[1.2] md:text-section">Get in Touch</h1>
                            <h1 className="text-xl font-bold leading-[1.2] text-brand-500 md:text-section">with MSL Philippines</h1>
                        </div>
                        <p className="mb-7 text-sm leading-6 text-gray-400">
                            Questions about campus communities, partnerships, events, or anything else? Send us a message and our team will get back to you.
                        </p>

                        <Stepper step={step} />
                        <p className="mt-3 text-xs text-gray-500">Step {step} of {STEPS.length}</p>

                        <form onSubmit={goNext} noValidate className="mt-7">
                            {/* Both steps share one grid cell, so the card always keeps the
                                height of the taller step and never resizes between steps.
                                The hidden step is invisible and not focusable. */}
                            <div className="grid">
                                <div
                                    aria-hidden={step !== 1}
                                    className={`col-start-1 row-start-1 grid grid-cols-1 content-start gap-x-5 gap-y-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 ${step === 1 ? styles.stepPane : 'invisible'}`}
                                >
                                    <Field id="contact-first_name" label="First Name" error={errors.first_name}>
                                        <input type="text" autoComplete="given-name" placeholder="Juan" {...inputProps('first_name')} />
                                    </Field>
                                    <Field id="contact-last_name" label="Last Name" error={errors.last_name}>
                                        <input type="text" autoComplete="family-name" placeholder="Dela Cruz" {...inputProps('last_name')} />
                                    </Field>
                                    <div className="sm:col-span-2 md:col-span-1 lg:col-span-2">
                                        <Field id="contact-email" label="Email Address" error={errors.email}>
                                            <input type="email" autoComplete="email" placeholder="you@example.com" {...inputProps('email')} />
                                        </Field>
                                    </div>
                                    <Field id="contact-phone" label="Mobile Number" optional error={errors.phone}>
                                        <input type="tel" autoComplete="tel" inputMode="tel" placeholder="09171234567" {...inputProps('phone')} />
                                    </Field>
                                    <Field id="contact-organization" label="School / Organization" optional error={errors.organization}>
                                        <input type="text" autoComplete="organization" placeholder="e.g. University of the Philippines" {...inputProps('organization')} />
                                    </Field>
                                </div>

                                <div
                                    aria-hidden={step !== 2}
                                    className={`col-start-1 row-start-1 grid grid-cols-1 content-start gap-x-5 gap-y-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 ${step === 2 ? styles.stepPane : 'invisible'}`}
                                >
                                    <Field id="contact-topic" label="Topic" error={errors.topic}>
                                        <div className="relative">
                                            <select {...inputProps('topic')} className={`${inputProps('topic').className} appearance-none bg-none pr-11`}>
                                                <option value="" disabled>Choose a topic</option>
                                                {topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                                        </div>
                                    </Field>
                                    <Field id="contact-subject" label="Subject" error={errors.subject}>
                                        <input type="text" maxLength={120} placeholder="What is your message about?" {...inputProps('subject')} />
                                    </Field>
                                    <div className="sm:col-span-2 md:col-span-1 lg:col-span-2">
                                        <Field id="contact-message" label="Message" error={errors.message}>
                                            <textarea
                                                rows={4}
                                                maxLength={MESSAGE_MAX}
                                                placeholder={`Tell us how we can help… (at least ${MESSAGE_MIN} characters)`}
                                                {...inputProps('message')}
                                                className={`${inputProps('message').className} resize-none`}
                                            />
                                            {(() => {
                                                const length = form.message.trim().length;
                                                const remaining = MESSAGE_MIN - length;
                                                return (
                                                    <p className="mt-1.5 flex justify-between gap-3 text-xs text-gray-500">
                                                        <span className={remaining > 0 ? '' : 'text-green-400'}>
                                                            {remaining > 0 ? `${remaining} more characters needed` : 'Minimum reached'}
                                                        </span>
                                                        <span>{form.message.length}/{MESSAGE_MAX}</span>
                                                    </p>
                                                );
                                            })()}
                                        </Field>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
                                {step === 2 ? (
                                    <button type="button" onClick={() => setStep(1)} className={SECONDARY_BUTTON}>
                                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                                        Previous
                                    </button>
                                ) : null}
                                <button type="submit" className={PRIMARY_BUTTON}>
                                    {step === 1 ? 'Continue' : 'Review & Send'}
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm before sending */}
            <ContactModal
                open={modal === 'confirm'}
                onClose={() => setModal(null)}
                locked={sending}
                icon={Send}
                title="Send your message?"
                description="Please check your details. We’ll reply to the email address below."
                actions={(
                    <>
                        <button type="button" onClick={() => setModal(null)} disabled={sending} className={SECONDARY_BUTTON}>
                            Edit
                        </button>
                        <button type="button" onClick={send} disabled={sending} className={PRIMARY_BUTTON}>
                            {sending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                            {sending ? 'Sending…' : 'Send Message'}
                        </button>
                    </>
                )}
            >
                <dl className="mt-6 space-y-2.5 rounded-xl border border-white/10 bg-[#0b0b0b] p-4 text-sm">
                    {summary.map(([label, value]) => (
                        <div key={label} className="flex gap-3">
                            <dt className="w-32 shrink-0 text-gray-500">{label}</dt>
                            <dd className="min-w-0 break-words font-medium text-gray-200">{value}</dd>
                        </div>
                    ))}
                    <div className="border-t border-white/10 pt-2.5">
                        <dt className="text-gray-500">Message</dt>
                        <dd className="mt-1 line-clamp-4 whitespace-pre-line text-gray-300">{form.message}</dd>
                    </div>
                </dl>
            </ContactModal>

            {/* Sent */}
            <ContactModal
                open={modal === 'success'}
                onClose={startOver}
                tone="success"
                icon={CheckCircle2}
                title="Message sent!"
                description={`Thanks, ${form.first_name || 'there'}! Our team has received your message and will reply to ${form.email || 'your email'}.`}
                actions={(
                    <>
                        <button type="button" onClick={startOver} className={SECONDARY_BUTTON}>
                            Send Another
                        </button>
                        <Link href={PUBLIC_ROUTES.about} className={PRIMARY_BUTTON}>
                            Back to About
                        </Link>
                    </>
                )}
            />

            {/* Failed */}
            <ContactModal
                open={modal === 'failed'}
                onClose={() => setModal(null)}
                tone="danger"
                icon={AlertTriangle}
                title="Message not sent"
                description={failure}
                actions={(
                    <>
                        <a href={`mailto:${contactEmail}?subject=${encodeURIComponent(form.subject || 'Inquiry')}`} className={SECONDARY_BUTTON}>
                            <Mail className="h-4 w-4" aria-hidden="true" />
                            Email Us Instead
                        </a>
                        <button type="button" onClick={() => setModal('confirm')} className={PRIMARY_BUTTON}>
                            Try Again
                        </button>
                    </>
                )}
            />
        </MainLayout>
    );
}
