import React from 'react';
import axios from 'axios';
import styles from '../../register.module.scss';
import { ChevronDown, HelpCircle, Search, UploadCloud, X } from 'lucide-react';
import { collegePrograms } from '../../data/collegeOptions';

const allowedFileTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
];

export const PH_REGIONS = [
    { code: 'NCR', name: 'National Capital Region (NCR)', island: 'Luzon' },
    { code: 'CAR', name: 'Cordillera Administrative Region (CAR)', island: 'Luzon' },
    { code: 'Region I', name: 'Region I (Ilocos Region)', island: 'Luzon' },
    { code: 'Region II', name: 'Region II (Cagayan Valley)', island: 'Luzon' },
    { code: 'Region III', name: 'Region III (Central Luzon)', island: 'Luzon' },
    { code: 'Region IV-A', name: 'Region IV-A (CALABARZON)', island: 'Luzon' },
    { code: 'Region IV-B', name: 'Region IV-B (MIMAROPA)', island: 'Luzon' },
    { code: 'Region V', name: 'Region V (Bicol Region)', island: 'Luzon' },
    { code: 'Region VI', name: 'Region VI (Western Visayas)', island: 'Visayas' },
    { code: 'Region VII', name: 'Region VII (Central Visayas)', island: 'Visayas' },
    { code: 'Region VIII', name: 'Region VIII (Eastern Visayas)', island: 'Visayas' },
    { code: 'Region IX', name: 'Region IX (Zamboanga Peninsula)', island: 'Mindanao' },
    { code: 'Region X', name: 'Region X (Northern Mindanao)', island: 'Mindanao' },
    { code: 'Region XI', name: 'Region XI (Davao Region)', island: 'Mindanao' },
    { code: 'Region XII', name: 'Region XII (SOCCSKSARGEN)', island: 'Mindanao' },
    { code: 'Region XIII', name: 'Region XIII (Caraga)', island: 'Mindanao' },
    { code: 'BARMM', name: 'BARMM (Bangsamoro)', island: 'Mindanao' },
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
    const [schoolsList, setSchoolsList] = React.useState([]);
    const [schoolsLoading, setSchoolsLoading] = React.useState(false);
    const [isManualSchool, setIsManualSchool] = React.useState(false);

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
        let valid = true;
        if (!data.university || !data.university.trim()) {
            setFieldError('university', 'Name of University / College is required.');
            valid = false;
        }
        if (!data.island || !data.island.trim()) {
            setFieldError('island', 'Island is required.');
            valid = false;
        }
        if (!data.region || !data.region.trim()) {
            setFieldError('region', 'Region is required.');
            valid = false;
        }

        return valid;
    };

    const validateStudentId = (value) => {
        if (!value || !value.trim()) {
            setFieldError('studentId', 'Student ID is required.');
            return false;
        }

        clearFieldError('studentId');
        return true;
    };

    const validateFile = (file) => {
        if (!file) {
            setFieldError('proofOfEnrollment', 'Proof of Enrollment / School ID with Validation is required.');
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
        const schoolOk = validateSelection('university', data.university, 'University / College School');
        const strandOk = validateSelection('course', data.course, 'Course or Programs');
        const yearOk = validateSelection('yearLevel', data.yearLevel, 'Year Level');
        const studentIdOk = validateStudentId(data.studentId);
        const fileOk = validateFile(data.proofOfEnrollment);
        const schoolDependentOk = validateSchoolDependentFields();

        return schoolOk && strandOk && yearOk && studentIdOk && fileOk && schoolDependentOk;
    };

    React.useEffect(() => {
        let isMounted = true;
        setSchoolsLoading(true);

        const debounceTimer = setTimeout(async () => {
            try {
                const response = await axios.get(route('schools.search.college'), {
                    params: { q: schoolSearch.trim() },
                });
                if (isMounted) {
                    setSchoolsList(response.data || []);
                }
            } catch (err) {
                console.error('Failed to search colleges:', err);
            } finally {
                if (isMounted) {
                    setSchoolsLoading(false);
                }
            }
        }, 200);

        return () => {
            isMounted = false;
            clearTimeout(debounceTimer);
        };
    }, [schoolSearch]);

    const filteredStrands = collegePrograms.filter((strand) => {
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
        handleInputChange(e);

        if (!e.target.value.trim()) {
            clearFieldError('studentId');
            return;
        }

        clearFieldError('studentId');
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;

        if (!file) {
            handleInputChange({ target: { name: 'proofOfEnrollment', value: null } });
            setFieldError('proofOfEnrollment', 'Proof of Enrollment / School ID with Validation is required.');
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

    const renderSelectBox = (
        label,
        value,
        placeholder,
        open,
        setOpen,
        ref,
        errorName,
        searchValue,
        setSearchValue,
        items,
        onSelect,
        searchPlaceholder,
        isLoading = false,
        onManualEntry = null
    ) => (
        <div className="relative" ref={ref}>
            <div className="flex items-center justify-between mb-1">
                <label className={`${styles['label-register']}`}>
                    {label} <span className={styles.required}>*</span>
                </label>
                {onManualEntry && (
                    <button
                        type="button"
                        onClick={onManualEntry}
                        className="text-xs text-yellow-400 hover:text-yellow-300 transition"
                    >
                        Can't find your school? Enter manually
                    </button>
                )}
            </div>

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
                <div className="absolute z-40 mt-2 w-full rounded-xl border border-yellow-500/20 bg-[#111111] shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-3 border-b border-white/10 bg-[#161616]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder={searchPlaceholder}
                                className={getFieldClassName(errorName, 'pl-10 pr-8 bg-[#0a0a0a] text-sm')}
                                autoFocus
                            />
                            {searchValue && (
                                <button
                                    type="button"
                                    onClick={() => setSearchValue('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        {items && items.length > 0 && !isLoading && (
                            <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 px-1">
                                <span>Showing {items.length} colleges & universities</span>
                                <span>Scroll or search name, city, or acronym</span>
                            </div>
                        )}
                    </div>
                    <div className="max-h-72 md:max-h-80 overflow-y-auto divide-y divide-white/5">
                        {isLoading ? (
                            <div className="px-4 py-8 text-center text-sm text-yellow-400 flex items-center justify-center gap-2">
                                <span className="inline-block w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></span>
                                Searching CHED masterlist & universities...
                            </div>
                        ) : items.length ? (
                            items.map((item, index) => (
                                <button
                                    key={item.id || item.name || index}
                                    type="button"
                                    onClick={() => onSelect(item)}
                                    className="w-full px-4 py-3 text-left text-sm text-white hover:bg-yellow-500/15 hover:text-yellow-300 transition"
                                >
                                    <div className="font-medium text-white flex items-center justify-between gap-2">
                                        <span className="truncate">{item.name || item}</span>
                                        {item.acronym && (
                                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 shrink-0">
                                                {item.acronym.split(' ')[0]}
                                            </span>
                                        )}
                                    </div>
                                    {(item.region || item.island) && (
                                        <div className="text-xs text-yellow-400/80 mt-0.5">
                                            {item.region} • {item.island}
                                        </div>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-sm text-gray-400">
                                <p className="text-gray-300 font-medium">No schools matched "{searchValue}"</p>
                                <p className="text-xs text-gray-500 mt-1">Try searching by acronym or complete university name.</p>
                            </div>
                        )}
                    </div>

                    {onManualEntry && (
                        <div className="p-2.5 border-t border-white/10 bg-[#161618]">
                            <button
                                type="button"
                                onClick={onManualEntry}
                                className="w-full py-2 px-3 text-center text-xs font-semibold text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition flex items-center justify-center gap-1.5"
                            >
                                <span>➕</span> Can't find your school? Click here to enter manually
                            </button>
                        </div>
                    )}
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
                {isManualSchool ? (
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className={`${styles['label-register']}`}>
                                University / College Name <span className={styles.required}>*</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => setIsManualSchool(false)}
                                className="text-xs text-yellow-400 hover:text-yellow-300 underline transition"
                            >
                                ← Search from school list
                            </button>
                        </div>
                        <input
                            type="text"
                            name="university"
                            value={data.university}
                            onChange={(e) => {
                                handleInputChange(e);
                                clearFieldError('university');
                            }}
                            placeholder="Type your complete college / university name"
                            className={getFieldClassName('university')}
                            style={getFieldStyle('university')}
                        />
                        {renderFieldError('university')}
                    </div>
                ) : (
                    renderSelectBox(
                        'University / College School',
                        data.university,
                        'Select your school',
                        schoolOpen,
                        setSchoolOpen,
                        schoolDropdownRef,
                        'university',
                        schoolSearch,
                        setSchoolSearch,
                        schoolsList,
                        handleSchoolSelect,
                        'Search university / college school by name or acronym...',
                        schoolsLoading,
                        () => setIsManualSchool(true)
                    )
                )}
            </div>

            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <div className="w-full">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Island <span className={styles.required}>*</span>
                    </label>
                    <div className="relative">
                        {isManualSchool ? (
                            <select
                                name="island"
                                value={data.island}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    clearFieldError('island');
                                }}
                                className={getFieldClassName('island', 'appearance-none pr-10')}
                                style={getFieldStyle('island')}
                            >
                                <option value="" disabled>Select Island</option>
                                <option value="Luzon">Luzon</option>
                                <option value="Visayas">Visayas</option>
                                <option value="Mindanao">Mindanao</option>
                            </select>
                        ) : (
                            <input
                                type="text"
                                name="island"
                                value={data.island}
                                readOnly
                                placeholder="Auto-filled"
                                className={getFieldClassName('island', 'bg-gray-800 cursor-not-allowed pr-10')}
                                style={getFieldStyle('island')}
                            />
                        )}
                        {isManualSchool && (
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
                        )}
                        {errors.island && (
                            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
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
                        {isManualSchool ? (
                            <select
                                name="region"
                                value={data.region}
                                onChange={(e) => {
                                    const selectedRegion = e.target.value;
                                    handleInputChange({ target: { name: 'region', value: selectedRegion } });
                                    const found = PH_REGIONS.find((r) => r.code === selectedRegion);
                                    if (found) {
                                        handleInputChange({ target: { name: 'island', value: found.island } });
                                        clearFieldError('island');
                                    }
                                    clearFieldError('region');
                                }}
                                className={getFieldClassName('region', 'appearance-none pr-10')}
                                style={getFieldStyle('region')}
                            >
                                <option value="" disabled>Select Region</option>
                                {PH_REGIONS.map((r) => (
                                    <option key={r.code} value={r.code}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                name="region"
                                value={data.region}
                                readOnly
                                placeholder="Auto-filled"
                                className={getFieldClassName('region', 'bg-gray-800 cursor-not-allowed pr-10')}
                                style={getFieldStyle('region')}
                            />
                        )}
                        {isManualSchool && (
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
                        )}
                        {errors.region && (
                            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                                !
                            </div>
                        )}
                    </div>
                    {renderFieldError('region')}
                </div>
            </div>

            <div className="flex flex-col gap-4 mb-4">
                {renderSelectBox(
                    'Course or Programs',
                    data.course,
                    'Select program',
                    strandOpen,
                    setStrandOpen,
                    strandDropdownRef,
                    'course',
                    strandSearch,
                    setStrandSearch,
                    filteredStrands.map((strand) => ({ id: strand, name: strand })),
                    handleStrandSelect,
                    'Search course or program...'
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
                        <option value="Freshmen (1st Yr)">Freshmen (1st Yr)</option>
                        <option value="Sophomore (2nd Yr)">Sophomore (2nd Yr)</option>
                        <option value="Junior (3rd Yr)">Junior (3rd Yr)</option>
                        <option value="Senior (4th Yr Up)">Senior (4th Yr)</option>
                        <option value="Alumni">Alumni</option>
                        <option value="Masters">Masters</option>
                        <option value="Doctorate">Doctorate</option>
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
                        onBlur={(e) => validateStudentId(e.target.value)}
                        inputMode="text"
                        placeholder="Enter your student ID"
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
                    Proof of Enrollment / School ID with Validation <span className={styles.required}>*</span>
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
                        <span className="flex shrink-0 items-center gap-2">
                            <span className="group relative inline-flex text-gray-500 transition hover:text-brand-500 focus-within:text-brand-500">
                                <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }}
                                    className="focus:outline-none"
                                    aria-label="Proof of enrollment upload note"
                                >
                                    <HelpCircle className="h-4 w-4" />
                                </span>
                                <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 hidden w-[230px] rounded-lg border border-white/10 bg-[#0B0B0B] px-3 py-2 text-left text-xs leading-[18px] shadow-xl group-hover:block group-focus-within:block">
                                    <span className="font-semibold text-brand-500">Note:</span>{' '}
                                    <span className="font-normal text-gray-400">
                                        When Uploading, make sure to compile documents in one file to avoid confusion.
                                    </span>
                                </span>
                            </span>
                            <UploadCloud className="h-5 w-5 text-gray-400" />
                        </span>
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

