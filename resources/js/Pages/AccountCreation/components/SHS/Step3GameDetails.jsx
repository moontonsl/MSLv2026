import React from 'react';
import axios from 'axios';
import styles from '../../register.module.scss';
import { ChevronDown, Search, Gamepad2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { mlbbHeroes, mlbbRanks, mlbbRoles } from '../../data/mlbbOptions';

const Step3GameDetails = React.forwardRef(function Step3GameDetails(
    {
        data,
        handleInputChange,
        step3ValidationTrigger,
    },
    ref
) {
    const rankDropdownRef = React.useRef(null);
    const roleDropdownRef = React.useRef(null);
    const heroDropdownRef = React.useRef(null);
    const previousValidationTriggerRef = React.useRef(step3ValidationTrigger);

    const [errors, setErrors] = React.useState({});
    const [rankOpen, setRankOpen] = React.useState(false);
    const [roleOpen, setRoleOpen] = React.useState(false);
    const [heroOpen, setHeroOpen] = React.useState(false);
    const [rankSearch, setRankSearch] = React.useState('');
    const [roleSearch, setRoleSearch] = React.useState('');
    const [heroSearch, setHeroSearch] = React.useState('');

    // Verification states
    const [timer, setTimer] = React.useState(0);
    const [sendingCode, setSendingCode] = React.useState(false);
    const [codeSent, setCodeSent] = React.useState(false);
    const [verifying, setVerifying] = React.useState(false);
    const [vc, setVc] = React.useState('');
    const [verificationError, setVerificationError] = React.useState('');

    const requiredFields = ['userId', 'serverId', 'ign', 'rank', 'inGameRole', 'mainHero'];

    // Cooldown countdown timer
    React.useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

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

    const validateField = (name, value, label) => {
        if (!value || !value.toString().trim()) {
            setFieldError(name, `${label} is required.`);
            return false;
        }
        clearFieldError(name);
        return true;
    };

    const validateStep3 = () => {
        if (!data.isMlbbVerified) {
            setVerificationError('Please verify your Mobile Legends account to proceed.');
            setFieldError('userId', 'Verification required.');
            return false;
        }

        const results = requiredFields.map((field) => {
            const labels = {
                userId: 'MLBB User ID',
                serverId: 'MLBB Server',
                ign: 'In-Game Name',
                rank: 'Current Rank',
                inGameRole: 'MLBB Role',
                mainHero: 'Main Hero',
            };
            return validateField(field, data[field], labels[field]);
        });

        return results.every(Boolean);
    };

    const handleSendCode = async () => {
        if (!data.userId || !data.serverId) {
            setVerificationError('Please enter both MLBB User ID and Server ID.');
            return;
        }

        setSendingCode(true);
        setVerificationError('');

        try {
            const response = await axios.post(route('mlbb.send-vc'), {
                role_id: data.userId,
                zone_id: data.serverId,
            });

            if (response.data.success) {
                setCodeSent(true);
                setTimer(60);
            } else {
                setVerificationError(response.data.message || 'Failed to send verification code.');
            }
        } catch (error) {
            setVerificationError(error.response?.data?.message || 'Failed to send verification code.');
        } finally {
            setSendingCode(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!vc) {
            setVerificationError('Please enter the 6-digit verification code.');
            return;
        }

        setVerifying(true);
        setVerificationError('');

        try {
            const response = await axios.post(route('mlbb.verify-vc'), {
                role_id: data.userId,
                zone_id: data.serverId,
                ml_vc: vc,
            });

            if (response.data.success) {
                const verifiedIgn = response.data.profile.ign;
                const verifiedRank = response.data.profile.rank;
                
                // Update parent states
                handleInputChange({ target: { name: 'ign', value: verifiedIgn } });
                if (verifiedRank) {
                    handleInputChange({ target: { name: 'rank', value: verifiedRank } });
                }
                handleInputChange({ target: { name: 'isMlbbVerified', value: true } });
                
                clearFieldError('userId');
                clearFieldError('serverId');
                clearFieldError('ign');
                clearFieldError('rank');
            } else {
                setVerificationError(response.data.message || 'Invalid verification code.');
            }
        } catch (error) {
            setVerificationError(error.response?.data?.message || 'Verification failed.');
        } finally {
            setVerifying(false);
        }
    };

    const handleReset = () => {
        handleInputChange({ target: { name: 'userId', value: '' } });
        handleInputChange({ target: { name: 'serverId', value: '' } });
        handleInputChange({ target: { name: 'ign', value: '' } });
        handleInputChange({ target: { name: 'isMlbbVerified', value: false } });
        setCodeSent(false);
        setVc('');
        setVerificationError('');
    };

    const filteredRanks = mlbbRanks.filter((rank) => {
        const query = rankSearch.toLowerCase().trim();
        return !query || rank.toLowerCase().includes(query);
    });

    const filteredRoles = mlbbRoles.filter((role) => {
        const query = roleSearch.toLowerCase().trim();
        return !query || role.toLowerCase().includes(query);
    });

    const filteredHeroes = mlbbHeroes.filter((hero) => {
        const query = heroSearch.toLowerCase().trim();
        return !query || hero.toLowerCase().includes(query);
    });

    const handleSelect = (name, value, closeDropdown, clearSearch) => {
        handleInputChange({ target: { name, value } });
        clearFieldError(name);
        closeDropdown(false);
        clearSearch('');
    };

    const handleOutsideClick = React.useCallback((event) => {
        if (rankDropdownRef.current && !rankDropdownRef.current.contains(event.target)) {
            setRankOpen(false);
        }
        if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
            setRoleOpen(false);
        }
        if (heroDropdownRef.current && !heroDropdownRef.current.contains(event.target)) {
            setHeroOpen(false);
        }
    }, []);

    React.useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [handleOutsideClick]);

    React.useEffect(() => {
        if (previousValidationTriggerRef.current === step3ValidationTrigger) {
            return;
        }
        previousValidationTriggerRef.current = step3ValidationTrigger;
        if (!step3ValidationTrigger) {
            return;
        }
        validateStep3();
    }, [step3ValidationTrigger]);

    React.useImperativeHandle(ref, () => ({
        validateStep3,
    }));

    const renderDropdown = (
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
        disabled = false
    ) => (
        <div className="relative" ref={ref}>
            <label className={`${styles['label-register']} block mb-1`}>
                {label} <span className={styles.required}>*</span>
            </label>

            <button
                type="button"
                onClick={() => !disabled && setOpen((prev) => !prev)}
                disabled={disabled}
                className={getFieldClassName(errorName, `flex items-center justify-between text-left ${disabled ? 'opacity-80 cursor-not-allowed bg-gray-800' : ''}`)}
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
                                    key={item}
                                    type="button"
                                    onClick={() => onSelect(item)}
                                    className="w-full px-4 py-3 text-left text-sm text-white hover:bg-yellow-500/10 hover:text-yellow-300 transition"
                                >
                                    {item}
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
        <div className="relative">
            <h1 className={`${styles['title-register']} text-2xl md:text-3xl mb-1`}>
                Account Creation
            </h1>

            <h2 className={`${styles['subtitle-register']} text-[0.5rem] leading-none md:text-sm text-white/60 md:text-white/70 mb-2 md:mb-1 tracking-[0.04em] md:tracking-[0.18em]`}>
                MLBB DETAILS
            </h2>

            {(() => {
                const filled = requiredFields.filter(
                    (field) => data[field] && data[field].toString().trim() !== ''
                ).length;
                const percent = 50 + Math.round((filled / requiredFields.length) * 25);

                return (
                    <div className="mb-3 text-center">
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-500 transition-all"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                        <p className="text-xs text-white/60 mt-4 mb-6 text-center">
                            STEP 3 of 4 - {percent}% OF THIS STEP COMPLETE
                        </p>
                    </div>
                );
            })()}

            {/* ERROR SUMMARY */}
            {verificationError && (
                <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg flex items-start gap-2 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{verificationError}</span>
                </div>
            )}

            <div className="flex flex-row justify-between mb-4 gap-3 md:gap-4">
                <div className="w-[60%] md:w-1/2 min-w-0">
                    <label className={`${styles['label-register']} block mb-1`}>
                        MLBB User ID <span className={styles.required}>*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="userId"
                            value={data.userId}
                            onChange={handleInputChange}
                            disabled={data.isMlbbVerified}
                            placeholder="e.g. 123456789"
                            className={getFieldClassName('userId', data.isMlbbVerified ? 'bg-gray-800 cursor-not-allowed opacity-80' : '')}
                            style={getFieldStyle('userId')}
                        />
                        {errors.userId && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                                !
                            </div>
                        )}
                    </div>
                    {renderFieldError('userId')}
                </div>

                <div className="w-[40%] md:w-1/2 min-w-0">
                    <label className={`${styles['label-register']} block mb-1`}>
                        MLBB Server <span className={styles.required}>*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="serverId"
                            value={data.serverId}
                            onChange={handleInputChange}
                            disabled={data.isMlbbVerified}
                            placeholder="e.g. 1234"
                            className={getFieldClassName('serverId', data.isMlbbVerified ? 'bg-gray-800 cursor-not-allowed opacity-80' : '')}
                            style={getFieldStyle('serverId')}
                        />
                        {errors.serverId && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                                !
                            </div>
                        )}
                    </div>
                    {renderFieldError('serverId')}
                </div>
            </div>

            {/* VERIFICATION ACTIONS */}
            {!data.isMlbbVerified ? (
                <div className="mb-5">
                    {!codeSent ? (
                        <button
                            type="button"
                            onClick={handleSendCode}
                            disabled={sendingCode || !data.userId || !data.serverId}
                            className="w-full py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {sendingCode ? (
                                <>
                                    <RefreshCw className="animate-spin h-4 w-4" />
                                    Sending Code...
                                </>
                            ) : (
                                <>
                                    <Gamepad2 className="h-4 w-4" />
                                    Send Verification Code to Mailbox
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="bg-[#111111] p-4 rounded-xl border border-white/10">
                            <p className="text-xs text-green-400 mb-3 flex items-center gap-1.5">
                                <CheckCircle2 size={14} />
                                Code sent to your in-game mailbox! Check your MLBB mail.
                            </p>
                            <div className="flex gap-2.5">
                                <input
                                    type="text"
                                    value={vc}
                                    onChange={(e) => setVc(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter code"
                                    className="flex-1 p-3 rounded-lg bg-black border border-gray-600 text-white outline-none focus:border-yellow-400 text-center tracking-[0.2em] font-bold"
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyCode}
                                    disabled={verifying || vc.length < 4}
                                    className="px-6 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
                                >
                                    {verifying ? 'Verifying...' : 'Verify'}
                                </button>
                            </div>
                            <div className="mt-3 flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={handleSendCode}
                                    disabled={timer > 0 || sendingCode}
                                    className="text-xs text-yellow-400 hover:underline disabled:text-gray-500 disabled:no-underline"
                                >
                                    {timer > 0 ? `Resend code in ${timer}s` : 'Resend Code'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCodeSent(false)}
                                    className="text-xs text-gray-400 hover:text-white"
                                >
                                    Change details
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mb-5 bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                        <span className="text-sm font-semibold">Verified Player: {data.ign}</span>
                    </div>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="text-xs text-yellow-400 hover:underline"
                    >
                        Change Account
                    </button>
                </div>
            )}

            <div className="mb-4">
                <label className={`${styles['label-register']} block mb-1`}>
                    In-Game Name <span className={styles.required}>*</span>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        name="ign"
                        value={data.ign}
                        readOnly
                        placeholder={data.isMlbbVerified ? "" : "Will auto-populate after verification"}
                        className={getFieldClassName('ign', 'pr-10 bg-gray-800 cursor-not-allowed opacity-80')}
                        style={getFieldStyle('ign')}
                    />
                    {errors.ign && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-red-500 text-xs font-bold text-red-500 pointer-events-none">
                            !
                        </div>
                    )}
                </div>
                {renderFieldError('ign')}
            </div>

            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <div className="w-full relative">
                    {renderDropdown(
                        'Current Rank',
                        data.rank,
                        'Select rank',
                        rankOpen,
                        setRankOpen,
                        rankDropdownRef,
                        'rank',
                        rankSearch,
                        setRankSearch,
                        filteredRanks,
                        (value) => handleSelect('rank', value, setRankOpen, setRankSearch),
                        'Search rank...',
                        data.isMlbbVerified
                    )}
                </div>

                <div className="w-full relative">
                    {renderDropdown(
                        'MLBB Role',
                        data.inGameRole,
                        'Select role',
                        roleOpen,
                        setRoleOpen,
                        roleDropdownRef,
                        'inGameRole',
                        roleSearch,
                        setRoleSearch,
                        filteredRoles,
                        (value) => handleSelect('inGameRole', value, setRoleOpen, setRoleSearch),
                        'Search role...'
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <div className="w-full">
                    <label className={`${styles['label-register']} block mb-1`}>
                        MLBB Squad Name
                    </label>
                    <input
                        type="text"
                        name="squadName"
                        value={data.squadName}
                        onChange={handleInputChange}
                        placeholder="e.g. Katipunan"
                        className={getFieldClassName('squadName')}
                        style={getFieldStyle('squadName')}
                    />
                </div>

                <div className="w-full">
                    <label className={`${styles['label-register']} block mb-1`}>
                        MLBB Squad Name Abbreviation
                    </label>
                    <input
                        type="text"
                        name="squadAbbreviation"
                        value={data.squadAbbreviation}
                        onChange={handleInputChange}
                        placeholder="e.g. KKK"
                        className={getFieldClassName('squadAbbreviation')}
                        style={getFieldStyle('squadAbbreviation')}
                    />
                </div>
            </div>

            <div className="mb-6">
                {renderDropdown(
                    'Main Hero',
                    data.mainHero,
                    'Select hero',
                    heroOpen,
                    setHeroOpen,
                    heroDropdownRef,
                    'mainHero',
                    heroSearch,
                    setHeroSearch,
                    filteredHeroes,
                    (value) => handleSelect('mainHero', value, setHeroOpen, setHeroSearch),
                    'Search hero...'
                )}
            </div>
        </div>
    );
});

export default Step3GameDetails;
