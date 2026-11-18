import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';

const TONES = {
    brand: 'border-[#F2C21A]/30 bg-[#F2C21A]/10 text-[#F2C21A]',
    success: 'border-green-400/30 bg-green-500/10 text-green-400',
    danger: 'border-red-400/30 bg-red-500/10 text-red-400',
};

/**
 * MSL-styled pop-up used by the Contact Us flow (confirm, success, failed).
 * `locked` stops the backdrop / Escape from closing it (e.g. while sending).
 */
export default function ContactModal({ open, onClose, locked = false, tone = 'brand', icon: Icon, title, description, children, actions }) {
    return (
        <Dialog open={open} onClose={locked ? () => {} : onClose} className="relative z-[100]">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
                <DialogPanel className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] p-6 text-white shadow-2xl sm:p-8">
                    {Icon ? (
                        <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border ${TONES[tone]}`}>
                            <Icon className="h-7 w-7" aria-hidden="true" />
                        </span>
                    ) : null}
                    <DialogTitle className="mt-5 text-center text-xl font-bold sm:text-2xl">{title}</DialogTitle>
                    {description ? (
                        <Description className="mt-2 text-center text-sm leading-6 text-gray-400">{description}</Description>
                    ) : null}
                    {children}
                    {actions ? <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">{actions}</div> : null}
                </DialogPanel>
            </div>
        </Dialog>
    );
}
