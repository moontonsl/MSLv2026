import { Fragment, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X } from 'lucide-react';

export default function MobileNavigationDrawer({ open, onClose, onAfterLeave, children }) {
    const closeButtonRef = useRef(null);

    return (
        <Transition show={open} as={Fragment} afterLeave={onAfterLeave}>
            <Dialog
                onClose={onClose}
                initialFocus={closeButtonRef}
                className="relative z-[70] lg:hidden"
                style={{ '--drawer-ease': 'cubic-bezier(0.32, 0.72, 0, 1)' }}
            >
                <TransitionChild
                    as={Fragment}
                    enter="transition-opacity duration-150 ease-out motion-reduce:transition-none"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150 ease-out motion-reduce:transition-none"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-hidden">
                    <TransitionChild
                        as={Fragment}
                        enter="transition-transform duration-300 ease-[var(--drawer-ease)] motion-reduce:transition-none"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition-transform duration-200 ease-[var(--drawer-ease)] motion-reduce:transition-none"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <DialogPanel className="absolute inset-y-0 left-0 flex w-80 max-w-[calc(100vw-3rem)] flex-col border-r border-white/10 bg-bg-card text-white shadow-soft">
                            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
                                <DialogTitle className="sr-only">Main navigation</DialogTitle>
                                <Link
                                    href="/"
                                    onClick={onClose}
                                    aria-label="MSL Philippines home"
                                    className="flex h-11 min-w-0 items-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                                >
                                    <img src="/msl-logo.png" alt="MSL Philippines" className="h-9 w-auto max-w-full object-contain" />
                                </Link>
                                <button
                                    ref={closeButtonRef}
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Close navigation"
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-gray-300 transition-colors duration-150 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 motion-reduce:transition-none"
                                >
                                    <X className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
                                {children}
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}
