import React from 'react';
import styles from '../../register.module.scss';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import axios from 'axios';

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
    const [hasRequestedCode, setHasRequestedCode] = React.useState(false);
    const [isSendingCode, setIsSendingCode] = React.useState(false);

    // New state variables for premium 6-digit PIN code input
    const [pinCode, setPinCode] = React.useState(['', '', '', '', '', '']);
    const [verificationStatus, setVerificationStatus] = React.useState('idle'); // idle, checking, success, error
    const [verificationError, setVerificationError] = React.useState('');
    const inputRefs = React.useRef([]);

    const requiredFields = ['username', 'password', 'confirmPassword', 'email', 'captcha', 'termsAccepted'];

    const setFieldError = (name, error, force = false) => {
        if (!step4ShowErrors && !force) return;
        
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const clearFieldError = (name, force = false) => {
        setFieldError(name, '', force);
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

    const validateField = (name, value, force = false) => {
        const trimmedValue = value?.toString().trim() ?? '';
        
        if (name === 'termsAccepted') {
            if (value !== true) {
                setFieldError(name, 'You must accept and agree to the Terms and Conditions.', force);
                return false;
            }

            clearFieldError(name, force);
            return true;
        }

        if (!trimmedValue && name !== 'captcha') {
            const labels = {
                username: 'Username',
                password: 'Password',
                confirmPassword: 'Confirm Password',
                email: 'Email Address',
            };

            setFieldError(name, `${labels[name] || 'This field'} is required.`, force);
            return false;
        }

        if (name === 'username') {
            if (!/^[A-Za-z0-9]+$/.test(trimmedValue)) {
                setFieldError(name, 'Username can only contain letters and numbers.', force);
                return false;
            }

            if (trimmedValue.length < 5 || trimmedValue.length > 12) {
                setFieldError(name, 'Username must be 5 to 12 characters.', force);
                return false;
            }
        }

        if (name === 'password') {
            if (trimmedValue.length < 6 || trimmedValue.length > 16) {
                setFieldError(name, 'Password must be 6 to 16 characters.', force);
                return false;
            }

            if (/\s/.test(trimmedValue)) {
                setFieldError(name, 'Password cannot contain spaces.', force);
                return false;
            }
        }

        if (name === 'confirmPassword' && trimmedValue !== data.password) {
            setFieldError(name, 'Passwords do not match.', force);
            return false;
        }

        if (name === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(trimmedValue)) {
                setFieldError(name, 'Enter a valid email address.', force);
                return false;
            }
        }

        if (name === 'captcha') {
            if (verificationStatus !== 'success') {
                setFieldError(name, 'Please verify your email address.', force);
                return false;
            }
        }

        clearFieldError(name, force);
        return true;
    };

    const validateStep4 = (force = true) => {
        clearErrors();
        const results = requiredFields.map((field) => validateField(field, data[field], force));
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
        // If email is modified, reset verification state
        setShowCodeNotice(false);
        setHasRequestedCode(false);
        setCodeTimer(0);
        setPinCode(['', '', '', '', '', '']);
        setVerificationStatus('idle');
        setVerificationError('');
        handleInputChange({ target: { name: 'captcha', value: '' } });
    };

    const handleRequestCode = async () => {
        if (!validateField('email', data.email, true)) {
            return;
        }

        setIsSendingCode(true);
        try {
            const response = await axios.post(route('email.send-code'), {
                email: data.email,
            });

            if (response.data.success) {
                setShowCodeNotice(true);
                setHasRequestedCode(true);
                setCodeTimer(60);
                clearFieldError('email');
                if (errors.captcha) {
                    clearFieldError('captcha');
                }
            } else {
                setFieldError('email', response.data.message || 'Failed to send verification code.', true);
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to send verification code.';
            setFieldError('email', msg, true);
        } finally {
            setIsSendingCode(false);
        }
    };

    // Premium 6-digit interactive code inputs handlers
    const handlePinChange = (index, value) => {
        const val = value.replace(/[^0-9]/g, '');
        const newPinCode = [...pinCode];

        if (val.length > 1) {
            // Handle paste / multiple characters
            const digits = val.slice(0, 6).split('');
            for (let i = 0; i < 6; i++) {
                newPinCode[i] = digits[i] || '';
            }
            setPinCode(newPinCode);
            handleInputChange({ target: { name: 'captcha', value: newPinCode.join('') } });
            
            const nextFocusIndex = Math.min(digits.length, 5);
            inputRefs.current[nextFocusIndex]?.focus();
            return;
        }

        newPinCode[index] = val;
        setPinCode(newPinCode);
        handleInputChange({ target: { name: 'captcha', value: newPinCode.join('') } });

        if (val && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePinKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pinCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePinPaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '').slice(0, 6);
        if (pasteData) {
            const newPinCode = [...pinCode];
            const digits = pasteData.split('');
            for (let i = 0; i < 6; i++) {
                newPinCode[i] = digits[i] || '';
            }
            setPinCode(newPinCode);
            handleInputChange({ target: { name: 'captcha', value: newPinCode.join('') } });

            const focusIdx = Math.min(digits.length, 5);
            inputRefs.current[focusIdx]?.focus();
        }
    };

    const handleVerifyCode = async () => {
        const codeString = pinCode.join('');
        if (codeString.length < 6) {
            setFieldError('captcha', 'Enter the 6-digit verification code.', true);
            setVerificationStatus('error');
            setVerificationError('Enter the 6-digit verification code.');
            return;
        }

        setVerificationStatus('checking');
        setVerificationError('');

        try {
            const response = await axios.post(route('email.verify-code'), {
                email: data.email,
                code: codeString,
            });

            if (response.data.success) {
                setVerificationStatus('success');
                clearFieldError('captcha');
                clearFieldError('email');
            } else {
                setVerificationStatus('error');
                setVerificationError(response.data.message || 'Incorrect code. Please try again.');
                setFieldError('captcha', response.data.message || 'Incorrect code.', true);
            }
        } catch (error) {
            setVerificationStatus('error');
            const msg = error.response?.data?.message || 'Incorrect code. Please try again.';
            setVerificationError(msg);
            setFieldError('captcha', msg, true);
        }
    };

    const handleEditEmail = () => {
        setVerificationStatus('idle');
        setHasRequestedCode(false);
        setCodeTimer(0);
        setShowCodeNotice(false);
        setPinCode(['', '', '', '', '', '']);
        handleInputChange({ target: { name: 'captcha', value: '' } });
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
                Account Creation
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
                            disabled={verificationStatus === 'success'}
                        />
                        {step4ShowErrors && errors.email && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                                !
                            </div>
                        )}
                    </div>
                    {renderFieldError('email')}
                </div>

                <div className="w-full md:w-1/4 md:pt-[31px]">
                    {verificationStatus === 'success' ? (
                        <button
                            type="button"
                            onClick={handleEditEmail}
                            className="w-full py-3 rounded-xl border border-gray-600 text-gray-400 font-semibold hover:bg-gray-600 hover:text-white transition"
                        >
                            Edit Email
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleRequestCode}
                            disabled={codeTimer > 0 || isSendingCode}
                            className="w-full py-3 rounded-xl border border-yellow-500 text-yellow-400 font-semibold hover:bg-yellow-500 hover:text-black transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSendingCode ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Sending...</span>
                                </>
                            ) : !hasRequestedCode ? (
                                'Get Code'
                            ) : codeTimer > 0 ? (
                                `Resend Code (${codeTimer}s)`
                            ) : (
                                'Resend Code'
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Premium 6-Digit Verification UI */}
            {hasRequestedCode && (
                <div className="mb-6 p-4 rounded-xl border border-[#242424] bg-white/[0.02] backdrop-blur-sm">
                    {/* EMAIL VERIFICATION NOTE */}
                    <div className="self-stretch pl-2 pr-3 py-2 bg-white/5 rounded-[10px] shadow-sm border border-yellow-500/20 flex justify-start items-start gap-2 mb-4">
                        <div className="flex justify-start items-center gap-1">
                            <div>
                                <span className="text-yellow-500 text-xs font-semibold font-sans leading-4">Email Verification Required</span>
                                <span className="text-white/70 text-xs font-normal font-sans leading-4"> — Please check your email address for the verification code.</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="inline-flex justify-start items-center gap-0.5">
                            <div className="text-white text-sm font-semibold font-sans leading-5">Enter Verification Code</div>
                            <div className="text-red-500 text-sm font-medium font-sans leading-5">*</div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                            <div className="flex items-center gap-1.5 justify-between">
                                {pinCode.map((digit, index) => (
                                    <React.Fragment key={index}>
                                        <input
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handlePinChange(index, e.target.value)}
                                            onKeyDown={(e) => handlePinKeyDown(index, e)}
                                            onPaste={handlePinPaste}
                                            disabled={verificationStatus === 'success'}
                                            className={`w-11 h-11 text-center bg-black/20 rounded-md text-2xl font-extrabold text-white transition-all outline-none border
                                                ${verificationStatus === 'success'
                                                    ? 'border-green-500 bg-green-500/10 text-green-400'
                                                    : verificationStatus === 'error'
                                                        ? 'border-red-500 bg-red-500/10 text-red-400'
                                                        : 'border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400'
                                                }`}
                                        />
                                        {index === 2 && (
                                            <span className="text-gray-500 text-2xl font-medium">-</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={handleVerifyCode}
                                disabled={verificationStatus === 'success' || verificationStatus === 'checking'}
                                className={`flex-1 h-11 px-4 py-2.5 rounded-xl font-semibold flex justify-center items-center transition-all border
                                    ${verificationStatus === 'success'
                                        ? 'bg-green-500/20 text-green-400 border-green-500'
                                        : verificationStatus === 'error'
                                            ? 'bg-red-500/20 text-red-400 border-red-500 hover:bg-red-500/30'
                                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500 hover:bg-yellow-500/20'
                                    }`}
                            >
                                {verificationStatus === 'success'
                                    ? 'Verified ✓'
                                    : verificationStatus === 'checking'
                                        ? 'Verifying...'
                                        : verificationStatus === 'error'
                                            ? 'Try Again'
                                            : 'Verify'}
                            </button>
                        </div>

                        {/* Helper Texts */}
                        {verificationStatus === 'idle' && (
                            <p className="mt-2 text-xs text-gray-500">
                                Verification code sent to email.
                            </p>
                        )}
                        {verificationStatus === 'error' && (
                            <p className="mt-2 text-xs text-red-400">
                                {verificationError || 'Incorrect code. Please check your email and try again.'}
                            </p>
                        )}
                        {verificationStatus === 'success' && (
                            <p className="mt-2 text-xs text-green-400">
                                Email verified successfully! Your profile is ready.
                            </p>
                        )}
                        {renderFieldError('captcha')}
                    </div>
                </div>
            )}

            <div className="mb-2 flex justify-center">
                <label className="flex items-center gap-2 text-white/80 text-sm cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={!!data.termsAccepted}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 rounded border-gray-500 bg-transparent text-yellow-500 focus:ring-yellow-400"
                    />
                    <span>
                        I agree with the MSL{' '}
                        <button type="button" className="text-yellow-400 hover:underline">
                            Terms and Conditions and Privacy Policy
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
