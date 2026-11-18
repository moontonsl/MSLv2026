import CommunityVoiceModal from '@/Components/Admin/CommunityVoiceModal';
import DeleteConfirmationModal from '@/Components/Admin/DeleteConfirmationModal';
import SuccessModal from '@/Components/Admin/SuccessModal';
import AdminFieldLabel from '@/Components/Admin/AdminFieldLabel';
import ContentCard from '@/Components/Admin/ContentCard';
import ImageDropzone from '@/Components/Admin/ImageDropzone';
import SectionCard from '@/Components/Admin/SectionCard';
import {
    ADMIN_GOLD_BUTTON_CLASS,
    ADMIN_INPUT_CLASS,
    ADMIN_TEXTAREA_CLASS,
} from '@/Components/Admin/adminFormStyles';
import { SCHOOL_OPTIONS } from '@/data/adminHomeData';
import { router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Eye,
    EyeOff,
    MessageSquareQuote,
    Plus,
    Quote,
    RotateCcw,
    X,
} from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

const EMPTY_INLINE_FORM = {
    fullName: '',
    position: '',
    school: '',
    message: '',
    image: null,
};

export default function CommunityVoiceSection({
    voices: initialVoices = [],
    schools = [],
    sectionVisible = true,
}) {
    const { props: pageProps } = usePage();
    const flashError = pageProps?.flash?.error ?? '';
    const pageErrors = pageProps?.errors ?? {};

    const schoolDatalistId = useId();
    const inlineFileInputRef = useRef(null);

    const [items, setItems] = useState(initialVoices);
    const [isSectionVisible, setIsSectionVisible] = useState(Boolean(sectionVisible));
    const [togglingVisibility, setTogglingVisibility] = useState(false);

    const [inlineForm, setInlineForm] = useState(EMPTY_INLINE_FORM);
    const [inlinePreviewUrl, setInlinePreviewUrl] = useState(null);
    const [inlineSubmitting, setInlineSubmitting] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalSubmitting, setModalSubmitting] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        setItems(initialVoices);
    }, [initialVoices]);

    useEffect(() => {
        setIsSectionVisible(Boolean(sectionVisible));
    }, [sectionVisible]);

    useEffect(() => {
        if (flashError) {
            setAlertMessage(flashError);
        }
    }, [flashError]);

    useEffect(() => {
        if (!(inlineForm.image instanceof File)) {
            setInlinePreviewUrl(null);
            return undefined;
        }
        const url = URL.createObjectURL(inlineForm.image);
        setInlinePreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [inlineForm.image]);

    const schoolSuggestions = useMemo(() => {
        const merged = [
            ...(Array.isArray(schools) ? schools : []),
            ...SCHOOL_OPTIONS,
        ];
        return Array.from(
            new Set(
                merged
                    .map((item) => (typeof item === 'string' ? item.trim() : ''))
                    .filter(Boolean),
            ),
        );
    }, [schools]);

    const validationErrorMessages = useMemo(
        () => Object.values(pageErrors || {}).filter(Boolean),
        [pageErrors],
    );

    const hasInlineInput = Boolean(
        inlineForm.fullName.trim() ||
            inlineForm.position.trim() ||
            inlineForm.school.trim() ||
            inlineForm.message.trim() ||
            inlineForm.image,
    );

    const resetInlineForm = () => {
        setInlineForm(EMPTY_INLINE_FORM);
        if (inlineFileInputRef.current) {
            inlineFileInputRef.current.value = '';
        }
    };

    const handleToggleSectionVisibility = () => {
        if (togglingVisibility) return;
        const nextVisible = !isSectionVisible;
        setIsSectionVisible(nextVisible);
        setTogglingVisibility(true);
        setAlertMessage('');

        router.post(
            route('admin.home-page.community-voice.visibility'),
            { visible: nextVisible },
            {
                preserveScroll: true,
                onFinish: () => setTogglingVisibility(false),
                onError: (errs) => {
                    setIsSectionVisible(!nextVisible);
                    const firstErr = Object.values(errs || {})[0];
                    if (firstErr) setAlertMessage(String(firstErr));
                },
            },
        );
    };

    const handleInlineFileSelect = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        setInlineForm((prev) => ({ ...prev, image: file }));
    };

    const handleInlineDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer?.files?.[0];
        handleInlineFileSelect(file);
    };

    const openAddModal = () => {
        setAlertMessage('');
        setEditingItem(null);
        setModalOpen(true);
    };

    const handleAddNewClick = () => {
        setAlertMessage('');

        // If all inline fields are empty, open CommunityVoiceModal to add
        if (!hasInlineInput) {
            openAddModal();
            return;
        }

        const missingFields = [];
        if (!inlineForm.fullName.trim()) missingFields.push('Fullname');
        if (!inlineForm.position.trim()) missingFields.push('Position');
        if (!inlineForm.school.trim()) missingFields.push('School');
        if (!inlineForm.message.trim()) missingFields.push('Message');

        if (missingFields.length > 0) {
            setAlertMessage(
                `Please complete the required inline fields (${missingFields.join(', ')}) before submitting, or clear the fields to open the modal.`,
            );
            return;
        }

        const formData = new FormData();
        formData.append('name', inlineForm.fullName.trim());
        formData.append('role', inlineForm.position.trim());
        formData.append('school', inlineForm.school.trim());
        formData.append('quote', inlineForm.message.trim());
        formData.append('is_active', '1');
        if (inlineForm.image instanceof File) {
            formData.append('image', inlineForm.image);
        }

        setInlineSubmitting(true);
        router.post(route('admin.home-page.community-voice.store'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => setInlineSubmitting(false),
            onSuccess: () => {
                resetInlineForm();
                setSuccessMessage('Community story added successfully!');
                setSuccessOpen(true);
            },
            onError: (errs) => {
                const firstErr = Object.values(errs || {})[0];
                if (firstErr) setAlertMessage(String(firstErr));
            },
        });
    };

    const openEditModal = (item) => {
        setAlertMessage('');
        setEditingItem({
            id: item.id,
            name: item.name ?? '',
            role: item.role ?? '',
            school: item.school ?? '',
            quote: item.quote ?? '',
            is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
            image_url: item.image_url ?? null,
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        if (modalSubmitting) return;
        setModalOpen(false);
        setEditingItem(null);
    };

    const handleModalSubmit = (values) => {
        setAlertMessage('');
        setModalSubmitting(true);

        const formData = new FormData();
        formData.append('name', values.fullName);
        formData.append('role', values.position);
        formData.append('school', values.school);
        formData.append('quote', values.message);
        formData.append('is_active', values.is_active ? '1' : '0');

        if (values.featuredImage instanceof File) {
            formData.append('image', values.featuredImage);
        }

        const wasEditing = editingItem != null;
        const targetRoute = wasEditing
            ? route('admin.home-page.community-voice.update', editingItem.id)
            : route('admin.home-page.community-voice.store');

        router.post(targetRoute, formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => setModalSubmitting(false),
            onSuccess: () => {
                setModalOpen(false);
                setEditingItem(null);
                setSuccessMessage(
                    wasEditing
                        ? 'Community story updated successfully!'
                        : 'Community story added successfully!',
                );
                setSuccessOpen(true);
            },
            onError: (errs) => {
                const firstErr = Object.values(errs || {})[0];
                if (firstErr) setAlertMessage(String(firstErr));
            },
        });
    };

    const requestDelete = (id) => {
        setAlertMessage('');
        setPendingDeleteId(id);
        setDeleteOpen(true);
    };

    const cancelDelete = () => {
        setDeleteOpen(false);
        setPendingDeleteId(null);
    };

    const confirmDelete = () => {
        if (pendingDeleteId == null) return;
        router.delete(
            route('admin.home-page.community-voice.delete', pendingDeleteId),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteOpen(false);
                    setPendingDeleteId(null);
                    setSuccessMessage('Community story deleted successfully!');
                    setSuccessOpen(true);
                },
                onError: (errs) => {
                    setDeleteOpen(false);
                    setPendingDeleteId(null);
                    const firstErr = Object.values(errs || {})[0];
                    if (firstErr) setAlertMessage(String(firstErr));
                },
            },
        );
    };

    const visibilityToggleHeader = (
        <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-[#161616] px-4 py-2.5 sm:w-auto sm:justify-end">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-200">
                {isSectionVisible ? (
                    <Eye className="h-4 w-4 shrink-0 text-[#FBBF24]" aria-hidden="true" />
                ) : (
                    <EyeOff className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
                )}
                <span>Show Section on Homepage</span>
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={isSectionVisible}
                aria-label="Show MSL Campus Community section on Homepage"
                disabled={togglingVisibility}
                onClick={handleToggleSectionVisibility}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] disabled:cursor-wait disabled:opacity-60 ${
                    isSectionVisible
                        ? 'border-[#FBBF24] bg-[#FBBF24]'
                        : 'border-neutral-700 bg-neutral-800'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                        isSectionVisible
                            ? 'translate-x-5 bg-black'
                            : 'translate-x-1 bg-gray-400'
                    }`}
                />
            </button>
        </div>
    );

    return (
        <>
            <SectionCard
                title="MSL Campus Community"
                description="Add student leader & gamer testimonials inline or via modal, and control whether this section appears on the Homepage."
                headerRight={visibilityToggleHeader}
            >
                <div className="space-y-6">
                    {!isSectionVisible ? (
                        <div className="flex items-center gap-2.5 rounded-lg border border-neutral-800 bg-[#161618] px-4 py-3 text-xs text-gray-300">
                            <EyeOff
                                className="h-4 w-4 shrink-0 text-neutral-400"
                                aria-hidden="true"
                            />
                            <span>
                                This section is currently <strong>hidden</strong> on the public Homepage. Toggle{' '}
                                <strong className="text-[#FBBF24]">Show Section on Homepage</strong> above whenever you are ready to display it.
                            </span>
                        </div>
                    ) : null}

                    {(alertMessage || validationErrorMessages.length > 0) && (
                        <div
                            role="alert"
                            className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
                        >
                            <div className="flex min-w-0 flex-1 items-start gap-2.5">
                                <AlertCircle
                                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                                    aria-hidden="true"
                                />
                                <div className="min-w-0 flex-1 space-y-1">
                                    {alertMessage ? <p>{alertMessage}</p> : null}
                                    {validationErrorMessages.map((msg, idx) => (
                                        <p key={idx}>{msg}</p>
                                    ))}
                                </div>
                            </div>
                            {alertMessage ? (
                                <button
                                    type="button"
                                    onClick={() => setAlertMessage('')}
                                    className="shrink-0 whitespace-nowrap text-xs font-semibold text-amber-200 underline hover:text-white cursor-pointer"
                                >
                                    Dismiss
                                </button>
                            ) : null}
                        </div>
                    )}

                    {/* Quick Inline Entry Form */}
                    <div className="rounded-xl border border-neutral-800/90 bg-[#151518] p-4 sm:p-5">
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                <div className="min-w-0">
                                    <AdminFieldLabel htmlFor="community-fullname" required>
                                        Fullname
                                    </AdminFieldLabel>
                                    <input
                                        id="community-fullname"
                                        type="text"
                                        maxLength={255}
                                        value={inlineForm.fullName}
                                        onChange={(e) =>
                                            setInlineForm((prev) => ({
                                                ...prev,
                                                fullName: e.target.value,
                                            }))
                                        }
                                        placeholder="e.g. Leslie Alexander"
                                        className={ADMIN_INPUT_CLASS}
                                    />
                                </div>
                                <div className="min-w-0">
                                    <AdminFieldLabel htmlFor="community-position" required>
                                        Position
                                    </AdminFieldLabel>
                                    <input
                                        id="community-position"
                                        type="text"
                                        maxLength={255}
                                        value={inlineForm.position}
                                        onChange={(e) =>
                                            setInlineForm((prev) => ({
                                                ...prev,
                                                position: e.target.value,
                                            }))
                                        }
                                        placeholder="e.g. Student Leader"
                                        className={ADMIN_INPUT_CLASS}
                                    />
                                </div>
                                <div className="min-w-0 sm:col-span-2 xl:col-span-1">
                                    <AdminFieldLabel htmlFor="community-school" required>
                                        School
                                    </AdminFieldLabel>
                                    <input
                                        id="community-school"
                                        type="text"
                                        maxLength={255}
                                        list={schoolDatalistId}
                                        value={inlineForm.school}
                                        onChange={(e) =>
                                            setInlineForm((prev) => ({
                                                ...prev,
                                                school: e.target.value,
                                            }))
                                        }
                                        placeholder="Type or select school..."
                                        className={ADMIN_INPUT_CLASS}
                                    />
                                    <datalist id={schoolDatalistId}>
                                        {schoolSuggestions.map((schoolName) => (
                                            <option key={schoolName} value={schoolName} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                                <div className="min-w-0 xl:col-span-2">
                                    <AdminFieldLabel htmlFor="community-message" required>
                                        Message
                                    </AdminFieldLabel>
                                    <textarea
                                        id="community-message"
                                        rows={5}
                                        maxLength={1500}
                                        value={inlineForm.message}
                                        onChange={(e) =>
                                            setInlineForm((prev) => ({
                                                ...prev,
                                                message: e.target.value,
                                            }))
                                        }
                                        placeholder="Share their story..."
                                        className={`${ADMIN_TEXTAREA_CLASS} h-36`}
                                    />
                                </div>

                                <div
                                    className="flex min-w-0 flex-col xl:col-span-1"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleInlineDrop}
                                >
                                    <AdminFieldLabel htmlFor="community-inline-image">
                                        Portrait / Photo
                                    </AdminFieldLabel>
                                    <input
                                        ref={inlineFileInputRef}
                                        id="community-inline-image"
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                                        className="hidden"
                                        onChange={(e) =>
                                            handleInlineFileSelect(e.target.files?.[0])
                                        }
                                    />

                                    {inlinePreviewUrl ? (
                                        <div className="relative flex min-h-[144px] flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-[#FBBF24]/40 bg-[#1A1A1A] p-3">
                                            <img
                                                src={inlinePreviewUrl}
                                                alt="Selected preview"
                                                className="max-h-24 rounded-lg object-contain"
                                            />
                                            <p className="mt-2 max-w-full truncate px-2 text-xs text-gray-300">
                                                {inlineForm.image?.name}
                                            </p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        inlineFileInputRef.current?.click()
                                                    }
                                                    className="text-xs font-semibold text-[#FBBF24] hover:underline cursor-pointer"
                                                >
                                                    Change
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setInlineForm((prev) => ({
                                                            ...prev,
                                                            image: null,
                                                        }));
                                                        if (inlineFileInputRef.current) {
                                                            inlineFileInputRef.current.value = '';
                                                        }
                                                    }}
                                                    className="inline-flex items-center gap-0.5 text-xs font-semibold text-red-400 hover:underline cursor-pointer"
                                                >
                                                    <X className="h-3 w-3" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <ImageDropzone
                                            className="min-h-[144px] flex-1"
                                            hint="PNG, JPG, JPEG, WEBP (Max. 5MB)"
                                            onClick={() => inlineFileInputRef.current?.click()}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                                {hasInlineInput ? (
                                    <button
                                        type="button"
                                        onClick={resetInlineForm}
                                        disabled={inlineSubmitting}
                                        className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-neutral-800 hover:text-white sm:w-auto cursor-pointer"
                                    >
                                        <RotateCcw className="h-4 w-4 shrink-0" />
                                        Clear Fields
                                    </button>
                                ) : null}

                                <button
                                    type="button"
                                    disabled={inlineSubmitting}
                                    className={`${ADMIN_GOLD_BUTTON_CLASS} w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60`}
                                    onClick={handleAddNewClick}
                                >
                                    <Plus className="h-4 w-4 shrink-0" />
                                    {inlineSubmitting
                                        ? 'Saving...'
                                        : hasInlineInput
                                          ? 'Save New Story'
                                          : 'Add New'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Community Stories Cards Grid */}
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 py-12 text-center">
                            <MessageSquareQuote
                                className="mb-3 h-10 w-10 text-neutral-600"
                                aria-hidden="true"
                            />
                            <p className="text-sm text-neutral-400">
                                No campus community testimonials added yet.
                            </p>
                            <button
                                type="button"
                                onClick={openAddModal}
                                className="mt-4 text-xs font-semibold text-[#FBBF24] hover:underline cursor-pointer"
                            >
                                + Add First Community Story
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {items.map((item) => (
                                <ContentCard
                                    key={item.id}
                                    imageSrc={item.image_url || '/profile-background.jpg'}
                                    imageAlt={item.name}
                                    imageClassName="h-56 w-full bg-neutral-950 object-cover object-top"
                                    onEdit={() => openEditModal(item)}
                                    onDelete={() => requestDelete(item.id)}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="font-bold text-white">{item.name}</p>
                                        {item.is_active === false ? (
                                            <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-neutral-400">
                                                Hidden
                                            </span>
                                        ) : null}
                                    </div>
                                    <p className="mt-1 text-sm font-medium text-[#FBBF24]">
                                        {item.role}
                                    </p>
                                    <p className="mt-0.5 text-xs font-medium text-gray-400">
                                        {item.school}
                                    </p>

                                    {item.quote ? (
                                        <div className="mt-3 rounded-lg border border-white/[0.05] bg-black/30 p-3">
                                            <div className="flex items-start gap-2">
                                                <Quote
                                                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FBBF24]/70"
                                                    aria-hidden="true"
                                                />
                                                <p
                                                    className="line-clamp-3 text-xs italic leading-5 text-gray-300"
                                                    title={item.quote}
                                                >
                                                    {item.quote}
                                                </p>
                                            </div>
                                        </div>
                                    ) : null}
                                </ContentCard>
                            ))}
                        </div>
                    )}
                </div>
            </SectionCard>

            <CommunityVoiceModal
                isOpen={modalOpen}
                onClose={closeModal}
                initialData={editingItem}
                onSubmit={handleModalSubmit}
                schools={schools}
                submitting={modalSubmitting}
            />

            <DeleteConfirmationModal
                isOpen={deleteOpen}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
            />

            <SuccessModal
                isOpen={successOpen}
                onClose={() => setSuccessOpen(false)}
                message={successMessage || 'Saved successfully!'}
            />
        </>
    );
}
