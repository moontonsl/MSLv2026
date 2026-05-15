import React from 'react';
import styles from '../../register.module.scss';
import { ChevronDown, Search, UploadCloud } from 'lucide-react';
import { shsAcademicStrands, shsSchoolOptions } from '../../data/shsOptions';

const allowedFileTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
];

const Step2EducationDetails = React.forwardRef(function Step2EducationDetails(
    { data, handleInputChange, step2ValidationTrigger },
    ref
) {
    const schoolDropdownRef = React.useRef(null);
    const strandDropdownRef = React.useRef(null);
    const fileInputRef = React.useRef(null);
    const previousValidationTriggerRef = React.useRef(step2ValidationTrigger);
    const requiredFields = [
        'yearLevel',
        'university',
        'island',
        'region',
        'studentId',
        'course',
        'proofOfEnrollment',
    ];

    const [errors, setErrors] = React.useState({});
    const [schoolOpen, setSchoolOpen] = React.useState(false);
    const [strandOpen, setStrandOpen] = React.useState(false);
    const [schoolSearch, setSchoolSearch] = React.useState('');
    const [strandSearch, setStrandSearch] = React.useState('');

    const setFieldError = (name, error) => {
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const clearFieldError = (name) => {
        setFieldError(name, '');
    };

    const getFieldClassName = (name, extraClasses = '') => {
        return [
            styles['input-field-register'],
            'w-full p-3 rounded-lg border transition-all outline-none',
            errors[name]
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400',
            extraClasses,
        ]
            .filter(Boolean)
            .join(' ');
    };

    const getFieldStyle = (name) => {
        if (errors[name]) {
            return {
                borderColor: '#ef4444',
                boxShadow: '0 0 0 1px #ef4444',
            };
        }

        return {};
    };

    const renderFieldError = (name) =>
        errors[name] ? <p className="mt-1 text-sm text-red-400">{errors[name]}</p> : null;

    const validateSelection = (name, value, label) => {
        if (!value || !value.toString().trim()) {
            setFieldError(name, `${label} is required.`);
            return false;
        }

        clearFieldError(name);
        return true;
    };

    const validateSchoolDependentFields = () => {
        if (!data.university) {
            const message = 'Please select your school name first.';
            setFieldError('island', message);
            setFieldError('region', message);
            return false;
        }

        clearFieldError('island');
        clearFieldError('region');
        return true;
    };

    const validateStudentId = (value) => {
        if (!value || !value.trim()) {
            setFieldError('studentId', 'Student ID is required.');
            return false;
        }

        if (!/^[A-Za-z0-9-]+$/.test(value)) {
            setFieldError('studentId', 'Student ID can only contain letters, numbers, and dashes.');
            return false;
        }

        if (!/[A-Za-z]/.test(value) || !/\d/.test(value) || !/-/.test(value)) {
            setFieldError('studentId', 'Student ID must include letters, numbers, and a dash.');
            return false;
        }

        clearFieldError('studentId');
        return true;
    };

    const validateFile = (file) => {
        if (!file) {
            setFieldError('proofOfEnrollment', 'Proof of Enrollment / School ID is required.');
            return false;
        }

        if (!allowedFileTypes.includes(file.type)) {
            setFieldError(
                'proofOfEnrollment',
                'File must be PDF, JPG, JPEG, PNG, or GIF.'
            );
            return false;
        }

        clearFieldError('proofOfEnrollment');
        return true;
    };

    const validateStep2 = () => {
        const schoolOk = validateSelection('university', data.university, 'Name of School');
        const strandOk = validateSelection('course', data.course, 'Academic Strand');
        const yearOk = validateSelection('yearLevel', data.yearLevel, 'Year Level');
        const studentIdOk = validateStudentId(data.studentId);
        const fileOk = validateFile(data.proofOfEnrollment);
        const schoolDependentOk = validateSchoolDependentFields();

        return schoolOk && strandOk && yearOk && studentIdOk && fileOk && schoolDependentOk;
    };

    const filteredSchools = shsSchoolOptions.filter((school) => {
        const query = schoolSearch.toLowerCase().trim();
        if (!query) return true;

        return (
            school.name.toLowerCase().includes(query) ||
            school.island.toLowerCase().includes(query) ||
            school.region.toLowerCase().includes(query)
        );
    });

    const filteredStrands = shsAcademicStrands.filter((strand) => {
        const query = strandSearch.toLowerCase().trim();
        if (!query) return true;

        return strand.toLowerCase().includes(query);
    });

    const handleSchoolSelect = (school) => {
        handleInputChange({ target: { name: 'university', value: school.name } });
        handleInputChange({ target: { name: 'island', value: school.island } });
        handleInputChange({ target: { name: 'region', value: school.region } });
        clearFieldError('university');
        clearFieldError('island');
        clearFieldError('region');
        setSchoolOpen(false);
        setSchoolSearch('');
    };

    const handleStrandSelect = (strand) => {
        const strandValue = typeof strand === 'string' ? strand : strand?.name || '';

        handleInputChange({ target: { name: 'course', value: strandValue } });
        clearFieldError('course');
        setStrandOpen(false);
        setStrandSearch('');
    };

    const handleStudentIdChange = (e) => {
        const rawValue = e.target.value;
        handleInputChange(e);

        if (!rawValue) {
            clearFieldError('studentId');
            return;
        }

        if (/^[A-Za-z0-9-]+$/.test(rawValue) && /[A-Za-z]/.test(rawValue) && /\d/.test(rawValue) && /-/.test(rawValue)) {
            clearFieldError('studentId');
            return;
        }

        setFieldError('studentId', 'Student ID must include letters, numbers, and a dash.');
    };

    const handleStudentIdPaste = (e) => {
        e.preventDefault();

        const pastedValue = e.clipboardData.getData('text');

        if (/^[A-Za-z0-9-]+$/.test(pastedValue) && /[A-Za-z]/.test(pastedValue) && /\d/.test(pastedValue) && /-/.test(pastedValue)) {
            handleInputChange({
                target: {
                    name: 'studentId',
                    value: pastedValue,
                },
            });
            clearFieldError('studentId');
            return;
        }

        if (pastedValue.trim()) {
            setFieldError('studentId', 'Student ID must include letters, numbers, and a dash.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;

        if (!file) {
            handleInputChange({ target: { name: 'proofOfEnrollment', value: null } });
            setFieldError('proofOfEnrollment', 'Proof of Enrollment / School ID is required.');
            return;
        }

        if (!validateFile(file)) {
            handleInputChange({ target: { name: 'proofOfEnrollment', value: null } });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        handleInputChange(e);
    };

    React.useEffect(() => {
        const handleOutsideClick = (event) => {
            if (schoolDropdownRef.current && !schoolDropdownRef.current.contains(event.target)) {
                setSchoolOpen(false);
            }

            if (strandDropdownRef.current && !strandDropdownRef.current.contains(event.target)) {
                setStrandOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    React.useEffect(() => {
        if (previousValidationTriggerRef.current === step2ValidationTrigger) {
            return;
        }

        previousValidationTriggerRef.current = step2ValidationTrigger;

        if (!step2ValidationTrigger) {
            return;
        }

        validateStep2();
    }, [step2ValidationTrigger]);

    React.useEffect(() => {
        if (data.university) {
            clearFieldError('university');
        }
        if (data.course) {
            clearFieldError('course');
        }
        if (data.yearLevel) {
            clearFieldError('yearLevel');
        }
        if (data.studentId) {
            validateStudentId(data.studentId);
        }
        if (data.proofOfEnrollment) {
            validateFile(data.proofOfEnrollment);
        }
    }, [data.university, data.course, data.yearLevel, data.studentId, data.proofOfEnrollment]);

    React.useImperativeHandle(ref, () => ({
        validateStep2,
    }));

    const renderSelectBox = (label, value, placeholder, open, setOpen, ref, errorName, searchValue, setSearchValue, items, onSelect, searchPlaceholder) => (
        <div className="relative" ref={ref}>
            <label className={`${styles['label-register']} block mb-1`}>
                {label} <span className={styles.required}>*</span>
            </label>

            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={getFieldClassName(errorName, 'flex items-center justify-between text-left')}
                style={getFieldStyle(errorName)}
            >
                <span className={`${value ? 'text-white' : 'text-gray-500'} truncate`}>
                    {value || placeholder}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
            </button>

            {errors[errorName] && (
                <div className="absolute right-10 top-[45px] flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                    !
                </div>
            )}

            {open && (
                <div className="absolute z-30 mt-2 w-full rounded-xl border border-white/10 bg-[#111111] shadow-2xl overflow-hidden">
                    <div className="p-3 border-b border-white/10">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder={searchPlaceholder}
                                className={getFieldClassName(errorName, 'pl-10')}
                            />
                        </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                        {items.length ? (
                            items.map((item) => (
                                <button
                                    key={item.id || item}
                                    type="button"
                                    onClick={() => onSelect(item)}
                                    className="w-full px-4 py-3 text-left text-sm text-white hover:bg-yellow-500/10 hover:text-yellow-300 transition"
                                >
                                    {item.name || item}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-400">No results found.</div>
                        )}
                    </div>
                </div>
            )}

            {renderFieldError(errorName)}
        </div>
    );

    return (
        <div>
            <h1 className={`${styles['title-register']} text-2xl md:text-3xl mb-1`}>
                Account Creation
            </h1>

            <h2 className={`${styles['subtitle-register']} text-[0.5rem] leading-none md:text-sm text-white/60 md:text-white/70 mb-2 md:mb-1 tracking-[0.04em] md:tracking-[0.18em]`}>
                SCHOOL DETAILS
            </h2>

            {(() => {
                const filled = requiredFields.filter(
                    (field) => data[field] && data[field].toString().trim() !== ''
                ).length;

                const percent = 25 + Math.round((filled / requiredFields.length) * 25);

                return (
                    <div className="mb-3 text-center">
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-500 transition-all"
                                style={{ width: `${percent}%` }}
                            />
                        </div>

                        <p className="text-xs text-white/60 mt-4 mb-6 text-center">
                            STEP 2 of 4 - {percent}% OF THIS STEP COMPLETE
                        </p>
                    </div>
                );
            })()}

            <div className="flex flex-col gap-4 mb-4">
                {renderSelectBox(
                    'Senior High School',
                    data.university,
                    'Select your school',
                    schoolOpen,
                    setSchoolOpen,
                    schoolDropdownRef,
                    'university',
                    schoolSearch,
                    setSchoolSearch,
                    filteredSchools,
                    handleSchoolSelect,
                    'Search school...'
                )}
            </div>

            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <div className="w-full">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Island <span className={styles.required}>*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="island"
                            value={data.island}
                            readOnly
                            placeholder="Auto-filled"
                            className={getFieldClassName('island', 'bg-gray-800 cursor-not-allowed pr-10')}
                            style={getFieldStyle('island')}
                        />
                        {errors.island && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                                !
                            </div>
                        )}
                    </div>
                    {renderFieldError('island')}
                </div>

                <div className="w-full">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Region <span className={styles.required}>*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="region"
                            value={data.region}
                            readOnly
                            placeholder="Auto-filled"
                            className={getFieldClassName('region', 'bg-gray-800 cursor-not-allowed pr-10')}
                            style={getFieldStyle('region')}
                        />
                        {errors.region && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                                !
                            </div>
                        )}
                    </div>
                    {renderFieldError('region')}
                </div>
            </div>

            <div className="flex flex-col gap-4 mb-4">
                {renderSelectBox(
                    'Academic Strand',
                    data.course,
                    'Select strand',
                    strandOpen,
                    setStrandOpen,
                    strandDropdownRef,
                    'course',
                    strandSearch,
                    setStrandSearch,
                    filteredStrands.map((strand) => ({ id: strand, name: strand })),
                    handleStrandSelect,
                    'Search strand...'
                )}
            </div>

            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <div className="w-full relative">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Year Level <span className={styles.required}>*</span>
                    </label>
                    <select
                        name="yearLevel"
                        value={data.yearLevel}
                        onChange={(e) => {
                            handleInputChange(e);
                            clearFieldError(e.target.name);
                        }}
                        onBlur={(e) => validateSelection(e.target.name, e.target.value, 'Year Level')}
                        className={getFieldClassName('yearLevel', 'pr-10 appearance-none')}
                        style={getFieldStyle('yearLevel')}
                    >
                        <option value="" disabled>
                            Select year level
                        </option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-[45px] h-4 w-4 pointer-events-none text-gray-400" />
                    {errors.yearLevel && (
                        <div className="absolute right-10 top-[45px] flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                            !
                        </div>
                    )}
                    {renderFieldError('yearLevel')}
                </div>

                <div className="w-full">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Student ID <span className={styles.required}>*</span>
                    </label>
                    <div className="relative">
                    <input
                        type="text"
                        name="studentId"
                        value={data.studentId}
                        onChange={handleStudentIdChange}
                        onPaste={handleStudentIdPaste}
                        onBlur={(e) => validateStudentId(e.target.value)}
                        inputMode="text"
                        pattern="[A-Za-z0-9-]*"
                        maxLength={20}
                        placeholder="Letters, numbers, and dashes only"
                        className={getFieldClassName('studentId', 'pr-10')}
                        style={getFieldStyle('studentId')}
                    />
                        {errors.studentId && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                                !
                            </div>
                        )}
                    </div>
                    {renderFieldError('studentId')}
                </div>
            </div>

            <div className="mb-6">
                <label className={`${styles['label-register']} block mb-1`}>
                    Proof of Enrollment / School ID <span className={styles.required}>*</span>
                </label>
                <div className="relative">
                    <input
                        ref={fileInputRef}
                        type="file"
                        name="proofOfEnrollment"
                        accept=".pdf,.jpg,.jpeg,.png,.gif,application/pdf,image/jpeg,image/png,image/gif"
                        onChange={handleFileChange}
                        className="hidden"
                        id="proofOfEnrollment"
                    />

                    <label
                        htmlFor="proofOfEnrollment"
                        className={`${styles['input-field-register']} w-full p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            errors.proofOfEnrollment
                                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                : 'border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400'
                        }`}
                        style={getFieldStyle('proofOfEnrollment')}
                    >
                        <span className="truncate text-gray-300">
                            {data.proofOfEnrollment?.name
                                ? `Selected File : ${data.proofOfEnrollment.name}`
                                : 'Upload PDF, JPG, JPEG, PNG, or GIF'}
                        </span>
                        <UploadCloud className="h-5 w-5 text-gray-400" />
                    </label>
                    {errors.proofOfEnrollment && (
                        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                            !
                        </div>
                    )}
                </div>
                {renderFieldError('proofOfEnrollment')}
            </div>
        </div>
    );
});

export default Step2EducationDetails;
