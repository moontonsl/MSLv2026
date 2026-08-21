import BaseModal from '@/Components/Admin/BaseModal';
import { MODAL_CLOSE_BUTTON_CLASS, MODAL_SUBMIT_FOOTER_CLASS } from '@/Components/Admin/adminModalFormStyles';
import { Check, Copy, X } from 'lucide-react';
import { useState } from 'react';

/**
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   inviteCode: string;
 * }} props
 */
export default function TeamInviteCodeModal({ isOpen, onClose, inviteCode }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(inviteCode);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            hideHeader
            scrollable={false}
            maxWidth="max-w-sm"
            footer={
                <button type="button" onClick={onClose} className={MODAL_SUBMIT_FOOTER_CLASS}>
                    Continue
                </button>
            }
        >
            <div className="relative px-1 py-2 text-center sm:py-4">
                <button
                    type="button"
                    onClick={onClose}
                    className={`absolute -right-1 -top-1 ${MODAL_CLOSE_BUTTON_CLASS}`}
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-yellow-500 bg-[#1a1a1a] sm:h-16 sm:w-16">
                    <Check className="h-7 w-7 text-yellow-500 sm:h-8 sm:w-8" />
                </div>

                <h2 className="text-lg font-bold text-white sm:text-xl">
                    Team Invite Code Generated!
                </h2>
                <p className="mx-auto mt-2 max-w-xs text-sm text-gray-400">
                    Send this code to your team members so they can join!
                </p>

                <div className="mt-5 flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-neutral-700 bg-[#0a0a0a] px-4 py-3">
                    <span className="text-base font-bold text-yellow-500">{inviteCode}</span>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-yellow-500 transition-colors hover:bg-yellow-500/10"
                        aria-label="Copy invite code"
                    >
                        <Copy className="h-4 w-4" />
                    </button>
                </div>
                {copied ? (
                    <p className="mt-2 text-xs text-yellow-500">Copied to clipboard</p>
                ) : null}
            </div>
        </BaseModal>
    );
}
