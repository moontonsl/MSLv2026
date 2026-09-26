import BaseModal from '@/Components/Admin/BaseModal';
import { MODAL_CLOSE_BUTTON_CLASS } from '@/Components/Admin/adminModalFormStyles';
import { CalendarDays, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

const FIELD_CLASS =
    'w-full min-h-[44px] rounded-lg border border-neutral-700 bg-[#0a0a0a] px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-500';

/**
 * RA Export / Generate Report modal (Figma).
 *
 * @param {{
 *   isOpen: boolean;
 *   schools?: Array<{ value: string; label: string }>;
 *   onClose: () => void;
 *   onDownload?: (payload: { school: string; startDate: string; endDate: string }) => void;
 * }} props
 */
export default function GenerateReportModal({
    isOpen,
    schools = [{ value: 'all', label: 'All School' }],
    onClose,
    onDownload,
}) {
    const [school, setSchool] = useState(schools[0]?.value ?? 'all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleDownload = () => {
        onDownload?.({ school, startDate, endDate });
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            hideHeader
            scrollable={false}
            maxWidth="max-w-md"
            footer={
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-yellow-500 px-6 text-sm font-semibold text-yellow-500 transition-colors hover:bg-yellow-500/10 sm:min-w-[120px]"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-yellow-500 px-6 text-sm font-bold text-black transition-colors hover:bg-yellow-400 sm:min-w-[120px]"
                    >
                        Download
                    </button>
                </div>
            }
        >
            <div className="relative px-1 pb-2 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className={`absolute -right-1 -top-1 ${MODAL_CLOSE_BUTTON_CLASS}`}
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="pr-8 text-xl font-bold text-white">Generate Report</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    Download the latest tournament results for the selected school and date range.
                </p>

                <div className="mt-5 space-y-4">
                    <div>
                        <label htmlFor="report-school" className="mb-2 block text-sm text-white">
                            School <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="report-school"
                                value={school}
                                onChange={(event) => setSchool(event.target.value)}
                                className={`${FIELD_CLASS} appearance-none pr-10`}
                            >
                                {schools.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="report-start" className="mb-2 block text-sm text-white">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />
                                <input
                                    id="report-start"
                                    type="date"
                                    value={startDate}
                                    onChange={(event) => setStartDate(event.target.value)}
                                    className={`${FIELD_CLASS} pl-10`}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="report-end" className="mb-2 block text-sm text-white">
                                End Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />
                                <input
                                    id="report-end"
                                    type="date"
                                    value={endDate}
                                    onChange={(event) => setEndDate(event.target.value)}
                                    className={`${FIELD_CLASS} pl-10`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
}
