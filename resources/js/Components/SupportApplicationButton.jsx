import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import { ArrowUpRight, X } from 'lucide-react';

const APPLICATIONS = [
    { label: 'Buffs and Supports', href: 'https://forms.gle/qADENJyDirsrKE6P9' },
    { label: 'Airdrops', href: 'https://forms.gle/86NPozxsxoMGBjrPA' },
    { label: 'Tournament Lobby', href: 'https://forms.gle/GQZWtpVob91riAfh6' },
];

export default function SupportApplicationButton({ className, style, children }) {
    const [open, setOpen] = useState(false);

    return <>
        <button type="button" className={className} style={style} onClick={() => setOpen(true)} aria-haspopup="dialog">
            {children}
        </button>
        <Dialog open={open} onClose={setOpen} className="relative z-[100]">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
                <DialogPanel className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] p-6 text-white shadow-2xl sm:p-8">
                    <button type="button" onClick={() => setOpen(false)} aria-label="Close application options" className="absolute right-3 top-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400">
                        <X size={20} aria-hidden="true" />
                    </button>
                    <DialogTitle className="pr-9 text-xl font-bold">Choose your application</DialogTitle>
                    <Description className="mt-2 text-sm leading-6 text-gray-400">Select what you or your organization would like to apply for. Each form opens in a new tab.</Description>
                    <div className="mt-6 flex flex-col gap-3">
                        {APPLICATIONS.map(({ label, href }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="group flex min-h-14 items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm font-semibold text-white transition-colors hover:border-yellow-400/60 hover:bg-yellow-400/10 hover:text-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400">
                            {label}<ArrowUpRight size={18} aria-hidden="true" />
                        </a>)}
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    </>;
}
