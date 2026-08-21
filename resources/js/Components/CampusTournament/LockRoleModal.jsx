import BaseModal from '@/Components/Admin/BaseModal';
import { MODAL_SUBMIT_FOOTER_CLASS } from '@/Components/Admin/adminModalFormStyles';
import { SOLO_ROLE_OPTIONS } from '@/data/campusTournamentCaptainData';
import { useEffect, useId, useMemo, useState } from 'react';

const INPUT_CLASS =
    'w-full min-h-[44px] rounded-lg border border-neutral-700 bg-[#0a0a0a] px-4 py-3 text-base text-white outline-none transition-shadow placeholder:text-gray-600 focus:ring-2 focus:ring-yellow-500 md:text-sm';

/**
 * Lock a vacant role and join an assembling solo team.
 *
 * @param {{
 *   isOpen: boolean;
 *   teamName?: string;
 *   availableRoles?: string[];
 *   onClose: () => void;
 *   onSubmit: (role: string) => void;
 * }} props
 */
export default function LockRoleModal({
    isOpen,
    teamName = 'MSL TEAM 1',
    availableRoles = [],
    onClose,
    onSubmit,
}) {
    const formId = useId();
    const [role, setRole] = useState('');

    const roleOptions = useMemo(() => {
        if (!availableRoles.length) return SOLO_ROLE_OPTIONS;
        return SOLO_ROLE_OPTIONS.filter((option) => availableRoles.includes(option.value));
    }, [availableRoles]);

    useEffect(() => {
        if (!isOpen) return;
        setRole('');
    }, [isOpen]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!role) return;
        onSubmit(role);
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            hideHeader
            maxWidth="max-w-md"
            footer={
                <button type="submit" form={formId} className={MODAL_SUBMIT_FOOTER_CLASS}>
                    Lock Role & Join
                </button>
            }
        >
            <div className="px-1 pb-1 pt-1">
                <h2 className="pr-8 text-xl font-bold text-white sm:text-2xl">
                    Lock role in <span className="text-yellow-500">&apos;{teamName}&apos;</span>?
                </h2>

                <form id={formId} onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label htmlFor="lock-role" className="mb-2 block text-sm text-white">
                            Select your role <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="lock-role"
                            value={role}
                            onChange={(event) => setRole(event.target.value)}
                            required
                            className={`${INPUT_CLASS} appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
                            style={{
                                backgroundImage:
                                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%239ca3af' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                            }}
                        >
                            <option value="" disabled>
                                Select Role
                            </option>
                            {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-400">
                        <span className="font-semibold text-yellow-500">Note:</span> Incomplete
                        rosters will be merged, roles will be randomly assigned once registration
                        locks.{' '}
                        <span className="underline">You cannot change your role once locked.</span>
                    </p>
                </form>
            </div>
        </BaseModal>
    );
}
