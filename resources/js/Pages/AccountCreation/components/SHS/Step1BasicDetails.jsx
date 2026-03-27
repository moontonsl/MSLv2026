import React from 'react';
import styles from '../../register.module.scss';
import { CalendarDays, ChevronDown } from 'lucide-react';

const Step1BasicDetails = ({ formData, handleInputChange, validationTrigger }) => {
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

    const validateField = (name, value) => {
        let error = '';
        const trimmedValue = value?.toString().trim() ?? '';

        // If there is a value, we clear the "Required" error immediately
        if (!trimmedValue) {
            error = 'Required field';
        } else {
            // Only run specific regex/logic if there IS a value
            if (name === 'contactNo' && !/^09\d{9}$/.test(trimmedValue)) {
                error = 'Enter a valid 11-digit mobile number.';
            }

            if (
                name === 'facebookLink' &&
                !/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/.+/i.test(trimmedValue)
            ) {
                error = 'Enter a valid Facebook profile link.';
            }
        }

        setFieldError(name, error);
    };

    const getFieldClassName = (name, extraClasses = '') =>
        [
            styles['input-field-register'],
            'w-full p-3 rounded-lg border transition-colors focus:outline-none',
            errors[name] ? 'text-red-100' : '',
            extraClasses,
        ]
        .filter(Boolean)
        .join(' ');

    const getFieldStyle = (name) => {
        if (errors[name]) {
            return {
                borderColor: '#ef4444',
                boxShadow: '0 0 0 1px #ef4444',
            };
        }

        if (dirtyFields[name]) {
            return {
                borderColor: '#facc15',
                boxShadow: '0 0 0 1px #facc15',
            };
        }

        return {
            borderColor: '#4b5563',
            boxShadow: 'none',
        };
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

    const validateBirthdayValue = (value) => {
        if (!value) {
            setFieldError('birthday', 'Required field');
            setFieldError('age', 'Required field');
            handleInputChange({ target: { name: 'age', value: '' } });
            return false;
        }

        if (value.length < 10) {
            setFieldError('birthday', 'Enter a valid birth date.');
            setFieldError('age', 'Required field');
            handleInputChange({ target: { name: 'age', value: '' } });
            return false;
        }

        const [month, day, year] = value.split('/');
        const inputDate = new Date(`${year}-${month}-${day}`);
        const today = new Date();

        if (Number.isNaN(inputDate.getTime())) {
            setFieldError('birthday', 'Enter a valid birth date.');
            setFieldError('age', 'Required field');
            handleInputChange({ target: { name: 'age', value: '' } });
            return false;
        }

        if (inputDate > today) {
            setFieldError('birthday', 'Birthday cannot be in the future.');
            setFieldError('age', 'Required field');
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

        if (age < 16) {
            setFieldError('birthday', 'Must be at least 16 years old.');
            setFieldError('age', 'Age must be 16 or older.');
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

        // 1. Handle Native Date Picker (YYYY-MM-DD)
        if (e.target.type === 'date' && val) {
            const [year, month, day] = val.split('-');
            val = `${month}/${day}/${year}`;
        } else {
            // 2. Handle Manual Typing
            // Strip everything except numbers
            const digits = val.replace(/\D/g, '');
            
            // Format the string as the user types
            if (digits.length <= 2) {
                val = digits;
            } else if (digits.length <= 4) {
                val = `${digits.slice(0, 2)}/${digits.slice(2)}`;
            } else {
                // slice(4, 8) ensures exactly 4 digits for the year. 
                // Total string: 2 (MM) + 1 (/) + 2 (DD) + 1 (/) + 4 (YYYY) = 10 characters.
                val = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
            }
        }

        // Update the parent state
        handleInputChange({
            target: { name: 'birthday', value: val },
        });
        markFieldDirty('birthday');

        if (val.length > 0) {
            clearFieldError('birthday');
            clearFieldError('age');
        }

        if (val.length === 10) {
            validateBirthdayValue(val);
        }
    };

    React.useEffect(() => {
        if (!validationTrigger) {
            return;
        }

        validateField('firstName', formData.firstName);
        validateField('lastName', formData.lastName);
        validateField('gender', formData.gender);
        validateField('contactNo', formData.contactNo);
        validateField('facebookLink', formData.facebookLink);
        validateBirthdayValue(formData.birthday);
    }, [validationTrigger]);

    return (
        <div>
            <h1 className={`${styles['title-register']} text-xl md:text-3xl mb-1`}>
                Create MSL Account
            </h1>

            <h2 className={`${styles['subtitle-register']} text-xs md:text-sm text-white/70`}>
                BASIC DETAILS
            </h2>

            {(() => {
                const filled = requiredFields.filter(
                    (field) => formData[field] && formData[field].toString().trim() !== ''
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

                        <p className="text-xs text-white/60 mt-1 mb-6 text-center">
                            STEP 1 of 4 - {percent}% OF THIS STEP COMPLETE
                        </p>
                    </div>
                );
            })()}

            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <div className="w-full relative">
                    <label className={`${styles['label-register']} block mb-1`}>
                        First Name <span className={styles.required}>*</span>
                    </label>

                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={(e) => {
                            handleInputChange(e);
                            markFieldDirty(e.target.name);
                            clearFieldError(e.target.name);
                        }}
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

                <div className="w-full relative">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Last Name <span className={styles.required}>*</span>
                    </label>

                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={(e) => {
                            handleInputChange(e);
                            markFieldDirty(e.target.name);
                            clearFieldError(e.target.name);
                        }}
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
                        value={formData.suffix}
                        onChange={(e) => {
                            handleInputChange(e);
                            markFieldDirty(e.target.name);
                        }}
                        className={`${styles['input-field-register']} w-full p-3 pr-10 rounded-lg appearance-none`}
                        style={getFieldStyle('suffix')}
                    >
                        <option value="">Select suffix</option>
                        <option value="Jr">Jr</option>
                        <option value="Sr">Sr</option>
                    </select>

                    <ChevronDown className="absolute right-3 top-[45px] h-4 w-4 pointer-events-none text-gray-400" />
                </div>

                <div className="w-full relative">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Gender <span className={styles.required}>*</span>
                    </label>

                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={(e) => {
                            handleInputChange(e);
                            markFieldDirty(e.target.name);
                            clearFieldError(e.target.name);
                        }}
                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                        className={getFieldClassName('gender', 'pr-10 appearance-none')}
                        style={getFieldStyle('gender')}
                    >
                        <option value="">Select gender</option>
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

            {/* Hidden native input maintained for the picker */}
            <input
                ref={hiddenDateInputRef}
                type="date"
                className="fixed -left-[9999px] top-auto h-px w-px opacity-0"
                tabIndex={-1}
                value={formatBirthdayForDateInput(formData.birthday)}
                onChange={handleBirthdayChange}
            />

            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <div className="w-full relative">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Birthday <span className={styles.required}>*</span>
                    </label>

                    <div className="relative flex items-center">
                        {/* THE ACTUAL VISIBLE INPUT */}
                        <input
                            type="text"
                            name="birthday"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="MM/DD/YYYY"
                            value={formData.birthday}
                            onChange={handleBirthdayChange}
                            onBlur={(e) => {
                                if (e.target.value.length === 10) {
                                    validateBirthdayValue(e.target.value);
                                } else if (!e.target.value) {
                                    validateBirthdayValue('');
                                } else {
                                    clearFieldError('birthday');
                                    clearFieldError('age');
                                }
                            }}
                            className={getFieldClassName('birthday', 'relative z-0 pr-16')}
                            style={getFieldStyle('birthday')}
                        />

                        {/* THE CALENDAR ICON TRIGGER */}
                        <div 
                            className="absolute right-3 z-20 cursor-pointer p-1 active:opacity-50"
                            onClick={() => hiddenDateInputRef.current?.showPicker()}
                        >
                            <CalendarDays className="h-5 w-5 text-gray-400 hover:text-white" />
                        </div>

                        {/* ERROR ICON - moved slightly left so it doesn't overlap the calendar */}
                        {errors.birthday && (
                            <div className="absolute right-10 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-[10px] font-bold text-red-500 pointer-events-none">
                                !
                            </div>
                        )}
                    </div>

                    {/* THE HIDDEN PICKER - using absolute/opacity instead of fixed for better browser support */}
                    <input
                        ref={hiddenDateInputRef}
                        type="date"
                        style={{ 
                            position: 'absolute', 
                            top: '50%', 
                            right: '12px', 
                            width: '1px', 
                            height: '1px', 
                            opacity: 0, 
                            pointerEvents: 'none' 
                        }}
                        tabIndex={-1}
                        value={formatBirthdayForDateInput(formData.birthday)}
                        onChange={handleBirthdayChange}
                    />

                    {renderFieldError('birthday')}
                </div>

                <div className="w-full relative">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Age <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        name="age"
                        value={formData.age}
                        readOnly
                        placeholder="Auto-calculated"
                        className={getFieldClassName('age', 'pr-10 bg-gray-800 cursor-not-allowed')}
                        style={getFieldStyle('age')}
                    />
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
                        value={formData.contactNo}
                        onChange={(e) => {
                            handleInputChange(e);
                            markFieldDirty(e.target.name);
                            clearFieldError(e.target.name);
                        }}
                        onBlur={(e) => validateField(e.target.name, e.target.value)}
                        placeholder="e.g. 09123456789"
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
                    value={formData.facebookLink}
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
};

export default Step1BasicDetails;
