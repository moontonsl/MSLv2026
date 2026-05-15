import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ChevronDown, FileUp, Info, Search, X } from 'lucide-react';
import { collegeSchoolOptions } from '@/Pages/AccountCreation/data/collegeOptions';
import { shsSchoolOptions } from '@/Pages/AccountCreation/data/shsOptions';
import {
    collegeCoursePrograms,
    collegeYearLevels,
    shsCourseStrands,
    shsYearLevels,
} from '@/Pages/StudentProfile/profileEditOptions';
import { getAccountRenewalRequirements } from './AccountRenewalLists';

const maxFileSize = 2 * 1024 * 1024;
const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

const defaultProfile = {
    fullName: 'Norberto Pingoy',
    username: 'DAKI',
    email: 'youremail@school.edu.ph',
    school: 'West Visayas State University',
    ign: 'DAKI',
    status: 'Renewal Required',
};

function FieldShell({ label, hint, error, children }) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold leading-5 text-white">{label}</span>
            {children}
            {error ? (
                <span className="font-['Figtree'] text-sm font-medium leading-5 text-red-400">{error}</span>
            ) : hint ? (
                <span className="font-['Figtree'] text-sm leading-5 text-gray-400">{hint}</span>
            ) : null}
        </label>
    );
}

function TextInput(props) {
    return (
        <input
            {...props}
            className="w-full rounded-xl border border-white/10 bg-[#111111] px-3.5 py-2.5 font-['Figtree'] text-base leading-6 text-white outline-none transition placeholder:text-gray-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
    );
}

function SelectInput({ children, ...props }) {
    return (
        <div className="relative">
            <select
                {...props}
                className="w-full appearance-none rounded-xl border border-white/10 bg-[#111111] px-3.5 py-2.5 pr-10 font-['Figtree'] text-base leading-6 text-white outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
    );
}

