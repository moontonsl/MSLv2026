import { useEffect, useState } from 'react';
import Modal from './Modal';

const inputClassName =
    'w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-white outline-none transition-all placeholder:text-gray-600 focus:border-[#FBBF24]';

const submitClassName =
    'mt-6 w-full rounded-lg bg-[#FBBF24] py-3 font-bold text-black transition-all hover:brightness-110 active:scale-[0.98]';

/**
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   title: string;
 *   fields: {
 *     name: string;
 *     label: string;
 *     type?: 'text' | 'select' | 'textarea';
 *     placeholder?: string;
 *     options?: string[];
 *   }[];
 *   initialValues?: Record<string, string>;
 *   submitLabel: string;
 *   onSubmit: (values: Record<string, string>) => void;
 * }} props
 */
export default function AdminFormModal({
    isOpen,
    onClose,
    title,
    fields,
    initialValues = {},
    submitLabel,
    onSubmit,
}) {
    const [values, setValues] = useState({});

    useEffect(() => {
        if (!isOpen) return;
        const next = {};
        fields.forEach(({ name }) => {
            next[name] = initialValues[name] ?? '';
        });
        setValues(next);
    }, [isOpen, fields, initialValues]);

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(values);
    };

    const renderField = ({ name, label, type = 'text', placeholder, options = [] }) => {
        const value = values[name] ?? '';

        if (type === 'select') {
            return (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={(e) =>
                        setValues((prev) => ({ ...prev, [name]: e.target.value }))
                    }
                    className={inputClassName}
                >
                    <option value="" disabled>
                        Select {label.toLowerCase()}
                    </option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            );
        }

        if (type === 'textarea') {
            return (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={(e) =>
                        setValues((prev) => ({ ...prev, [name]: e.target.value }))
                    }
                    placeholder={placeholder}
                    rows={5}
                    className={`${inputClassName} h-32 resize-none`}
                />
            );
        }

        return (
            <input
                id={name}
                name={name}
                type="text"
                value={value}
                onChange={(e) =>
                    setValues((prev) => ({ ...prev, [name]: e.target.value }))
                }
                placeholder={placeholder}
                className={inputClassName}
            />
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="mb-6 text-xl font-bold text-[#FBBF24]">{title}</h2>
            <form onSubmit={handleSubmit}>
                {fields.map((field) => (
                    <div key={field.name} className="mb-4 last:mb-0">
                        <label htmlFor={field.name} className="mb-2 block text-sm text-gray-400">
                            {field.label}
                        </label>
                        {renderField(field)}
                    </div>
                ))}
                <button type="submit" className={submitClassName}>
                    {submitLabel}
                </button>
            </form>
        </Modal>
    );
}
