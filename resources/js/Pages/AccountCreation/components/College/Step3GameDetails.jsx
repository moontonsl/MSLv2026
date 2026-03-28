import React from 'react';
import styles from '../../register.module.scss';
import { ChevronDown, Search, X, Gamepad2 } from 'lucide-react';
import { mlbbHeroes, mlbbRanks, mlbbRoles, mlbbVerificationSample } from '../../data/mlbbOptions';

const Step3GameDetails = ({
    data,
    handleInputChange,
    step3ValidationTrigger,
    onCancelVerification,
}) => {
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
    const [showVerificationModal, setShowVerificationModal] = React.useState(true);

    const requiredFields = ['userId', 'serverId', 'ign', 'rank', 'inGameRole', 'mainHero'];

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
        searchPlaceholder
    ) => (
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

    const handleVerificationContinue = () => {
        handleInputChange({ target: { name: 'userId', value: mlbbVerificationSample.userId } });
        handleInputChange({ target: { name: 'serverId', value: mlbbVerificationSample.serverId } });
        handleInputChange({ target: { name: 'ign', value: mlbbVerificationSample.ign } });
        clearFieldError('userId');
        clearFieldError('serverId');
        clearFieldError('ign');
        setShowVerificationModal(false);
    };

    const handleVerificationCancel = () => {
        setShowVerificationModal(false);
        if (onCancelVerification) {
            onCancelVerification();
        }
    };

    return (
        <div className="relative">
            <h1 className={`${styles['title-register']} text-xl md:text-3xl mb-1`}>
                Create MSL Account
            </h1>

            <h2 className={`${styles['subtitle-register']} text-xs md:text-sm text-white/70 mb-1`}>
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

            {showVerificationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 relative shadow-2xl">
                        <button
                            type="button"
                            onClick={handleVerificationCancel}
                            className="absolute right-4 top-4 text-white/60 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex justify-center mb-4">
                            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xl">
                                <Gamepad2 className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <h3 className="text-xl font-semibold text-white">
                                Verify your MLBB Account
                            </h3>
                            <p className="text-sm text-white/60 mt-2">
                                You will be redirected to log in and verify your Mobile Legends account.
                                This step confirms your MLBB profile before submitting your entry.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={handleVerificationContinue}
                                className="w-full py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
                            >
                                Continue
                            </button>

                            <button
                                type="button"
                                onClick={handleVerificationCancel}
                                className="w-full py-3 rounded-xl border border-yellow-500 text-yellow-400 font-semibold hover:bg-yellow-500 hover:text-black transition"
                            >
                                Cancel
                            </button>
                        </div>

                        {/* <div className="mt-4 text-xs text-white/40 text-center">
                            MLBB verification is handled in the background.
                        </div> */}
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <div className="w-full md:w-1/2">
                    <label className={`${styles['label-register']} block mb-1`}>
                        MLBB User ID <span className={styles.required}>*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="userId"
                            value={data.userId}
                            readOnly
                            placeholder="Auto-confirmed"
                            className={getFieldClassName('userId', 'pr-10 bg-gray-800 cursor-not-allowed')}
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

                <div className="w-full md:w-1/2">
                    <label className={`${styles['label-register']} block mb-1`}>
                        MLBB Server <span className={styles.required}>*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="serverId"
                            value={data.serverId}
                            readOnly
                            placeholder="Auto-confirmed"
                            className={getFieldClassName('serverId', 'pr-10 bg-gray-800 cursor-not-allowed')}
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
                        placeholder="Auto-confirmed"
                        className={getFieldClassName('ign', 'pr-10 bg-gray-800 cursor-not-allowed')}
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
                        'Search rank...'
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
};

export default Step3GameDetails;
