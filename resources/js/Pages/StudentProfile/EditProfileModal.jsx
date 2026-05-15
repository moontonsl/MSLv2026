import { useEffect, useMemo, useState, useRef } from 'react';
import { CheckCircle2, ChevronDown, ShieldCheck, Search, X } from 'lucide-react';
import {
    collegeCoursePrograms,
    collegeYearLevels,
    shsCourseStrands,
    shsYearLevels,
} from './profileEditOptions';

const contactRegex = /^(?:0?9\d{9}|9\d{9})$/;
const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/[^\s]+/i;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const simulatedCode = '123456';

function Field({ label, error, children }) {
    return (
        <label className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="text-sm font-semibold leading-5 text-white">{label}</span>
            {children}
            {error ? <span className="text-xs font-medium text-red-400">{error}</span> : null}
        </label>
    );
}

function TextInput({ error, className = '', ...props }) {
    return (
        <input
            {...props}
            className={`w-full rounded-xl border bg-[#111111] px-3.5 py-2.5 font-['Figtree'] text-base leading-6 text-white outline-none transition placeholder:text-gray-500 focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70 ${
                error
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
            } ${className}`}
        />
    );
}

function SelectInput({ error, children, ...props }) {
    return (
        <div className="relative w-full">
            <select
                {...props}
                className={`w-full appearance-none rounded-xl border bg-[#111111] px-3.5 py-2.5 pr-10 font-['Figtree'] text-base leading-6 text-white outline-none transition ${
                    error
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
                } focus:outline-none focus-visible:outline-none`}
            >
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
    );
}

