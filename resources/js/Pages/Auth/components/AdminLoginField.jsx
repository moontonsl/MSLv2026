import InputError from "@/Components/InputError";

const FIELD_CLASSES =
    "flex h-[60px] w-full items-center rounded-xl border bg-white px-[15px] transition-colors focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30";

export default function AdminLoginField({
    id,
    name,
    label,
    placeholder,
    type = "text",
    value,
    error,
    icon: Icon,
    onChange,
    autoComplete,
    endAdornment,
}) {
    const errorId = `${id}-error`;

    return (
        <div>
            <label htmlFor={id} className="sr-only">
                {label}
            </label>

            <div
                className={`${FIELD_CLASSES} ${
                    error ? "border-error-500" : "border-black/20"
                }`}
            >
                <Icon
                    aria-hidden="true"
                    className="mr-[5px] h-7 w-7 shrink-0 text-black/20"
                    strokeWidth={1.25}
                />

                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    required
                    autoComplete={autoComplete}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    placeholder={placeholder}
                    onChange={onChange}
                    className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 font-heading text-label font-bold leading-[26px] text-gray-800 outline-none placeholder:text-black/20 placeholder:opacity-100 focus:border-transparent focus:ring-0"
                />

                {endAdornment}
            </div>

            <InputError id={errorId} message={error} className="mt-2" />
        </div>
    );
}
