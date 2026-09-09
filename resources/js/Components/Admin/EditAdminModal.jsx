import BaseModal from "@/Components/Admin/BaseModal";

import {
    MODAL_INPUT_CLASS,
    MODAL_LABEL_CLASS,
    MODAL_SUBMIT_FOOTER_CLASS,
} from "@/Components/Admin/adminModalFormStyles";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useState } from "react";

const INITIAL_FORM = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "Admin",
};

const ROLE_LABELS = {
    admin: "Admin",
    content_admin: "Content Manager",
    regional_admin: "Regional Admin",
    event_admin: "Event Manager",
    super_admin: "Super Admin",
};

const ROLE_OPTIONS = [
    "Admin",
    "Content Manager",
    "Regional Admin",
    "Event Manager",
    "Super Admin",
];

function getRoleLabel(role) {
    return ROLE_LABELS[role] ?? role ?? "Admin";
}

export default function EditAdminModal({ account, isOpen, onClose, onSubmit }) {
    const formId = useId();

    const [form, setForm] = useState(INITIAL_FORM);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!account || !isOpen) {
            return;
        }

        setForm({
            name: account.name ?? "",
            email: account.email ?? "",
            password: "",
            password_confirmation: "",
            role: getRoleLabel(account.role ?? account.user_type),
        });

        setError("");
    }, [account, isOpen]);

    if (!account) {
        return null;
    }

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setError("");
    };

    const closeModal = () => {
        setForm(INITIAL_FORM);
        setError("");
        onClose();
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const hasNewPassword = Boolean(
            form.password || form.password_confirmation,
        );

        if (hasNewPassword && form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (hasNewPassword && form.password !== form.password_confirmation) {
            setError("Passwords do not match.");
            return;
        }

        onSubmit({
            id: account.id,
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            role: form.role,
        });

        closeModal();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={closeModal}
            title="Edit Admin Account"
            showCloseButton
            maxWidth="max-w-[330px] sm:max-w-[600px]"
            footer={
                <button
                    type="submit"
                    form={formId}
                    className={MODAL_SUBMIT_FOOTER_CLASS}
                >
                    Update
                </button>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        htmlFor={`${formId}-name`}
                        className={MODAL_LABEL_CLASS}
                    >
                        Full Name
                    </label>

                    <input
                        id={`${formId}-name`}
                        type="text"
                        required
                        value={form.name}
                        onChange={(event) =>
                            updateField("name", event.target.value)
                        }
                        placeholder="Leonora Teresa"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label
                        htmlFor={`${formId}-email`}
                        className={MODAL_LABEL_CLASS}
                    >
                        Email Address
                    </label>

                    <input
                        id={`${formId}-email`}
                        type="email"
                        required
                        value={form.email}
                        onChange={(event) =>
                            updateField("email", event.target.value)
                        }
                        placeholder="example@msl.com"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label
                        htmlFor={`${formId}-password`}
                        className={MODAL_LABEL_CLASS}
                    >
                        New Password
                    </label>

                    <input
                        id={`${formId}-password`}
                        type="password"
                        minLength={8}
                        value={form.password}
                        onChange={(event) =>
                            updateField("password", event.target.value)
                        }
                        placeholder="Leave blank to keep current password"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label
                        htmlFor={`${formId}-password-confirmation`}
                        className={MODAL_LABEL_CLASS}
                    >
                        Confirm New Password
                    </label>

                    <input
                        id={`${formId}-password-confirmation`}
                        type="password"
                        minLength={8}
                        value={form.password_confirmation}
                        onChange={(event) =>
                            updateField(
                                "password_confirmation",
                                event.target.value,
                            )
                        }
                        placeholder="Re-enter the new password"
                        className={MODAL_INPUT_CLASS}
                    />
                </div>

                <div>
                    <label
                        htmlFor={`${formId}-role`}
                        className={MODAL_LABEL_CLASS}
                    >
                        Role Description
                    </label>

                    <div className="relative">
                        <select
                            id={`${formId}-role`}
                            value={form.role}
                            onChange={(event) =>
                                updateField("role", event.target.value)
                            }
                            className={`${MODAL_INPUT_CLASS} cursor-pointer appearance-none bg-none pr-10 [background-image:none] [&::-ms-expand]:hidden`}
                            style={{
                                WebkitAppearance: "none",
                                MozAppearance: "none",
                                appearance: "none",
                                backgroundImage: "none",
                            }}
                        >
                            {ROLE_OPTIONS.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555560]"
                        />
                    </div>
                </div>

                {error ? (
                    <p
                        role="alert"
                        className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-300"
                    >
                        {error}
                    </p>
                ) : null}
            </form>
        </BaseModal>
    );
}
