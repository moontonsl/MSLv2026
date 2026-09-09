import BaseModal from "@/Components/Admin/BaseModal";
import RegionalAdminSchoolConfirmationModal from "@/Components/Admin/RegionalAdminSchoolConfirmationModal";

import {
    REGIONAL_MODAL_BODY_CLASS,
    REGIONAL_MODAL_CONTROL_CLASS,
    REGIONAL_MODAL_LABEL_CLASS,
    REGIONAL_MODAL_PANEL_CLASS,
    REGIONAL_MODAL_PRIMARY_CLASS,
    REGIONAL_MODAL_READONLY_CLASS,
    REGIONAL_MODAL_SELECT_CLASS,
    REGIONAL_MODAL_TITLE_CLASS,
} from "@/Components/Admin/regionalAdminModalStyles";

import {
    REGIONAL_ADMIN_CANDIDATES,
    REGIONAL_ADMIN_SCHOOL_OPTIONS,
} from "@/data/adminRegionalAdminData";

import { ChevronDown, Trash2 } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

const EMPTY_FORM = {
    candidateId: "",
    fullName: "",
    username: "",
    mslId: "",
    originalSchool: "",
    assignedSchools: [],
};

function normalizeAssignedSchools(schools) {
    if (!Array.isArray(schools)) {
        return [];
    }

    return schools
        .map((school) => {
            if (typeof school === "string") {
                return school.trim();
            }

            return String(
                school?.name ?? school?.schoolName ?? school?.school_name ?? "",
            ).trim();
        })
        .filter(Boolean);
}

function findCandidateId(regionalAdmin) {
    if (!regionalAdmin) {
        return "";
    }

    const regionalAdminMslId = String(
        regionalAdmin.mslId ??
            regionalAdmin.msl_id ??
            regionalAdmin.id_number ??
            "",
    );

    return (
        REGIONAL_ADMIN_CANDIDATES.find(
            (candidate) => String(candidate.mslId) === regionalAdminMslId,
        )?.id ?? ""
    );
}

function createInitialForm(regionalAdmin) {
    if (!regionalAdmin) {
        return {
            ...EMPTY_FORM,
            assignedSchools: [],
        };
    }

    return {
        candidateId: findCandidateId(regionalAdmin),
        fullName:
            regionalAdmin.fullName ??
            regionalAdmin.full_name ??
            regionalAdmin.name ??
            "",
        username: regionalAdmin.username ?? "",
        mslId: String(
            regionalAdmin.mslId ??
                regionalAdmin.msl_id ??
                regionalAdmin.id_number ??
                "",
        ),
        originalSchool:
            regionalAdmin.originalSchool ??
            regionalAdmin.original_school ??
            regionalAdmin.school ??
            "",
        assignedSchools: normalizeAssignedSchools(
            regionalAdmin.assignedSchools ?? regionalAdmin.assigned_schools,
        ),
    };
}

function FieldLabel({ htmlFor, children }) {
    return (
        <label htmlFor={htmlFor} className={REGIONAL_MODAL_LABEL_CLASS}>
            {children}
        </label>
    );
}

function SelectField({
    id,
    value,
    onChange,
    children,
    disabled = false,
    hasError = false,
    describedBy,
}) {
    return (
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={onChange}
                disabled={disabled}
                aria-invalid={hasError}
                aria-describedby={describedBy}
                className={`${REGIONAL_MODAL_SELECT_CLASS} ${
                    hasError
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                } disabled:cursor-not-allowed disabled:opacity-50`}
                style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                    backgroundImage: "none",
                }}
            >
                {children}
            </select>

            <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555560]"
            />
        </div>
    );
}

