import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";

const INITIAL_FORM = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "Admin",
};

const INPUT_CLASS =
    "min-h-11 w-full rounded-md border border-white/[0.05] bg-[#1A1A1A] px-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24]";

export default function CreateAdminModal({ isOpen, onClose, onSubmit }) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setForm(INITIAL_FORM);
            setError("");
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const closeModal = () => {
        setForm(INITIAL_FORM);
        setError("");
        onClose();
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (form.password !== form.password_confirmation) {
            setError("Passwords do not match.");
            return;
        }

        onSubmit({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            role: form.role,
        });

        closeModal();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-admin-title"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    closeModal();
                }
            }}
        >
            <div
                className="max-h-[calc(100dvh-2rem)] w-full max-w-[600px] overflow-y-auto rounded-xl border border-[#8A6A00] bg-[#0B0B0B] p-6 sm:p-8"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="mb-6 flex items-center justify-between sm:mb-7">
                    <h2
                        id="create-admin-title"
                        className="font-heading text-lg font-bold text-[#FBBF24] sm:text-[22px]"
                    >
                        Create New Admin Account
                    </h2>

                    <button
                        type="button"
                        onClick={closeModal}
                        className="flex min-h-11 min-w-11 items-center justify-center text-gray-400 transition hover:text-white"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 sm:space-y-6"
                >
                    <div>
                        <label
                            htmlFor="admin-name"
                            className="mb-2 block text-xs font-medium text-[#FFFBEB] sm:text-sm"
                        >
                            Full Name
                        </label>

                        <input
                            id="admin-name"
                            type="text"
                            required
                            value={form.name}
                            onChange={(event) =>
                                updateField("name", event.target.value)
                            }
                            placeholder="Leonora Teresa"
                            className={INPUT_CLASS}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="admin-email"
                            className="mb-2 block text-xs font-medium text-[#FFFBEB] sm:text-sm"
                        >
                            Email Address
                        </label>

                        <input
                            id="admin-email"
                            type="email"
                            required
                            value={form.email}
                            onChange={(event) =>
                                updateField("email", event.target.value)
                            }
                            placeholder="example@msl.com"
                            className={INPUT_CLASS}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="admin-password"
                            className="mb-2 block text-xs font-medium text-[#FFFBEB] sm:text-sm"
                        >
                            Password
                        </label>

                        <input
                            id="admin-password"
                            type="password"
                            required
                            minLength="8"
                            value={form.password}
                            onChange={(event) =>
                                updateField("password", event.target.value)
                            }
                            placeholder="********"
                            className={INPUT_CLASS}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="admin-password-confirmation"
                            className="mb-2 block text-xs font-medium text-[#FFFBEB] sm:text-sm"
                        >
                            Confirm Password
                        </label>

                        <input
                            id="admin-password-confirmation"
                            type="password"
                            required
                            minLength="8"
                            value={form.password_confirmation}
                            onChange={(event) =>
                                updateField(
                                    "password_confirmation",
                                    event.target.value,
                                )
                            }
                            placeholder="********"
                            className={INPUT_CLASS}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="admin-role"
                            className="mb-2 block text-xs font-medium text-[#FFFBEB] sm:text-sm"
                        >
                            Role Description
                        </label>

                        <div className="relative">
                            <select
                                id="admin-role"
                                value={form.role}
                                onChange={(event) =>
                                    updateField("role", event.target.value)
                                }
                                className={`${INPUT_CLASS} appearance-none pr-10`}
                            >
                                <option value="Admin">Admin</option>
                                <option value="Content Manager">
                                    Content Manager
                                </option>
                                <option value="Regional Admin">
                                    Regional Admin
                                </option>
                                <option value="Event Manager">
                                    Event Manager
                                </option>
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs text-red-500 sm:text-sm">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="min-h-[54px] w-full rounded-[10px] bg-[#FBBF24] text-base font-bold text-black transition hover:bg-[#FCD34D] sm:text-xl"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
