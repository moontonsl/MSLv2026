import BaseModal from '@/Components/Admin/BaseModal';
import TournamentDatePicker from '@/Components/CampusTournament/TournamentDatePicker';
import {
    MODAL_SUBMIT_FOOTER_CLASS,
} from '@/Components/Admin/adminModalFormStyles';
import { formatShortDate } from '@/data/campusTournamentData';
import { CalendarDays } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

const EMPTY_FORM = {
    mode: 'Online',
    startDate: '',
    endDate: '',
};

/**
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   onSubmit: (values: typeof EMPTY_FORM) => void;
 * }} props
 */
export default function CreateTournamentModal({ isOpen, onClose, onSubmit }) {
    const formId = useId();
    const [form, setForm] = useState(EMPTY_FORM);
    const [pickerField, setPickerField] = useState(null);

    useEffect(() => {
        if (!isOpen) return;
        setForm(EMPTY_FORM);
        setPickerField(null);
    }, [isOpen]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!form.startDate || !form.endDate) return;
        onSubmit(form);
    };

    const openPicker = (field) => setPickerField(field);

    const applyDate = (isoDate) => {
        if (!pickerField) return;
        setForm((prev) => ({ ...prev, [pickerField]: isoDate }));
        setPickerField(null);
    };

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                title="Create Tournament"
                maxWidth="max-w-md"
                footer={
                    <button type="submit" form={formId} className={MODAL_SUBMIT_FOOTER_CLASS}>
                        Submit
                    </button>
                }
            >
                <form id={formId} onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex rounded-xl bg-[#1a1a1a] p-1">
                        {['Online', 'Onsite'].map((mode) => {
                            const isActive = form.mode === mode;
                            return (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setForm((prev) => ({ ...prev, mode }))}
                                    className={`min-h-[44px] flex-1 rounded-lg text-sm font-bold transition-colors ${
                                        isActive
                                            ? 'bg-yellow-500 text-black'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    {mode}
                                </button>
                            );
                        })}
                    </div>

                    {[
                        { key: 'startDate', label: 'Start Date' },
                        { key: 'endDate', label: 'End Date' },
                    ].map(({ key, label }) => (
                        <div key={key}>
                            <label htmlFor={`tournament-${key}`} className="mb-2 block text-sm text-white">
                                {label} <span className="text-red-500">*</span>
                            </label>
                            <button
                                id={`tournament-${key}`}
                                type="button"
                                onClick={() => openPicker(key)}
                                className="flex min-h-[44px] w-full items-center gap-3 rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-left text-base text-white transition-shadow focus:ring-2 focus:ring-yellow-500 md:text-sm"
                            >
                                <CalendarDays className="h-5 w-5 shrink-0 text-yellow-500" />
                                <span className={form[key] ? 'text-white' : 'text-gray-500'}>
                                    {form[key] ? formatShortDate(form[key]) : 'Select dates'}
                                </span>
                            </button>
                        </div>
                    ))}
                </form>
            </BaseModal>

            <TournamentDatePicker
                isOpen={pickerField != null}
                value={pickerField ? form[pickerField] : null}
                onCancel={() => setPickerField(null)}
                onApply={applyDate}
            />
        </>
    );
}
