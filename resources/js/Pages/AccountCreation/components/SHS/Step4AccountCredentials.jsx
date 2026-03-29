import React from 'react';
import styles from '../../register.module.scss';
import { Eye, EyeOff } from 'lucide-react';

const Step4AccountCredentials = React.forwardRef(function Step4AccountCredentials(
    {
        data,
        handleInputChange,
        verificationCode,
        setVerificationCode,
        step4ShowErrors,
    },
    ref
) {
    const [errors, setErrors] = React.useState({});
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState(false);
    const [codeTimer, setCodeTimer] = React.useState(0);
    const [showCodeNotice, setShowCodeNotice] = React.useState(false);

    const requiredFields = ['username', 'password', 'confirmPassword', 'email', 'captcha', 'termsAccepted'];

    const setFieldError = (name, error) => {
        if (!step4ShowErrors) return;
        
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const clearFieldError = (name) => {
        setFieldError(name, '');
    };

    const clearErrors = () => {
        setErrors({});
    };

    const shouldShowErrors = step4ShowErrors;

    const getFieldClassName = (name, extraClasses = '') => {
        return [
            styles['input-field-register'],
            'w-full p-3 rounded-lg border transition-all outline-none',
            shouldShowErrors && errors[name]
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400',
            extraClasses,
        ]
            .filter(Boolean)
            .join(' ');
    };

    const getFieldStyle = (name) => {
        if (shouldShowErrors && errors[name]) {
            return {
                borderColor: '#ef4444',
                boxShadow: '0 0 0 1px #ef4444',
            };
        }

        return {};
    };

    const renderFieldError = (name) =>
        step4ShowErrors && errors[name] ? <p className="mt-1 text-sm text-red-400">{errors[name]}</p> : null;

    const validateField = (name, value) => {
        const trimmedValue = value?.toString().trim() ?? '';
        
        if (name === 'termsAccepted') {
            if (value !== true) {
                setFieldError(name, 'You must accept and agree to the Terms and Conditions.');
                return false;
            }

            clearFieldError(name);
            return true;
        }

        if (!trimmedValue) {
            const labels = {
                username: 'Username',
                password: 'Password',
                confirmPassword: 'Confirm Password',
                email: 'Email Address',
                captcha: 'Verification Code',
            };

            setFieldError(name, `${labels[name] || 'This field'} is required.`);
            return false;
        }

        if (name === 'username') {
            if (!/^[A-Za-z0-9]+$/.test(trimmedValue)) {
                setFieldError(name, 'Username can only contain letters and numbers.');
                return false;
            }

            if (trimmedValue.length < 5 || trimmedValue.length > 12) {
                setFieldError(name, 'Username must be 5 to 12 characters.');
                return false;
            }
        }

        if (name === 'password') {
            if (trimmedValue.length < 6 || trimmedValue.length > 16) {
                setFieldError(name, 'Password must be 6 to 16 characters.');
                return false;
            }

            if (/\s/.test(trimmedValue)) {
                setFieldError(name, 'Password cannot contain spaces.');
                return false;
            }
        }

        if (name === 'confirmPassword' && trimmedValue !== data.password) {
            setFieldError(name, 'Passwords do not match.');
            return false;
        }

        if (name === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(trimmedValue)) {
                setFieldError(name, 'Enter a valid email address.');
                return false;
            }
        }

        if (name === 'captcha' && trimmedValue.length < 4) {
            setFieldError(name, 'Enter the verification code.');
            return false;
        }

        if (name === 'captcha' && verificationCode && trimmedValue !== verificationCode) {
            setFieldError(name, 'Incorrect code.');
            return false;
        }

        clearFieldError(name);
        return true;
    };

    const validateStep4 = () => {
        clearErrors();
        const results = requiredFields.map((field) => validateField(field, data[field]));
        return results.every(Boolean);
    };

    React.useImperativeHandle(ref, () => ({
        validateStep4,
        clearErrors,
    }));

    React.useEffect(() => {
        if (!step4ShowErrors) {
            clearErrors();
        }
    }, [step4ShowErrors]);

    React.useEffect(() => {
        if (!codeTimer) {
            return;
        }

        const interval = setInterval(() => {
            setCodeTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setShowCodeNotice(false);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [codeTimer]);

    const handleUsernameChange = (e) => {
        const sanitizedValue = e.target.value.replace(/[^A-Za-z0-9]/g, '');
        handleInputChange({ target: { name: 'username', value: sanitizedValue } });
        if (sanitizedValue) {
            clearFieldError('username');
        }
    };

    const handlePasswordChange = (e) => {
        const sanitizedValue = e.target.value.replace(/\s/g, '');
        handleInputChange({ target: { name: 'password', value: sanitizedValue } });
        if (sanitizedValue) {
            clearFieldError('password');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const sanitizedValue = e.target.value.replace(/\s/g, '');
        handleInputChange({ target: { name: 'confirmPassword', value: sanitizedValue } });
        if (sanitizedValue) {
            clearFieldError('confirmPassword');
        }
    };

    const handleEmailChange = (e) => {
        handleInputChange(e);
        if (e.target.value) {
            clearFieldError('email');
        }
        setShowCodeNotice(false);
    };

    const handleRequestCode = () => {
        if (!validateField('email', data.email)) {
            return;
        }

        setShowCodeNotice(true);
        setCodeTimer(60);
        setVerificationCode('123456');
        clearFieldError('email');
    };

    const handleCheckboxChange = (e) => {
        if (e.target.checked) {
            clearFieldError('termsAccepted');
        }

        handleInputChange({
            target: {
                name: 'termsAccepted',
                value: e.target.checked,
            },
        });
    };

    React.useEffect(() => {
        if (data.password && data.confirmPassword) {
            if (!step4ShowErrors) {
                return;
            }

            if (data.password !== data.confirmPassword) {
                setFieldError('confirmPassword', 'Passwords do not match.');
            } else {
                clearFieldError('confirmPassword');
            }
        }
    }, [data.password, data.confirmPassword, step4ShowErrors]);

    return (
        <div>
            <h1 className={`${styles['title-register']} text-2xl md:text-3xl mb-1`}>
                Create MSL Account
            </h1>

            <h2 className={`${styles['subtitle-register']} text-[0.45rem] leading-none md:text-sm text-white/60 md:text-white/70 mb-2 md:mb-1 tracking-[0.03em] md:tracking-[0.18em]`}>
                ACCOUNT SETUP
            </h2>

            {(() => {
                const filled = requiredFields.filter(
                    (field) => data[field] && data[field].toString().trim() !== ''
                ).length;

                const percent = 75 + Math.round((filled / requiredFields.length) * 25);

                return (
                    <div className="mb-3 text-center">
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-500 transition-all"
                                style={{ width: `${percent}%` }}
                            />
                        </div>

                        <p className="text-xs text-white/60 mt-4 mb-6 text-center">
                            STEP 4 of 4 - {percent}% OF THIS STEP COMPLETE
                        </p>
                    </div>
                );
            })()}

            <div className="mb-4">
                <label className={`${styles['label-register']} block mb-1`}>
                    Username <span className={styles.required}>*</span>
                </label>
                <div className="relative">
                        <input
                            type="text"
                            name="username"
                            value={data.username}
                            onChange={handleUsernameChange}
                            placeholder="5 to 12 characters"
                            className={getFieldClassName('username', 'pr-10')}
                            style={getFieldStyle('username')}
                        />
                    {step4ShowErrors && errors.username && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                            !
                        </div>
                    )}
                </div>
                {renderFieldError('username')}
            </div>

            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <div className="w-full relative">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Create Password <span className={styles.required}>*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            onChange={handlePasswordChange}
                            placeholder="6 to 16 characters"
                            className={getFieldClassName('password', 'pr-10')}
                            style={getFieldStyle('password')}
                        />
                        {step4ShowErrors && errors.password && (
                            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                                !
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setPasswordVisible((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {renderFieldError('password')}
                </div>

                <div className="w-full relative">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Confirm Password <span className={styles.required}>*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={confirmPasswordVisible ? 'text' : 'password'}
                            name="confirmPassword"
                            value={data.confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder="Repeat password"
                            className={getFieldClassName('confirmPassword', 'pr-10')}
                            style={getFieldStyle('confirmPassword')}
                        />
                        {step4ShowErrors && errors.confirmPassword && (
                            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                                !
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            {confirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {renderFieldError('confirmPassword')}
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <div className="w-full md:w-3/4">
                    <label className={`${styles['label-register']} block mb-1`}>
                        Email Address <span className={styles.required}>*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleEmailChange}
                            placeholder="you@example.com"
                            className={getFieldClassName('email', 'pr-10')}
                            style={getFieldStyle('email')}
                        />
                        {step4ShowErrors && errors.email && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                                !
                            </div>
                        )}
                    </div>
                    {showCodeNotice && (
                        <p className="mt-1 text-xs text-green-400">
                            Verification code requested. Check your email to continue.
                        </p>
                    )}
                    {renderFieldError('email')}
                </div>

                <div className="w-full md:w-1/4 md:pt-[31px]">
                    <button
                        type="button"
                        onClick={handleRequestCode}
                        disabled={codeTimer > 0}
                        className="w-full py-3 rounded-xl border border-yellow-500 text-yellow-400 font-semibold hover:bg-yellow-500 hover:text-black transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {codeTimer > 0 ? `${codeTimer}s` : 'Get Code'}
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <label className={`${styles['label-register']} block mb-1`}>
                    Verification Code <span className={styles.required}>*</span>
                </label>
                <div className="relative">
                        <input
                            type="text"
                            name="captcha"
                            value={data.captcha}
                            onChange={(e) => {
                                handleInputChange(e);
                                setShowCodeNotice(false);
                                if (e.target.value) {
                                    clearFieldError('captcha');
                                }
                            }}
                            placeholder="Enter code"
                            className={getFieldClassName('captcha')}
                            style={getFieldStyle('captcha')}
                        />
                    {step4ShowErrors && errors.captcha && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                            !
                        </div>
                    )}
                </div>
                {renderFieldError('captcha')}
            </div>

            <div className="mb-2 flex justify-center">
                <label className="flex items-center gap-2 text-white/80 text-sm cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={!!data.termsAccepted}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 rounded border-gray-500 bg-transparent text-yellow-500 focus:ring-yellow-400"
                    />
                    <span>
                        I accept and agree with{' '}
                        <button type="button" className="text-yellow-400 hover:underline">
                            Terms and Conditions
                        </button>
                    </span>
                </label>
            </div>

            {step4ShowErrors && errors.termsAccepted && (
                <p className="mt-2 text-center text-sm text-red-400">
                    {errors.termsAccepted}
                </p>
            )}
        </div>
    );
});

export default Step4AccountCredentials;
