import BaseModal from "@/Components/Admin/BaseModal";
import RegionalAdminSchoolConfirmationModal from "@/Components/Admin/RegionalAdminSchoolConfirmationModal";

import { MODAL_SUBMIT_FOOTER_CLASS } from "@/Components/Admin/adminModalFormStyles";

import {
    REGIONAL_ADMIN_CANDIDATES,
    REGIONAL_ADMIN_SCHOOL_OPTIONS,
} from "@/data/adminRegionalAdminData";

import { ChevronDown, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const EMPTY_FORM = {
    candidateId: "",
    fullName: "",
    username: "",
    mslId: "",
    originalSchool: "",
    assignedSchools: [],
};

const FIELD_LABEL_CLASS = "mb-2 block text-sm font-medium text-[#F5EFD3]";

const FIELD_CONTROL_CLASS =
    "min-h-[44px] w-full rounded-md border border-[#303030] bg-[#151515] px-4 py-3 text-sm text-[#D4D4D8] outline-none transition-[border-color,box-shadow] placeholder:text-[#666A73] hover:border-[#414141] focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24] disabled:cursor-not-allowed disabled:text-[#6B7280]";

const READ_ONLY_FIELD_CLASS =
    "min-h-[44px] w-full cursor-default rounded-md border border-[#303030] bg-[#151515] px-4 py-3 text-sm text-[#9CA3AF] outline-none placeholder:text-[#666A73] focus:border-[#303030] focus:ring-0";

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

function SelectControl({ children, className = "", style, ...props }) {
    return (
        <div className="relative">
            <select
                {...props}
                className={`${FIELD_CONTROL_CLASS} appearance-none pr-11 ${className}`}
                style={{
                    ...style,
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    backgroundImage: "none",
                }}
            >
                {children}
            </select>

            <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#858A94]"
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
    const isEditMode = Boolean(regionalAdmin);

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
                title={
                    isEditMode ? "Edit Regional Admin" : "Add Regional Admin"
                }
                maxWidth="max-w-6xl"
                panelClassName="border-[#FBBF24]/60 border-t-[#FBBF24]"
                bodyClassName="sm:px-8 sm:py-7"
                footer={
                    <button
                        type="submit"
                        form="regional-admin-form"
                        className={MODAL_SUBMIT_FOOTER_CLASS}
                    >
                        {isEditMode ? "Update" : "Create"}
                    </button>
                }
            >
                <form
                    id="regional-admin-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-6">
                        <div>
                            <label
                                htmlFor="regional-admin-candidate"
                                className={FIELD_LABEL_CLASS}
                            >
                                Regional Admin
                            </label>

                            <SelectControl
                                id="regional-admin-candidate"
                                value={form.candidateId}
                                onChange={handleCandidateChange}
                                aria-invalid={Boolean(errors.candidateId)}
                                aria-describedby={
                                    errors.candidateId
                                        ? "regional-admin-candidate-error"
                                        : undefined
                                }
                                className={
                                    errors.candidateId
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : ""
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
                            </SelectControl>

                            {errors.candidateId ? (
                                <p
                                    id="regional-admin-candidate-error"
                                    className="mt-2 text-xs text-red-400"
                                >
                                    {errors.candidateId}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="regional-admin-username"
                                className={FIELD_LABEL_CLASS}
                            >
                                Username
                            </label>

                            <input
                                id="regional-admin-username"
                                type="text"
                                value={form.username}
                                readOnly
                                aria-readonly="true"
                                placeholder="Username will appear here"
                                className={READ_ONLY_FIELD_CLASS}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="regional-admin-msl-id"
                                className={FIELD_LABEL_CLASS}
                            >
                                MSL ID
                            </label>

                            <input
                                id="regional-admin-msl-id"
                                type="text"
                                value={form.mslId}
                                readOnly
                                aria-readonly="true"
                                placeholder="MSL ID will appear here"
                                className={READ_ONLY_FIELD_CLASS}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="regional-admin-original-school"
                                className={FIELD_LABEL_CLASS}
                            >
                                Original School
                            </label>

                            <input
                                id="regional-admin-original-school"
                                type="text"
                                value={form.originalSchool}
                                readOnly
                                aria-readonly="true"
                                placeholder="Original school will appear here"
                                className={READ_ONLY_FIELD_CLASS}
                            />
                        </div>
                    </div>

                    <section className="rounded-md border border-[#242424] bg-[#171717] p-4 sm:p-5">
                        <h3 className="mb-4 text-base font-medium text-[#F5EFD3] sm:text-lg">
                            Add New Assigned School
                        </h3>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="min-w-0 flex-1">
                                <label
                                    htmlFor="regional-admin-school"
                                    className="sr-only"
                                >
                                    Assigned school
                                </label>

                                <SelectControl
                                    id="regional-admin-school"
                                    value={selectedSchool}
                                    onChange={handleSchoolChange}
                                    aria-invalid={Boolean(
                                        errors.assignedSchools,
                                    )}
                                    aria-describedby={
                                        errors.assignedSchools
                                            ? "assigned-school-error"
                                            : undefined
                                    }
                                    className={
                                        errors.assignedSchools
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                            : ""
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
                                </SelectControl>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddSchoolRequest}
                                className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-md border border-[#4ADE80] bg-[#4ADE80] px-7 text-sm font-bold text-black outline-none transition hover:border-[#86EFAC] hover:bg-[#86EFAC] focus:ring-2 focus:ring-[#4ADE80] focus:ring-offset-2 focus:ring-offset-[#171717] active:scale-[0.98]"
                            >
                                Add School
                            </button>
                        </div>

                        {errors.assignedSchools ? (
                            <p
                                id="assigned-school-error"
                                className="mt-2 text-xs text-red-400"
                            >
                                {errors.assignedSchools}
                            </p>
                        ) : null}

                        <div className="mt-6">
                            <div className="mb-3 grid grid-cols-[minmax(0,1fr)_80px] gap-4 text-sm font-bold text-[#F5EFD3]">
                                <span>Assigned School</span>

                                <span className="text-right">Actions</span>
                            </div>

                            {form.assignedSchools.length === 0 ? (
                                <div className="border-t border-[#303030] py-6 text-center text-sm text-[#858A94]">
                                    No schools assigned.
                                </div>
                            ) : (
                                <ul className="divide-y divide-[#303030] border-t border-[#303030]">
                                    {form.assignedSchools.map((school) => (
                                        <li
                                            key={school}
                                            className="grid min-h-12 grid-cols-[minmax(0,1fr)_80px] items-center gap-4 py-2"
                                        >
                                            <span className="min-w-0 break-words text-sm text-[#A7ABB4]">
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
                                                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-red-500 outline-none transition hover:bg-red-500/10 hover:text-red-400 focus:ring-2 focus:ring-red-500/70"
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
