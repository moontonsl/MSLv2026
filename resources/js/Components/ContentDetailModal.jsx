import { Dialog, DialogPanel, DialogTitle, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { X } from 'lucide-react';
import { useRef } from 'react';
import { MODAL_CLOSE_BUTTON_CLASS } from './Admin/adminModalFormStyles';
import styles from '@/Pages/ContentMedia.module.css';

export default function ContentDetailModal({ open, onClose, title, subtitle, leading, tabs = [], activeTab = 'overview', onTabChange, renderTab, titleClassName = 'text-white' }) {
    const scrollArea = useRef(null);
    const selectedIndex = Math.max(0, tabs.findIndex((tab) => tab.id === activeTab));

    const selectTab = (index) => {
        onTabChange?.(tabs[index].id);
        if (scrollArea.current) scrollArea.current.scrollTop = 0;
    };

    return (
        <Dialog open={open} onClose={onClose} className={`${styles.interactionScope} relative z-[80]`}>
            <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                    <DialogPanel className="flex h-[calc(100dvh_-_2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-neutral-700 bg-[#0D0D0D] text-white sm:h-[min(48rem,90dvh)]">
                        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-neutral-800 px-5 py-4 sm:px-8 sm:py-5">
                            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                                {leading}
                                <div className="min-w-0">
                                    <DialogTitle className={`break-words text-lg font-bold leading-snug sm:text-2xl ${titleClassName}`}>{title}</DialogTitle>
                                    {subtitle && <p className="mt-1 text-xs leading-5 text-gray-400 sm:text-sm">{subtitle}</p>}
                                </div>
                            </div>
                            <button type="button" data-autofocus onClick={onClose} aria-label="Close details" className={`${MODAL_CLOSE_BUTTON_CLASS} shrink-0`}>
                                <X className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                        {tabs.length > 1 ? <TabGroup selectedIndex={selectedIndex} onChange={selectTab} className="flex min-h-0 flex-1 flex-col">
                                <TabList aria-label="Details sections" className="shrink-0 overflow-x-auto border-b border-neutral-800 px-5 sm:px-8">
                                    <div className="flex w-max min-w-full gap-6">
                                        {tabs.map((tab, index) => (
                                            <Tab key={tab.id} className={`relative inline-flex min-h-12 items-center whitespace-nowrap py-3 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-400 ${index === selectedIndex ? 'text-purple-300' : 'text-gray-400 hover:text-white'}`}>
                                                {tab.label}
                                                {index === selectedIndex && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-purple-400" aria-hidden="true" />}
                                            </Tab>
                                        ))}
                                    </div>
                                </TabList>
                            <TabPanels ref={scrollArea} className="min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-auto p-4 [scrollbar-gutter:stable] sm:p-6 lg:p-8">
                                {tabs.map((tab) => (
                                    <TabPanel key={tab.id} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-400">
                                        {renderTab?.(tab.id)}
                                    </TabPanel>
                                ))}
                            </TabPanels>
                        </TabGroup> : (
                            <div ref={scrollArea} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8">
                                {tabs[0] && renderTab?.(tabs[0].id)}
                            </div>
                        )}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