export default function RegionalAdminModal({
    isOpen,
    regionalAdmin,
    unavailableMslIds = [],
    onClose,
    onSubmit,
}) {
    const formId = useId();
    const isEditMode = Boolean(regionalAdmin);

    const modalTitle = isEditMode
        ? "Edit Regional Admin"
        : "Add Regional Admin";

    const [form, setForm] = useState(() => createInitialForm(regionalAdmin));

    const [selectedSchool, setSelectedSchool] = useState("");

    const [pendingSchoolAction, setPendingSchoolAction] = useState(null);

    const [errors, setErrors] = useState({});

    const unavailableIds = useMemo(
        () => new Set(unavailableMslIds.map(String)),
        [unavailableMslIds],
    );

    useEffect(() => {
        if (!isOpen) {
            setPendingSchoolAction(null);
            return;
        }

        setForm(createInitialForm(regionalAdmin));
        setSelectedSchool("");
        setPendingSchoolAction(null);
        setErrors({});
    }, [isOpen, regionalAdmin]);

    const handleCandidateChange = (event) => {
        const candidateId = event.target.value;

        const candidate = REGIONAL_ADMIN_CANDIDATES.find(
            (item) => item.id === candidateId,
        );

        if (!candidate) {
            setForm((current) => ({
                ...current,
                candidateId: "",
                fullName: "",
                username: "",
                mslId: "",
                originalSchool: "",
            }));

            return;
        }

        setForm((current) => ({
            ...current,
            candidateId: candidate.id,
            fullName: candidate.fullName,
            username: candidate.username,
            mslId: candidate.mslId,
            originalSchool: candidate.originalSchool,
        }));

        setErrors((current) => ({
            ...current,
            candidateId: undefined,
        }));
    };

    const handleSchoolChange = (event) => {
        setSelectedSchool(event.target.value);

        setErrors((current) => ({
            ...current,
            assignedSchools: undefined,
        }));
    };

    const handleAddSchoolRequest = () => {
        const school = selectedSchool.trim();

        if (!school) {
            setErrors((current) => ({
                ...current,
                assignedSchools: "Select a school before adding it.",
            }));

            return;
        }

        const alreadyAssigned = form.assignedSchools.some(
            (assignedSchool) =>
                assignedSchool.toLowerCase() === school.toLowerCase(),
        );

        if (alreadyAssigned) {
            setErrors((current) => ({
                ...current,
                assignedSchools: "This school is already assigned.",
            }));

            return;
        }

        setErrors((current) => ({
            ...current,
            assignedSchools: undefined,
        }));

        setPendingSchoolAction({
            type: "add",
            school,
        });
    };

    const handleDeleteSchoolRequest = (school) => {
        setPendingSchoolAction({
            type: "delete",
            school,
        });
    };

    const handleCancelSchoolAction = () => {
        setPendingSchoolAction(null);
    };

    const handleConfirmSchoolAction = () => {
        if (!pendingSchoolAction) {
            return;
        }

        if (pendingSchoolAction.type === "add") {
            setForm((current) => ({
                ...current,
                assignedSchools: [
                    ...current.assignedSchools,
                    pendingSchoolAction.school,
                ],
            }));

            setSelectedSchool("");
        }

        if (pendingSchoolAction.type === "delete") {
            setForm((current) => ({
                ...current,
                assignedSchools: current.assignedSchools.filter(
                    (school) => school !== pendingSchoolAction.school,
                ),
            }));
        }

        setErrors((current) => ({
            ...current,
            assignedSchools: undefined,
        }));

        setPendingSchoolAction(null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const nextErrors = {};

        if (!form.candidateId || !form.mslId) {
            nextErrors.candidateId = "Please select a regional administrator.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        onSubmit({
            fullName: form.fullName.trim(),
            username: form.username.trim(),
            mslId: String(form.mslId).trim(),
            originalSchool: form.originalSchool.trim(),
            assignedSchools: normalizeAssignedSchools(form.assignedSchools),
        });
    };

    return (
        <>
            <BaseModal
                isOpen={isOpen && !pendingSchoolAction}
                onClose={onClose}
                title={modalTitle}
                hideHeader
                showCloseButton
                maxWidth="max-w-[330px] sm:max-w-[1128px]"
                panelClassName={REGIONAL_MODAL_PANEL_CLASS}
                bodyClassName={REGIONAL_MODAL_BODY_CLASS}
                confirmSubmitMessage={
                    isEditMode
                        ? "Are you sure you want to edit this regional administrator?"
                        : ""
                }
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="pr-8">
                        <h2
                            id="base-modal-title"
                            className={REGIONAL_MODAL_TITLE_CLASS}
                        >
                            {modalTitle}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <FieldLabel htmlFor={`${formId}-candidate`}>
                                Regional Admin
                            </FieldLabel>

                            <SelectField
                                id={`${formId}-candidate`}
                                value={form.candidateId}
                                onChange={handleCandidateChange}
                                hasError={Boolean(errors.candidateId)}
                                describedBy={
                                    errors.candidateId
                                        ? `${formId}-candidate-error`
                                        : undefined
                                }
                            >
                                <option value="">Select regional admin</option>

                                {REGIONAL_ADMIN_CANDIDATES.map((candidate) => {
                                    const isUnavailable = unavailableIds.has(
                                        String(candidate.mslId),
                                    );

                                    return (
                                        <option
                                            key={candidate.id}
                                            value={candidate.id}
                                            disabled={isUnavailable}
                                        >
                                            {candidate.fullName}
                                            {isUnavailable
                                                ? " — Already assigned"
                                                : ""}
                                        </option>
                                    );
                                })}
                            </SelectField>

                            {errors.candidateId ? (
                                <p
                                    id={`${formId}-candidate-error`}
                                    role="alert"
                                    className="mt-2 text-xs text-red-400"
                                >
                                    {errors.candidateId}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <FieldLabel htmlFor={`${formId}-username`}>
                                Username
                            </FieldLabel>

                            <input
                                id={`${formId}-username`}
                                type="text"
                                value={form.username}
                                readOnly
                                aria-readonly="true"
                                placeholder="Username will appear here"
                                className={REGIONAL_MODAL_READONLY_CLASS}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor={`${formId}-msl-id`}>
                                MSL ID
                            </FieldLabel>

                            <input
                                id={`${formId}-msl-id`}
                                type="text"
                                value={form.mslId}
                                readOnly
                                aria-readonly="true"
                                placeholder="MSL ID will appear here"
                                className={REGIONAL_MODAL_READONLY_CLASS}
                            />
                        </div>

                        <div>
                            <FieldLabel htmlFor={`${formId}-original-school`}>
                                Original School
                            </FieldLabel>

                            <input
                                id={`${formId}-original-school`}
                                type="text"
                                value={form.originalSchool}
                                readOnly
                                aria-readonly="true"
                                placeholder="Original school will appear here"
                                className={REGIONAL_MODAL_READONLY_CLASS}
                            />
                        </div>
                    </div>

                    <section className="rounded-sm bg-[#151515] p-4 sm:p-5">
                        <h3 className="mb-4 text-xs font-medium text-[#EDE3C0] sm:text-sm">
                            Add New Assigned School
                        </h3>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="min-w-0 flex-1">
                                <FieldLabel htmlFor={`${formId}-school`}>
                                    School
                                </FieldLabel>

                                <SelectField
                                    id={`${formId}-school`}
                                    value={selectedSchool}
                                    onChange={handleSchoolChange}
                                    hasError={Boolean(errors.assignedSchools)}
                                    describedBy={
                                        errors.assignedSchools
                                            ? `${formId}-school-error`
                                            : undefined
                                    }
                                >
                                    <option value="">Select school</option>

                                    {REGIONAL_ADMIN_SCHOOL_OPTIONS.map(
                                        (school) => (
                                            <option key={school} value={school}>
                                                {school}
                                            </option>
                                        ),
                                    )}
                                </SelectField>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddSchoolRequest}
                                className="min-h-[42px] shrink-0 self-end rounded-[10px] bg-[#4ADE80] px-7 py-2.5 text-sm font-bold text-black outline-none transition hover:bg-[#86EFAC] focus-visible:ring-2 focus-visible:ring-[#86EFAC] sm:min-h-[52px] sm:text-base"
                            >
                                Add School
                            </button>
                        </div>

                        {errors.assignedSchools ? (
                            <p
                                id={`${formId}-school-error`}
                                role="alert"
                                className="mt-2 text-xs text-red-400"
                            >
                                {errors.assignedSchools}
                            </p>
                        ) : null}

                        <div className="mt-6">
                            <div className="grid grid-cols-[minmax(0,1fr)_80px] gap-4 border-b border-white/[0.06] pb-3 text-xs font-semibold text-[#F5F1E6] sm:text-sm">
                                <span>Assigned School</span>

                                <span className="text-right">Actions</span>
                            </div>

                            {form.assignedSchools.length === 0 ? (
                                <div className="py-6 text-center text-xs text-[#777781] sm:text-sm">
                                    No schools assigned.
                                </div>
                            ) : (
                                <ul className="divide-y divide-white/[0.06]">
                                    {form.assignedSchools.map((school) => (
                                        <li
                                            key={school}
                                            className="grid min-h-12 grid-cols-[minmax(0,1fr)_80px] items-center gap-4 py-2"
                                        >
                                            <span className="min-w-0 break-words text-xs text-[#777781] sm:text-sm">
                                                {school}
                                            </span>

                                            <div className="text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteSchoolRequest(
                                                            school,
                                                        )
                                                    }
                                                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-red-500 outline-none transition hover:bg-red-500/10 hover:text-red-400 focus-visible:ring-2 focus-visible:ring-red-500/70"
                                                    aria-label={`Delete ${school}`}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>

                    <button
                        type="submit"
                        className={REGIONAL_MODAL_PRIMARY_CLASS}
                    >
                        {isEditMode ? "Update" : "Create"}
                    </button>
                </form>
            </BaseModal>

            <RegionalAdminSchoolConfirmationModal
                isOpen={isOpen && Boolean(pendingSchoolAction)}
                action={pendingSchoolAction?.type ?? "add"}
                schoolName={pendingSchoolAction?.school ?? ""}
                onCancel={handleCancelSchoolAction}
                onConfirm={handleConfirmSchoolAction}
            />
        </>
    );
}
