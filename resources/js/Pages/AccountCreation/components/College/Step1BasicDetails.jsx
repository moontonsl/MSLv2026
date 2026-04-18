import React from 'react';
import styles from '../../register.module.scss';
import { CalendarDays, ChevronDown } from 'lucide-react';

const Step1BasicDetails = React.forwardRef(function Step1BasicDetails(
    { data, handleInputChange, validationTrigger },
    ref
) {
    const hiddenDateInputRef = React.useRef(null);
    const requiredFields = [
        'firstName',
        'lastName',
        'gender',
        'birthday',
        'age',
        'contactNo',
        'facebookLink',
    ];

    const [errors, setErrors] = React.useState({});
    const [dirtyFields, setDirtyFields] = React.useState({});

    const setFieldError = (name, error) => {
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const clearFieldError = (name) => {
        setFieldError(name, '');
    };

    const markFieldDirty = (name) => {
        setDirtyFields((prev) => ({
            ...prev,
            [name]: true,
        }));
    };

    const capitalizeFirstLetter = (value) => {
        if (!value) {
            return '';
        }

        return value.charAt(0).toUpperCase() + value.slice(1);
    };

    const requiredMessages = {
        firstName: 'First Name is required.',
        lastName: 'Last Name is required.',
        gender: 'Gender is required.',
        birthday: 'Birthday is required.',
        age: 'Age is required.',
        contactNo: 'Contact Number is required.',
        facebookLink: 'Facebook Profile Link is required.',
    };

    const validateField = (name, value) => {
        let error = '';
        const trimmedValue = value?.toString().trim() ?? '';

        // If there is a value, we clear the "Required" error immediately
        if (!trimmedValue) {
            error = requiredMessages[name] || 'This field is required.';
        } else {
            // Only run specific regex/logic if there IS a value
            if (name === 'contactNo' && !/^(?:0?9\d{9}|9\d{9})$/.test(trimmedValue)) {
                error = 'Enter a valid PH mobile number.';
            }

            if (
                name === 'facebookLink' &&
                !/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/[^\s]+/i.test(trimmedValue)
            ) {
                error = 'Enter a valid Facebook profile link.';
            }
        }

        setFieldError(name, error);
        return !error;
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

    const formatBirthdayForDateInput = (value) => {
        if (!value || value.length !== 10) {
            return '';
        }

        const [month, day, year] = value.split('/');

        if (!month || !day || !year) {
            return '';
        }

        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const parseBirthdayValue = (value) => {
        if (!value) {
            return null;
        }

        if (value.includes('/')) {
            const [month, day, year] = value.split('/');

            if (!month || !day || !year) {
                return null;
            }

            return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);
        }

        return new Date(`${value}T00:00:00`);
    };

    const validateBirthdayValue = (value) => {
        if (!value) {
            setFieldError('birthday', requiredMessages.birthday);
            setFieldError('age', requiredMessages.age);
            handleInputChange({ target: { name: 'age', value: '' } });
            return false;
        }

        const inputDate = parseBirthdayValue(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!inputDate || Number.isNaN(inputDate.getTime())) {
            setFieldError('birthday', 'Enter a valid birth date.');
            setFieldError('age', requiredMessages.age);
            handleInputChange({ target: { name: 'age', value: '' } });
            return false;
        }

        if (inputDate > today) {
            setFieldError('birthday', 'Birthday cannot be in the future.');
            setFieldError('age', requiredMessages.age);
            handleInputChange({ target: { name: 'age', value: '' } });
            return false;
        }

        let age = today.getFullYear() - inputDate.getFullYear();
        const monthDifference = today.getMonth() - inputDate.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < inputDate.getDate())
        ) {
            age -= 1;
        }

        if (age < 13) {
            setFieldError('birthday', 'Age must be 13 or older.');
            setFieldError('age', 'Age must be 13 or older.');
            handleInputChange({ target: { name: 'age', value: '' } });
            return false;
        }

        setFieldError('birthday', '');
        setFieldError('age', '');
        handleInputChange({ target: { name: 'age', value: age } });
        return true;
    };

    const handleBirthdayChange = (e) => {
        let val = e.target.value;

        if (e.target.type === 'date' && val) {
            const [year, month, day] = val.split('-');
            val = `${month}/${day}/${year}`;
        } else {
            // 👇 ONLY format if user is typing numbers
            const digits = val.replace(/\D/g, '').slice(0, 8);

            // 👇 Prevent unnecessary overwrite (THIS FIXES YOUR BUG)
            if (digits.length < 3) {
                val = digits;
            } else if (digits.length < 5) {
                val = `${digits.slice(0, 2)}/${digits.slice(2)}`;
            } else {
                val = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
            }
        }

        handleInputChange({ target: { name: 'birthday', value: val } });
        markFieldDirty('birthday');

        if (val.length === 10) {
            validateBirthdayValue(val);
        }
    };

    const handleNameChange = (e) => {
        const { name, value } = e.target;
        const normalizedValue = capitalizeFirstLetter(value);

        handleInputChange({
            target: {
                name,
                value: normalizedValue,
            },
        });
        markFieldDirty(name);
        clearFieldError(name);
    };

    const handleContactChange = (e) => {
        const normalizedValue = e.target.value.replace(/\D/g, '').slice(0, 11);

        handleInputChange({
            target: {
                name: 'contactNo',
                value: normalizedValue,
            },
        });
        markFieldDirty('contactNo');

        if (/^(?:0?9\d{9}|9\d{9})$/.test(normalizedValue)) {
            clearFieldError('contactNo');
        }
    };

    const displayedContactNo = data.contactNo?.length > 1 && data.contactNo.startsWith('0')
        ? data.contactNo.slice(1)
        : data.contactNo;

    React.useEffect(() => {
        if (!validationTrigger) return;

        validateBirthdayValue(data.birthday);
    }, [validationTrigger]);

    React.useEffect(() => {
        if (!validationTrigger) {
            return;
        }

        validateField('firstName', data.firstName);
        validateField('lastName', data.lastName);
        validateField('gender', data.gender);
        validateField('contactNo', data.contactNo);
        validateField('facebookLink', data.facebookLink);
        validateBirthdayValue(data.birthday);
    }, [validationTrigger]);

    const validateStep1 = () => {
        const firstNameOk = validateField('firstName', data.firstName);
        const lastNameOk = validateField('lastName', data.lastName);
        const genderOk = validateField('gender', data.gender);
        const contactOk = validateField('contactNo', data.contactNo);
        const facebookOk = validateField('facebookLink', data.facebookLink);
        const birthdayOk = validateBirthdayValue(data.birthday);

        return firstNameOk && lastNameOk && genderOk && contactOk && facebookOk && birthdayOk;
    };

    React.useImperativeHandle(ref, () => ({
        validateStep1,
    }));

    return (
        <div>
            <h1 className={`${styles['title-register']} text-2xl md:text-3xl mb-1`}>
                Create Account
            </h1>

            <h2 className={`${styles['subtitle-register']} text-[0.5rem] leading-none md:text-sm text-white/60 md:text-white/70 mb-2 md:mb-1 tracking-[0.04em] md:tracking-[0.18em]`}>
                BASIC DETAILS
            </h2>

            {(() => {
                const filled = requiredFields.filter(
                    (field) => data[field] && data[field].toString().trim() !== ''
                ).length;

                const percent = Math.round((filled / requiredFields.length) * 25);

                return (
                    <div className="mb-3 text-center">
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-500 transition-all"
                                style={{ width: `${percent}%` }}
                            />
                        </div>

                        <p className="text-xs text-white/60 mt-4 mb-6 text-center">
                            STEP 1 of 4 - {percent}% OF THIS STEP COMPLETE
                        </p>
                    </div>
                );
            })()}

            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <div className="w-full md:w-3/4 relative">
                    <label className={`${styles['label-register']} block mb-1`}>
                        First Name <span className={styles.required}>*</span>
                    </label>

                    <input
                        type="text"
                        name="firstName"
                        value={data.firstName}
                        onChange={handleNameChange}
                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                        className={getFieldClassName('firstName', 'pr-10')}
                        style={getFieldStyle('firstName')}
                        placeholder="e.g. Juan"
                    />

                    {errors.firstName && (
                        <div className="absolute right-3 top-11 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500">
                            !
                        </div>
                    )}

                    {renderFieldError('firstName')}
                </div>

                <div className="w-full md:w-3/4 relative">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Last Name <span className={styles.required}>*</span>
                    </label>

                    <input
                        type="text"
                        name="lastName"
                        value={data.lastName}
                        onChange={handleNameChange}
                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                        className={getFieldClassName('lastName', 'pr-10')}
                        style={getFieldStyle('lastName')}
                        placeholder="e.g. dela Cruz"
                    />

                    {errors.lastName && (
                        <div className="absolute right-3 top-11 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500">
                            !
                        </div>
                    )}

                    {renderFieldError('lastName')}
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <div className="w-full relative">
                    <label className={`${styles['label-register']} block mb-1`}>Suffix</label>

                    <select
                        name="suffix"
                        value={data.suffix}
                        onChange={(e) => {
                            handleInputChange(e);
                            markFieldDirty(e.target.name);
                        }}
                        className={`${styles['input-field-register']} w-full p-3 pr-10 rounded-lg appearance-none border border-gray-600 outline-none transition-all focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400`}
                        style={getFieldStyle('suffix')}
                    >
                        <option value="N/A">N/A</option>
                        <option value="Jr">Jr</option>
                        <option value="Sr">Sr</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                    </select>

                    <ChevronDown className="absolute right-3 top-[45px] h-4 w-4 pointer-events-none text-gray-400" />
                </div>

                <div className="w-full relative">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Gender <span className={styles.required}>*</span>
                    </label>

                    <select
                        name="gender"
                        value={data.gender}
                        onChange={(e) => {
                            handleInputChange(e);
                            markFieldDirty(e.target.name);
                            clearFieldError(e.target.name);
                        }}
                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                        className={getFieldClassName('gender', 'pr-10 appearance-none')}
                        style={getFieldStyle('gender')}
                    >
                        <option disabled value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>

                    {errors.gender && (
                        <div className="absolute right-10 top-11 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500">
                            !
                        </div>
                    )}

                    <ChevronDown className="absolute right-3 top-[45px] h-4 w-4 pointer-events-none text-gray-400" />
                    {renderFieldError('gender')}
                </div>
            </div>

            <div className="flex flex-row justify-between mb-4 gap-3 md:gap-4">
                <div className="w-[60%] md:w-1/2 min-w-0 relative">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Birthday <span className={styles.required}>*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="birthday"
                            inputMode="numeric"
                            placeholder="MM/DD/YYYY"
                            value={data.birthday}
                            onChange={handleBirthdayChange}
                            onBlur={(e) => {
                                const value = e.target.value;

                                if (!value) {
                                    validateBirthdayValue('');
                                } else if (value.length === 10) {
                                    validateBirthdayValue(value);
                                } else {
                                    setFieldError('birthday', 'Enter a valid birth date.');
                                }
                            }}
                            className={getFieldClassName('birthday', 'pr-20')}
                            style={{
                                ...getFieldStyle('birthday'),
                                minWidth: '12ch',
                                letterSpacing: '0.02em',
                                fontVariantNumeric: 'tabular-nums',
                            }}
                        />
                        {errors.birthday && (
                            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                                !
                            </div>
                        )}
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 cursor-pointer p-1 active:opacity-50"
                            onClick={() => hiddenDateInputRef.current?.showPicker()}
                        >
                            <CalendarDays className="h-5 w-5 text-gray-400 hover:text-white" />
                        </button>
                    </div>
                    <input
                        ref={hiddenDateInputRef}
                        type="date"
                        className="sr-only"
                        tabIndex={-1}
                        value={formatBirthdayForDateInput(data.birthday)}
                        onChange={handleBirthdayChange}
                    />

                    {renderFieldError('birthday')}
                </div>

                <div className="w-[40%] md:w-1/2 min-w-0 relative">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Age <span className={styles.required}>*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="age"
                            value={data.age}
                            readOnly
                            placeholder="Auto-calculated"
                            className={getFieldClassName('age', 'pr-10 bg-gray-800 cursor-not-allowed focus:border-gray-700 focus:ring-0')}
                            style={getFieldStyle('age')}
                        />
                        {errors.age && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                                !
                            </div>
                        )}
                    </div>
                    {renderFieldError('age')}
                </div>
            </div>

            <div className="mb-4">
                <label className={`${styles['label-register']} block mb-1`}>
                    Contact Number <span className={styles.required}>*</span>
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-3 text-sm">
                        <span className="font-medium text-gray-300">+63</span>
                        <span className="h-11 w-px bg-gray-500"></span>
                    </div>

                    <input
                        type="text"
                        name="contactNo"
                        value={displayedContactNo}
                        onChange={handleContactChange}
                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                        placeholder="e.g. 9123456789"
                        className={getFieldClassName('contactNo', 'pl-16 pr-10')}
                        style={getFieldStyle('contactNo')}
                    />

                    {errors.contactNo && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500">
                            !
                        </div>
                    )}
                </div>

                {renderFieldError('contactNo')}
            </div>

            <div className="mb-6 relative">
                <label className={`${styles['label-register']} block mb-1`}>
                    Facebook Profile Link <span className={styles.required}>*</span>
                </label>

                <input
                    type="text"
                    name="facebookLink"
                    value={data.facebookLink}
                    onChange={(e) => {
                        handleInputChange(e);
                        clearFieldError(e.target.name);
                    }}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                    className={getFieldClassName('facebookLink', 'pr-10')}
                    style={getFieldStyle('facebookLink')}
                    placeholder="https://facebook.com/username"
                />

                {errors.facebookLink && (
                    <div className="absolute right-3 top-11 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500">
                        !
                    </div>
                )}

                {renderFieldError('facebookLink')}
            </div>
        </div>
    );
});

export default Step1BasicDetails;