function SearchableSelect({
    value,
    placeholder = 'Select an option',
    searchPlaceholder,
    options,
    onChange,
    error,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const dropdownRef = useRef(null);

    const filteredOptions = useMemo(() => {
        const query = searchValue.toLowerCase().trim();
        if (!query) return options;

        return options.filter((option) => {
            if (typeof option === 'string') {
                return option.toLowerCase().includes(query);
            }

            return (
                option.name?.toLowerCase().includes(query) ||
                option.island?.toLowerCase().includes(query) ||
                option.region?.toLowerCase().includes(query)
            );
        });
    }, [options, searchValue]);

    useEffect(() => {
        function handleOutsideClick(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    function getOptionLabel(option) {
        return typeof option === 'string' ? option : option.name;
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className={`flex w-full items-center justify-between rounded-xl border bg-[#111111] px-3.5 py-2.5 text-left font-['Figtree'] text-base leading-6 outline-none transition ${
                    error
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-white/10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
                }`}
            >
                <span className={`line-clamp-1 truncate ${value ? 'text-white' : 'text-gray-500'}`}>
                    {value || placeholder}
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-gray-400 transition ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen ? (
                <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-2xl">
                    <div className="border-b border-white/10 p-3">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(event) => setSearchValue(event.target.value)}
                                placeholder={searchPlaceholder}
                                className="w-full rounded-lg border border-white/10 bg-[#0b0b0b] px-3.5 py-2.5 pl-10 font-['Figtree'] text-base leading-6 text-white outline-none placeholder:text-gray-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                            />
                        </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                        {filteredOptions.length ? (
                            filteredOptions.map((option) => {
                                const label = getOptionLabel(option);

                                return (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => {
                                            onChange(label);
                                            setIsOpen(false);
                                            setSearchValue('');
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm text-white transition hover:bg-brand-500/10 hover:text-brand-300"
                                    >
                                        {label}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-400">No results found.</div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function RequirementPanel({ title, children }) {
    return (
        <div className="rounded-2xl border border-brand-500/10 bg-[#0b0b0b] px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.22)]">
            <div className="mb-3 text-base font-semibold leading-6 text-white">{title}</div>
            {children}
        </div>
    );
}

function FileUpload({ id, label, file, error, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="text-xl font-bold leading-5 text-white font-['League_Spartan']">{label}</div>
            <label
                htmlFor={id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                    event.preventDefault();
                    onChange(event.dataTransfer.files?.[0] ?? null);
                }}
                className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border px-6 py-5 text-center transition ${
                    error
                        ? 'border-red-500 bg-red-900/20'
                        : 'border-white/10 bg-brand-500/10 hover:border-brand-500/40'
                }`}
            >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-brand-500/10 text-brand-500">
                    <FileUp className="h-5 w-5" />
                </span>
                <span className="text-sm leading-5 text-gray-300">
                    <span className="font-semibold text-brand-500">Click to upload</span> or drag and drop
                </span>
                <span className="text-xs leading-4 text-gray-300">JPEG, PNG, GIF, PDF (max. 2MB)</span>
                {file ? <span className="max-w-full truncate text-xs font-semibold text-white">{file.name}</span> : null}
            </label>
            <input
                id={id}
                type="file"
                accept="image/jpeg,image/png,image/gif,application/pdf"
                className="hidden"
                onChange={(event) => onChange(event.target.files?.[0] ?? null)}
            />
            {error ? <span className="text-xs font-medium text-red-400">{error}</span> : null}
        </div>
    );
}

export default function AccountRenewalModal({
    isOpen,
    onClose,
    onSubmit,
    renewalStatuses = {},
    profile = defaultProfile,
}) {
    const requirements = useMemo(() => getAccountRenewalRequirements(renewalStatuses), [renewalStatuses]);
    const requiredKeys = useMemo(() => new Set(requirements.map((item) => item.key)), [requirements]);
    const schoolOptions = useMemo(
        () => [...collegeSchoolOptions, ...shsSchoolOptions],
        [],
    );
    const courseOptions = useMemo(
        () => [...collegeCoursePrograms, ...shsCourseStrands],
        [],
    );
    const yearOptions = useMemo(
        () => [...collegeYearLevels, ...shsYearLevels],
        [],
    );
    const [form, setForm] = useState({
        school: '',
        course: '',
        yearLevel: '',
        studentId: '',
        firstName: '',
        lastName: '',
        documentFile: null,
    });
    const [errors, setErrors] = useState({});
    const profileDetails = {
        fullName: profile.fullName ?? defaultProfile.fullName,
        username: profile.username ?? defaultProfile.username,
        email: profile.email ?? defaultProfile.email,
        school: profile.school ?? defaultProfile.school,
        ign: profile.ign ?? defaultProfile.ign,
        status: profile.status ?? defaultProfile.status,
    };

    if (!isOpen || requirements.length === 0) return null;

    function updateField(name, value) {
        setForm((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({ ...current, [name]: '' }));
    }

    function validateFile(field, label) {
        const file = form[field];

        if (!file) return `${label} is required.`;
        if (!acceptedFileTypes.includes(file.type)) return 'Upload a JPEG, PNG, GIF, or PDF file.';
        if (file.size > maxFileSize) return 'File must not exceed 2MB.';

        return '';
    }

    function validate() {
        const nextErrors = {};

        if (requiredKeys.has('school') && !form.school) nextErrors.school = 'Please select your correct school.';
        if (requiredKeys.has('course') && !form.course) nextErrors.course = 'Please select your correct course.';
        if (requiredKeys.has('yearLevel') && !form.yearLevel) nextErrors.yearLevel = 'Please select your current year level.';
        if (requiredKeys.has('schoolId')) {
            if (!form.studentId.trim()) nextErrors.studentId = 'Student ID is required.';
        }
        if (requiredKeys.has('fullName')) {
            if (!form.firstName.trim()) nextErrors.firstName = 'First name is required.';
            if (!form.lastName.trim()) nextErrors.lastName = 'Last name is required.';
        }
        if (requiredKeys.has('document')) {
            const documentError = validateFile('documentFile', 'Document');
            if (documentError) nextErrors.documentFile = documentError;
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!validate()) return;

        const payload = {
            requirements: requirements.map((item) => item.key),
            school: form.school,
            course: form.course,
            yearLevel: form.yearLevel,
            studentId: form.studentId,
            firstName: form.firstName,
            lastName: form.lastName,
            documentFile: form.documentFile,
        };

        if (onSubmit) {
            onSubmit(payload);
        } else {
            console.log('Account renewal submitted', payload);
        }
    }

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
            <style>
                {`
                    .account-renewal-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: rgba(242, 194, 26, 0.75) rgba(255, 255, 255, 0.08);
                    }

                    .account-renewal-scrollbar::-webkit-scrollbar {
                        width: 8px;
                    }

                    .account-renewal-scrollbar::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.08);
                        border-radius: 999px;
                    }

                    .account-renewal-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(242, 194, 26, 0.9);
                        border-radius: 999px;
                        border: 2px solid rgba(11, 11, 11, 0.9);
                    }
                `}
            </style>

            <form
                onSubmit={handleSubmit}
                className="relative flex max-h-[92vh] w-full max-w-[820px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] py-7 shadow-2xl md:py-12"
            >
                {onClose ? (
                    <button
                        type="button"
                        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/5 hover:text-white md:right-4 md:top-4"
                        onClick={onClose}
                        aria-label="Close account renewal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                ) : null}

                <div className="px-6 text-center md:px-8">
                    <h2 className="text-3xl font-black leading-8 text-white font-['League_Spartan']">
                        Account Renewal Required
                    </h2>
                    <p className="mt-3 text-base leading-6 text-gray-300">
                        Please upload/update your details to continue.
                    </p>
                </div>

                <div className="account-renewal-scrollbar mt-5 flex min-h-0 flex-col gap-6 overflow-y-auto px-5 md:px-8">
                    <div className="flex gap-2 rounded-[10px] border border-red-500 bg-red-900/30 py-2 pl-2 pr-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                        <p className="text-xs leading-4 text-red-300">
                            <span className="font-semibold text-red-200">Action Required </span>
                            Your Account has been marked for renewal. To regain access to the MSL platform, please upload a current proof of enrollment document and update your year level.
                        </p>
                    </div>

                    <section className="border-b border-white/10 px-3 pb-5">
                        <h3 className="text-xl font-bold leading-5 text-white font-['League_Spartan']">
                            Account Details
                        </h3>
                        <div className="mt-4 grid gap-4 text-base md:grid-cols-2">
                            {[
                                ['Full name', profileDetails.fullName],
                                ['Username', profileDetails.username],
                                ['Email', profileDetails.email],
                                ['School', profileDetails.school],
                                ['In-Game Name (IGN)', profileDetails.ign],
                            ].map(([label, value]) => (
                                <div key={label}>
                                    <div className="leading-6 text-gray-400">{label}</div>
                                    <div className="font-semibold leading-6 text-gray-300">{value}</div>
                                </div>
                            ))}
                            <div>
                                <div className="leading-6 text-gray-400">Status</div>
                                <span className="mt-1 inline-flex rounded-full border border-red-500 bg-red-900/30 px-2.5 py-0.5 text-sm font-medium leading-5 text-red-400">
                                    {profileDetails.status}
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-col gap-3 border-b border-white/10 px-3 pb-5">
                        {requiredKeys.has('document') ? (
                            <FileUpload
                                id="renewal-document"
                                label="Upload Proof of Enrollment"
                                file={form.documentFile}
                                error={errors.documentFile}
                                onChange={(file) => updateField('documentFile', file)}
                            />
                        ) : null}

                        {requiredKeys.has('schoolId') ? (
                            <RequirementPanel title="Update School ID">
                                <FieldShell label="Student ID" error={errors.studentId}>
                                    <TextInput
                                        value={form.studentId}
                                        onChange={(event) => updateField('studentId', event.target.value)}
                                        placeholder="e.g. 2026-0001"
                                    />
                                </FieldShell>
                            </RequirementPanel>
                        ) : null}

                        {requiredKeys.has('school') ? (
                            <RequirementPanel title="Update your School">
                                <FieldShell label="School" hint="Please select your correct school." error={errors.school}>
                                    <SearchableSelect
                                        value={form.school}
                                        options={schoolOptions}
                                        searchPlaceholder="Search university / college school..."
                                        error={errors.school}
                                        onChange={(value) => updateField('school', value)}
                                    />
                                </FieldShell>
                            </RequirementPanel>
                        ) : null}

                        {requiredKeys.has('course') ? (
                            <RequirementPanel title="Update your Course">
                                <FieldShell label="Course" hint="Please select your correct course." error={errors.course}>
                                    <SearchableSelect
                                        value={form.course}
                                        options={courseOptions}
                                        searchPlaceholder="Search course or program..."
                                        error={errors.course}
                                        onChange={(value) => updateField('course', value)}
                                    />
                                </FieldShell>
                            </RequirementPanel>
                        ) : null}

                        {requiredKeys.has('yearLevel') ? (
                            <RequirementPanel title="Update your Year Level">
                                <FieldShell label="Year Level" hint="Please select your current year level." error={errors.yearLevel}>
                                    <SelectInput value={form.yearLevel} onChange={(event) => updateField('yearLevel', event.target.value)}>
                                        <option value="" disabled>Select an option</option>
                                        {yearOptions.map((yearLevel) => (
                                            <option key={yearLevel} value={yearLevel}>{yearLevel}</option>
                                        ))}
                                    </SelectInput>
                                </FieldShell>
                            </RequirementPanel>
                        ) : null}

                        {requiredKeys.has('fullName') ? (
                            <RequirementPanel title="Update your Full Name">
                                <div className="grid gap-3 md:grid-cols-2">
                                    <FieldShell label="First Name" error={errors.firstName}>
                                        <TextInput
                                            value={form.firstName}
                                            onChange={(event) => updateField('firstName', event.target.value)}
                                            placeholder="e.g. Juan"
                                        />
                                    </FieldShell>
                                    <FieldShell label="Last Name" error={errors.lastName}>
                                        <TextInput
                                            value={form.lastName}
                                            onChange={(event) => updateField('lastName', event.target.value)}
                                            placeholder="e.g. Dela Cruz"
                                        />
                                    </FieldShell>
                                </div>
                            </RequirementPanel>
                        ) : null}
                    </section>

                    <div className="flex gap-2 rounded-[10px] border border-blue-700 bg-blue-700/20 py-2 pl-2 pr-3">
                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                        <div className="text-xs leading-4">
                            <div className="font-semibold text-blue-500">What Happens after Upload?</div>
                            <div className="mt-1 text-blue-200">
                                Your document will be reviewed by our team.<br />
                                You will receive an email notification once verified.<br />
                                You will regain access to all MSL platform features.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 pt-6">
                    <button
                        type="submit"
                        className="w-full rounded-xl border border-brand-500 bg-brand-500 px-4 py-3 text-base font-semibold leading-6 text-black transition hover:bg-brand-400"
                    >
                        Submit for Review
                    </button>
                </div>
            </form>
        </div>
    );
}