function SearchableSelect({ error, value, onChange, placeholder, options, ...props }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef(null);

    const filteredOptions = useMemo(() => {
        if (!searchQuery.trim()) return options;
        const query = searchQuery.toLowerCase();
        return options.filter((option) => option.toLowerCase().includes(query));
    }, [searchQuery, options]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`relative w-full rounded-xl border bg-[#111111] px-3.5 py-2.5 font-['Figtree'] text-base leading-6 text-white outline-none transition text-left ${
                    error
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-white/10 focus:border-white/10'
                }`}
            >
                <span className={`block truncate ${value ? 'text-white' : 'text-gray-500'}`}>{value || placeholder}</span>
                <ChevronDown className={`absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition pointer-events-none ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 z-20 mt-2 rounded-xl border border-white/10 bg-[#111111] shadow-2xl overflow-hidden">
                    <div className="p-3 border-b border-white/10">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search courses..."
                                className="w-full rounded-lg border border-white/10 bg-[#0a0a0a] px-3.5 py-2.5 pl-10 font-['Figtree'] text-base leading-6 text-white outline-none transition placeholder:text-gray-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                            />
                        </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                        onChange({ target: { value: option } });
                                        setIsOpen(false);
                                        setSearchQuery('');
                                    }}
                                    className="w-full px-4 py-3 text-left text-base text-white hover:bg-brand-500/10 hover:text-brand-300 transition"
                                >
                                    {option}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-400">No courses found.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function SegmentedTabs({ activeTab, setActiveTab }) {
    return (
        <div className="grid h-11 w-full grid-cols-2 gap-1 rounded-[10px] border border-brand-500/10 bg-brand-500/10 p-1">
            {[
                ['profile', 'Edit Profile'],
                ['cover', 'Edit Cover Photo'],
            ].map(([id, label]) => (
                <button
                    key={id}
                    type="button"
                    className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                        activeTab === id
                            ? 'bg-brand-500 text-gray-900 shadow-[0_1px_3px_rgba(16,24,40,0.1)]'
                            : 'text-gray-300 hover:bg-white/5'
                    }`}
                    onClick={() => setActiveTab(id)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

function StatusDialog({
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    destructive = false,
    centered = false,
    disabledConfirm = false,
    children,
}) {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-80 max-w-96 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-2xl sm:w-96">
                <div className={`relative px-6 pt-6 ${centered ? 'text-center' : ''}`}>
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-brand-500/10 bg-brand-500/10 text-brand-500 ${centered ? 'mx-auto' : ''}`}>
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <button
                        type="button"
                        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/5 hover:text-white"
                        onClick={onCancel ?? onConfirm}
                        aria-label="Close dialog"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="text-lg font-bold leading-6 text-white font-['League_Spartan'] sm:whitespace-nowrap">
                        {title}
                    </div>
                    {description ? (
                        <div className={`mt-1.5 text-sm leading-5 text-gray-300 ${centered ? 'mx-auto' : ''}`}>{description}</div>
                    ) : null}
                </div>

                {children ? <div className={`px-6 pt-3 ${centered ? 'text-center' : ''}`}>{children}</div> : null}

                <div className="flex flex-col gap-3 px-6 pb-6 pt-8 sm:flex-row">
                    {onCancel ? (
                        <button
                            type="button"
                            className="flex-1 rounded-lg border border-brand-500 bg-white/10 px-4 py-2.5 text-base font-semibold text-brand-500 transition hover:bg-white/15"
                            onClick={onCancel}
                        >
                            {cancelLabel}
                        </button>
                    ) : null}
                    <button
                        type="button"
                        disabled={disabledConfirm}
                        className={`flex-1 rounded-lg px-4 py-2.5 text-base font-semibold transition ${
                            destructive
                                ? disabledConfirm
                                    ? 'border border-red-500 bg-red-900/30 text-red-300 cursor-not-allowed'
                                    : 'border border-red-500 bg-red-900/70 text-white hover:bg-red-800'
                                : disabledConfirm
                                ? 'bg-brand-500/50 text-gray-600 cursor-not-allowed'
                                : 'bg-brand-500 text-gray-900 hover:bg-brand-400'
                        }`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function EditProfileModal({ profile, onClose, onSave }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [form, setForm] = useState(() => ({
        yearLevel: profile.yearLevel ?? '',
        courseName: profile.courseName ?? '',
        contactNo: profile.editableProfile?.contactNo ?? '',
        facebookLink: profile.editableProfile?.facebookLink ?? '',
        email: profile.editableProfile?.email ?? '',
        verificationCode: '',
        squad: profile.playerInformation?.squad ?? '',
        squadAbbreviation: profile.editableProfile?.squadAbbreviation ?? '',
        mlbbIgn: profile.playerInformation?.ign ?? '',
        mlbbId: profile.playerInformation?.uid ?? '',
        mlbbServer: profile.playerInformation?.server ?? '',
    }));
    const [errors, setErrors] = useState({});
    const [codeTimer, setCodeTimer] = useState(0);
    const [hasRequestedCode, setHasRequestedCode] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState('default'); // 'default', 'error', 'success'
    const digitRefs = useRef([]);
    const [selectedCoverId, setSelectedCoverId] = useState(
        profile.coverPhotos?.find((cover) => cover.status === 'active')?.id ??
            profile.coverPhotos?.[0]?.id,
    );
    const [appliedCoverId, setAppliedCoverId] = useState(
        profile.coverPhotos?.find((cover) => cover.status === 'active')?.id ??
            profile.coverPhotos?.[0]?.id,
    );
    const [dialog, setDialog] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const coverPhotos = useMemo(() => profile.coverPhotos ?? [], [profile.coverPhotos]);
    const isShsProfile = shsYearLevels.includes(profile.yearLevel) || shsCourseStrands.includes(profile.courseName);
    const yearOptions = isShsProfile ? shsYearLevels : collegeYearLevels;
    const courseOptions = isShsProfile ? shsCourseStrands : collegeCoursePrograms;

    const originalEmail = profile.editableProfile?.email ?? '';
    const emailChanged = form.email.trim() && form.email !== originalEmail;
    const hasChanges = useMemo(() => {
        if ((form.yearLevel ?? '') !== (profile.yearLevel ?? '')) return true;
        if ((form.courseName ?? '') !== (profile.courseName ?? '')) return true;
        if ((form.contactNo ?? '') !== (profile.editableProfile?.contactNo ?? '')) return true;
        if ((form.facebookLink ?? '') !== (profile.editableProfile?.facebookLink ?? '')) return true;
        if ((form.email ?? '') !== (profile.editableProfile?.email ?? '')) return true;
        if ((appliedCoverId ?? '') !== (profile.coverPhotos?.find((cover) => cover.status === 'active')?.id ?? profile.coverPhotos?.[0]?.id ?? '')) return true;
        if ((form.squad ?? '') !== (profile.playerInformation?.squad ?? '')) return true;
        if ((form.squadAbbreviation ?? '') !== (profile.editableProfile?.squadAbbreviation ?? '')) return true;
        return false;
    }, [form, profile, appliedCoverId]);

    useEffect(() => {
        if (codeTimer <= 0) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            setCodeTimer((current) => current - 1);
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [codeTimer]);

    function updateField(name, value) {
        setForm((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({ ...current, [name]: '' }));
    }

    function validate() {
        const nextErrors = {};
        const contact = form.contactNo.trim();
        const facebook = form.facebookLink.trim();
        const email = form.email.trim();
        const originalEmail = profile.editableProfile?.email ?? '';
        const emailChanged = email && email !== originalEmail;

        if (!contact) {
            nextErrors.contactNo = 'Contact number is required.';
        } else if (!contactRegex.test(contact)) {
            nextErrors.contactNo = 'Enter a valid Philippine mobile number.';
        }

        if (!facebook) {
            nextErrors.facebookLink = 'Facebook link is required.';
        } else if (!facebookRegex.test(facebook)) {
            nextErrors.facebookLink = 'Enter a valid Facebook profile link.';
        }

        if (!email) {
            nextErrors.email = 'Email address is required.';
        } else if (!emailRegex.test(email)) {
            nextErrors.email = 'Enter a valid email address.';
        }

        if (emailChanged && verificationStatus !== 'success') {
            nextErrors.verificationCode = 'Please verify your new email address before saving.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    function handleGetCode() {
        const email = form.email.trim();

        if (!emailRegex.test(email)) {
            setErrors((current) => ({
                ...current,
                email: 'Enter a valid email address before requesting a code.',
            }));
            return;
        }

        setHasRequestedCode(true);
        setCodeTimer(60);
    }

    function handleVerify() {
        const code = form.verificationCode.trim();
        
        if (!code) {
            setErrors((current) => ({
                ...current,
                verificationCode: 'Please enter the verification code.',
            }));
            setVerificationStatus('default');
            return;
        }

        if (code === simulatedCode) {
            setVerificationStatus('success');
            setErrors((current) => ({ ...current, verificationCode: '' }));
        } else {
            setVerificationStatus('error');
            setErrors((current) => ({
                ...current,
                verificationCode: 'Incorrect code. Please check your email and try again.',
            }));
        }
    }

    function handleSave() {
        if (!validate()) {
            return;
        }

        onSave?.({
            yearLevel: form.yearLevel,
            courseName: form.courseName,
            profileBackground: coverPhotos.find((cover) => cover.id === appliedCoverId)?.image ?? profile.profileBackground,
            editableProfile: {
                ...profile.editableProfile,
                contactNo: form.contactNo,
                facebookLink: form.facebookLink,
                email: form.email,
                squadAbbreviation: form.squadAbbreviation,
            },
            playerInformation: {
                ...profile.playerInformation,
                squad: form.squad,
            },
        });

        setDialog({ type: 'success', title: 'Profile Updated Successfully!' });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
            <style>
                {`
                    .student-profile-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: rgba(242, 194, 26, 0.75) rgba(255, 255, 255, 0.08);
                    }

                    .student-profile-scrollbar::-webkit-scrollbar {
                        width: 8px;
                    }

                    .student-profile-scrollbar::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.08);
                        border-radius: 999px;
                    }

                    .student-profile-scrollbar::-webkit-scrollbar-thumb {
                        background: linear-gradient(180deg, rgba(242, 194, 26, 0.95), rgba(178, 132, 18, 0.85));
                        border-radius: 999px;
                        border: 2px solid rgba(11, 11, 11, 0.9);
                    }
                `}
            </style>
            <div className="relative flex max-h-[92vh] w-full max-w-[560px] flex-col gap-3 overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] py-6 shadow-2xl md:py-12">
                <button
                    type="button"
                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/5 hover:text-white md:right-4 md:top-4"
                    onClick={onClose}
                    aria-label="Close edit profile"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="px-6 pb-1.5 md:px-8 md:pb-6">
                    <div className="text-2xl font-black leading-6 text-white md:text-3xl md:leading-8 font-['League_Spartan']">
                        Edit Profile
                    </div>
                </div>

                <div className="px-6 md:px-11">
                    <SegmentedTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="student-profile-scrollbar min-h-0 overflow-y-auto px-4 md:px-8">
                    {activeTab === 'profile' ? (
                        <div className="flex flex-col gap-6 px-3">
                            <div className="grid gap-3 md:grid-cols-2">
                                <Field label="Year Level" error={errors.yearLevel}>
                                    <SelectInput
                                        value={form.yearLevel}
                                        onChange={(event) => updateField('yearLevel', event.target.value)}
                                        error={errors.yearLevel}
                                    >
                                        {yearOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </SelectInput>
                                </Field>
                                <Field label="Course/Strand" error={errors.courseName}>
                                    {isShsProfile ? (
                                        <SelectInput
                                            value={form.courseName}
                                            onChange={(event) => updateField('courseName', event.target.value)}
                                            error={errors.courseName}
                                        >
                                            {courseOptions.map((program) => (
                                                <option key={program} value={program}>
                                                    {program}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    ) : (
                                        <SearchableSelect
                                            value={form.courseName}
                                            onChange={(event) => updateField('courseName', event.target.value)}
                                            error={errors.courseName}
                                            placeholder="Select or search course..."
                                            options={courseOptions}
                                        />
                                    )}
                                </Field>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                                <Field label="Contact Number" error={errors.contactNo}>
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                            <span className="font-medium text-gray-300">+63</span>
                                            <span className="h-6 w-px bg-gray-500"></span>
                                        </div>
                                        <input
                                            value={form.contactNo}
                                            onChange={(event) => updateField('contactNo', event.target.value.replace(/\D/g, '').slice(0, 11))}
                                            placeholder="9123456789"
                                            className={`w-full rounded-xl border bg-[#111111] px-3.5 py-2.5 pl-20 font-['Figtree'] text-base leading-6 text-white outline-none transition placeholder:text-gray-500 focus:outline-none focus-visible:outline-none ${
                                                errors.contactNo
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                                    : 'border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400'
                                            }`}
                                        />
                                    </div>
                                </Field>
                                <Field label="Facebook Profile" error={errors.facebookLink}>
                                    <TextInput
                                        value={form.facebookLink}
                                        onChange={(event) => updateField('facebookLink', event.target.value)}
                                        placeholder="https://facebook.com/username"
                                        error={errors.facebookLink}
                                    />
                                </Field>
                            </div>

                            {/* EMAIL VERIFICATION NOTE - ALWAYS VISIBLE */}
                            <div className="rounded-2xl border border-brand-500/20 bg-brand-500/10 p-3 flex items-start gap-2">
                                <div className="mt-1">
                                    <ShieldCheck className="w-5 h-5 text-brand-500 flex-shrink-0" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs sm:text-sm font-semibold text-brand-500">Email Verification Required</p>
                                    <p className="text-xs sm:text-sm font-normal text-brand-400">
                                        Please check your email address for verification instructions. Your email will be updated once verified.
                                    </p>
                                </div>
                            </div>

                            {/* EMAIL & VERIFICATION SECTION - ONLY ENABLED IF EMAIL CHANGED */}
                            {(() => {
                                const originalEmail = profile.editableProfile?.email ?? '';
                                const emailChanged = form.email.trim() && form.email !== originalEmail;

                                return (
                                    <div className="space-y-3">
                                        <div className="grid items-end gap-3 grid-cols-[minmax(0,1fr)_140px]">
                                            <Field label="Email Address" error={errors.email}>
                                                <TextInput
                                                    type="email"
                                                    value={form.email}
                                                    onChange={(event) => {
                                                        updateField('email', event.target.value);
                                                        setVerificationStatus('default');
                                                    }}
                                                    placeholder="yourname@university.edu.ph"
                                                    error={errors.email}
                                                    disabled={verificationStatus === 'success'}
                                                />
                                            </Field>
                                            <button
                                                type="button"
                                                onClick={handleGetCode}
                                                disabled={!emailChanged || codeTimer > 0 || verificationStatus === 'success'}
                                                className="h-11 whitespace-nowrap rounded-xl border border-brand-500 bg-brand-500/10 px-4 py-2.5 text-sm sm:text-base font-semibold text-brand-500 transition hover:bg-brand-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                {!hasRequestedCode ? 'Get Code' : codeTimer > 0 ? `${codeTimer}s` : 'Resend Code'}
                                            </button>
                                        </div>

                                        <div className={`${!emailChanged ? 'opacity-50 pointer-events-none' : ''} space-y-2`}>
                                            <label className="text-sm font-semibold text-white">Enter Verification Code</label>
                                            <p className="text-xs sm:text-sm text-gray-400">We've sent a 6-digit verification code to your email. Enter it below to confirm your new email address.</p>

                                            <div className="flex items-end gap-3">
                                                <div className="flex items-center gap-1">
                                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                                        <span key={index} className="inline-flex items-center">
                                                            <input
                                                                ref={(el) => (digitRefs.current[index] = el)}
                                                                onFocus={() => {
                                                                    if (verificationStatus === 'error') {
                                                                        // clear all digits so user can retype smoothly
                                                                        updateField('verificationCode', '');
                                                                        setVerificationStatus('default');
                                                                        // focus first digit to provide a smooth typing start
                                                                        setTimeout(() => {
                                                                            const first = digitRefs.current?.[0];
                                                                            if (first) first.focus();
                                                                        }, 0);
                                                                    }
                                                                }}
                                                                type="text"
                                                                inputMode="numeric"
                                                                maxLength="1"
                                                                value={form.verificationCode[index] || ''}
                                                                onChange={(e) => {
                                                                    const raw = e.target.value.replace(/\D/g, '');
                                                                    // Prepare array of 6
                                                                    const arr = (form.verificationCode || '').split('');
                                                                    while (arr.length < 6) arr.push('');

                                                                    if (raw.length === 0) {
                                                                        arr[index] = '';
                                                                        updateField('verificationCode', arr.join('').slice(0, 6));
                                                                        setVerificationStatus('default');
                                                                        return;
                                                                    }

                                                                    // If user pasted or typed multiple digits, distribute
                                                                    if (raw.length > 1) {
                                                                        for (let i = 0; i < raw.length && index + i < 6; i++) {
                                                                            arr[index + i] = raw[i];
                                                                        }
                                                                        updateField('verificationCode', arr.join('').slice(0, 6));
                                                                        const nextIdx = Math.min(5, index + raw.length);
                                                                        const next = digitRefs.current[nextIdx];
                                                                        if (next) next.focus();
                                                                        setVerificationStatus('default');
                                                                        return;
                                                                    }

                                                                    // Single digit
                                                                    arr[index] = raw;
                                                                    updateField('verificationCode', arr.join('').slice(0, 6));
                                                                    setVerificationStatus('default');
                                                                    // move focus to next
                                                                    if (raw && index < 5) {
                                                                        const next = digitRefs.current[index + 1];
                                                                        if (next) next.focus();
                                                                    }
                                                                }}
                                                                
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Backspace') {
                                                                        if (e.target.value === '') {
                                                                            if (index > 0) {
                                                                                const prev = digitRefs.current[index - 1];
                                                                                if (prev) {
                                                                                    const arr = (form.verificationCode || '').split('');
                                                                                    while (arr.length < 6) arr.push('');
                                                                                    arr[index - 1] = '';
                                                                                    updateField('verificationCode', arr.join('').slice(0, 6));
                                                                                    prev.focus();
                                                                                    e.preventDefault();
                                                                                }
                                                                            }
                                                                        }
                                                                    } else if (e.key === 'ArrowLeft' && index > 0) {
                                                                        const prev = digitRefs.current[index - 1];
                                                                        if (prev) prev.focus();
                                                                        e.preventDefault();
                                                                    } else if (e.key === 'ArrowRight' && index < 5) {
                                                                        const next = digitRefs.current[index + 1];
                                                                        if (next) next.focus();
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                onPaste={(e) => {
                                                                    const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
                                                                    if (!paste) return;
                                                                    const arr = (form.verificationCode || '').split('');
                                                                    while (arr.length < 6) arr.push('');
                                                                    for (let i = 0; i < paste.length && index + i < 6; i++) arr[index + i] = paste[i];
                                                                    updateField('verificationCode', arr.join('').slice(0, 6));
                                                                    const nextIdx = Math.min(5, index + paste.length);
                                                                    const next = digitRefs.current[nextIdx];
                                                                    if (next) next.focus();
                                                                    e.preventDefault();
                                                                }}
                                                                disabled={verificationStatus === 'success' || !(emailChanged && hasRequestedCode)}
                                                                readOnly={verificationStatus === 'success'}
                                                                className={`w-11 h-11 text-center text-2xl font-extrabold rounded-md transition-all ${
                                                                    verificationStatus === 'error'
                                                                        ? 'bg-red-500/10 border border-red-500 text-red-500'
                                                                        : verificationStatus === 'success'
                                                                            ? 'bg-green-500/10 border border-green-500 text-green-500'
                                                                            : 'bg-[#111111] border border-white/10 text-white hover:border-brand-500/50 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none'
                                                                } disabled:cursor-not-allowed disabled:opacity-50`}
                                                            />
                                                            {index === 2 && (
                                                                <div className="w-5 text-2xl text-center text-white mx-1">-</div>
                                                            )}
                                                        </span>
                                                    ))}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={handleVerify}
                                                    disabled={verificationStatus === 'success' || !(hasRequestedCode && (form.verificationCode || '').trim().length === 6)}
                                                    className={`flex-1 h-11 px-4 py-2.5 rounded-xl font-semibold text-base transition flex items-center justify-center whitespace-nowrap ${
                                                        verificationStatus === 'error'
                                                            ? 'bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500/30'
                                                            : verificationStatus === 'success'
                                                                ? 'bg-green-500/20 border border-green-500 text-green-500'
                                                                : 'bg-brand-500/10 border border-brand-500 text-brand-500 hover:bg-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50'
                                                    }`}
                                                >
                                                    {verificationStatus === 'success' ? '✓ Verified' : verificationStatus === 'error' ? 'Try Again' : 'Verify'}
                                                </button>
                                            </div>

                                            {verificationStatus === 'error' && (
                                                <p className="text-xs sm:text-sm text-red-400">Incorrect code. Please check your email and try again.</p>
                                            )}
                                            {verificationStatus === 'success' && (
                                                <p className="text-xs sm:text-sm text-green-400">Email verified successfully!</p>
                                            )}
                                            {verificationStatus === 'default' && (
                                                <p className="text-xs sm:text-sm text-gray-400">Verification code sent to email.</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="grid gap-3 md:grid-cols-2">
                                <Field label="Squad" error={errors.squad}>
                                    <TextInput
                                        value={form.squad}
                                        onChange={(event) => updateField('squad', event.target.value)}
                                        placeholder="e.g. MSLPH"
                                        error={errors.squad}
                                    />
                                </Field>
                                <Field label="Squad Abbrev." error={errors.squadAbbreviation}>
                                    <TextInput
                                        value={form.squadAbbreviation}
                                        onChange={(event) => updateField('squadAbbreviation', event.target.value)}
                                        placeholder="e.g. MSLPH"
                                        error={errors.squadAbbreviation}
                                    />
                                </Field>
                            </div>

                            <div className="grid items-end gap-3 grid-cols-[minmax(0,1fr)_210px]">
                                <Field label="MLBB IGN">
                                    <TextInput value={form.mlbbIgn} disabled />
                                </Field>
                                <button
                                    type="button"
                                    className="h-11 rounded-xl border border-brand-500 bg-brand-500/10 px-4 py-2.5 text-sm sm:text-base font-semibold text-brand-500 transition hover:bg-brand-500/20"
                                    onClick={() => setDialog({ type: 'mlbbVerify' })}
                                >
                                    Change MLBB Account
                                </button>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                                <Field label="MLBB ID">
                                    <TextInput value={form.mlbbId} disabled />
                                </Field>
                                <Field label="MLBB Server">
                                    <TextInput value={form.mlbbServer} disabled />
                                </Field>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6 px-3">
                            <div className="student-profile-scrollbar grid max-h-96 w-full grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2">
                                {coverPhotos.map((cover) => (
                                    <button
                                        key={cover.id}
                                        type="button"
                                        className={`relative h-32 overflow-hidden rounded-xl bg-zinc-800/60 text-left shadow-[inset_0_-6px_4px_rgba(0,0,0,0.4)] ${
                                            selectedCoverId === cover.id ? 'outline outline-2 outline-brand-500' : ''
                                        }`}
                                        onClick={() => setSelectedCoverId(cover.id)}
                                    >
                                        <img
                                            src={cover.image}
                                            alt=""
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-stone-500/0 to-black/35" />
                                        {cover.status === 'active' ? (
                                            <span className="absolute right-3 top-3 rounded-md bg-brand-500 px-1.5 py-0.5 text-xs font-medium text-gray-900">
                                                Active
                                            </span>
                                        ) : null}
                                    </button>
                                ))}
                            </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        // apply the currently selected cover as the one to save
                                        setAppliedCoverId(selectedCoverId);
                                    }}
                                    className="w-36 rounded-xl border border-brand-500 bg-brand-500/10 px-3 py-2 text-sm font-semibold text-brand-500 transition hover:bg-brand-500/20"
                                >
                                    USE
                                </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2.5 px-7 pt-3 md:px-11">
                    <button
                        type="button"
                        className="rounded-xl border border-red-500 bg-red-900/70 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-800 md:text-base"
                        onClick={() => {
                            setDeleteConfirmation('');
                            setDialog({ type: 'deleteConfirm' });
                        }}
                    >
                        Delete Account
                    </button>
                    <button
                        type="button"
                        disabled={!hasChanges || (emailChanged && verificationStatus !== 'success')}
                        className={`rounded-xl border border-brand-500 bg-brand-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-brand-400 md:text-base ${
                            (!hasChanges || (emailChanged && verificationStatus !== 'success')) ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {dialog?.type === 'mlbbVerify' ? (
                <StatusDialog
                    title="Verify your MLBB Account"
                    description="You will be redirected to log in and verify your Mobile Legends account. This step confirms your MLBB profile before submitting your entry."
                    onCancel={() => setDialog(null)}
                    onConfirm={() => setDialog({ type: 'mlbbSuccess', title: 'ML Account Updated Successfully!' })}
                    centered
                />
            ) : null}

            {dialog?.type === 'mlbbSuccess' ? (
                <StatusDialog
                    title="ML Account Updated Successfully!"
                    onConfirm={() => setDialog(null)}
                    centered
                />
            ) : null}

            {dialog?.type === 'deleteConfirm' ? (
                <StatusDialog
                    title="Permanently Delete your MSL Account?"
                    description="You will lose all data and access to MSL Website but you can still sign up again if you want to create a new account."
                    confirmLabel="Delete Account"
                    destructive
                    centered
                    disabledConfirm={deleteConfirmation.trim() !== 'DELETE'}
                    onCancel={() => setDialog(null)}
                    onConfirm={() => {
                        if (deleteConfirmation.trim() !== 'DELETE') {
                            return;
                        }

                        setDialog({ type: 'deleteSuccess' });
                    }}
                >
                    <div className="flex flex-col gap-2">
                        <div className="text-base font-semibold leading-6 text-brand-500">
                            Instructions
                        </div>
                        <div className="text-sm leading-5 text-gray-300">
                            To confirm that you want to delete your account, please type{' '}
                            <span className="font-bold text-red-400">DELETE</span> in the field below.
                        </div>
                        <input
                            value={deleteConfirmation}
                            onChange={(event) => setDeleteConfirmation(event.target.value)}
                            placeholder="DELETE"
                            className="rounded-xl border border-white/10 bg-[#0b0b0b] px-3.5 py-2.5 font-['Figtree'] text-base leading-6 text-white outline-none placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus-visible:outline-none"
                        />
                        {deleteConfirmation && deleteConfirmation.trim() !== 'DELETE' ? (
                            <div className="text-xs font-medium text-red-400">
                                Type DELETE exactly to continue.
                            </div>
                        ) : null}
                    </div>
                </StatusDialog>
            ) : null}

            {dialog?.type === 'deleteSuccess' ? (
                <StatusDialog
                    title="MSL Account deleted successfully!"
                    centered
                    onConfirm={() => {
                        window.location.href = '/login';
                    }}
                />
            ) : null}

            {dialog?.type === 'success' ? (
                <StatusDialog
                    title={dialog.title}
                    onConfirm={() => {
                        setDialog(null);
                        onClose();
                    }}
                    centered
                />
            ) : null}
        </div>
    );
}
