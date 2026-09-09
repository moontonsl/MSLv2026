import {
    MODAL_CANCEL_CLASS,
    MODAL_CLOSE_BUTTON_CLASS,
    MODAL_CONFIRM_YES_CLASS,
} from "@/Components/Admin/adminModalFormStyles";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PANEL_CLASS =
    "relative z-10 mx-auto flex flex-col overflow-hidden rounded-xl border border-[#8A6800] bg-[#0D0D0D] shadow-[0_24px_80px_rgba(0,0,0,0.72)]";

export default function BaseModal({
    isOpen,
    onClose,
    title,
    ariaLabel,
    children,
    footer,
    maxWidth = "max-w-lg",
    hideHeader = false,
    showCloseButton = true,
    scrollable = true,
    panelClassName = "",
    bodyClassName = "",
    confirmSubmitMessage = "",
    confirmSubmitText = "Yes",
    cancelSubmitText = "Cancel",
}) {
    const titleId = useId();

    const skipNextConfirmation = useRef(false);

    const [portalTarget, setPortalTarget] = useState(null);

    const [pendingSubmission, setPendingSubmission] = useState(null);

    useEffect(() => {
        setPortalTarget(document.body);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setPendingSubmission(null);
            skipNextConfirmation.current = false;
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const scrollPosition = window.scrollY;
        const documentElement = document.documentElement;
        const body = document.body;

        const previousStyles = {
            htmlOverflowY: documentElement.style.overflowY,
            bodyPosition: body.style.position,
            bodyTop: body.style.top,
            bodyLeft: body.style.left,
            bodyRight: body.style.right,
            bodyWidth: body.style.width,
            bodyOverflow: body.style.overflow,
        };

        documentElement.style.overflowY = "scroll";
        body.style.position = "fixed";
        body.style.top = `-${scrollPosition}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";

        return () => {
            documentElement.style.overflowY = previousStyles.htmlOverflowY;

            body.style.position = previousStyles.bodyPosition;

            body.style.top = previousStyles.bodyTop;
            body.style.left = previousStyles.bodyLeft;
            body.style.right = previousStyles.bodyRight;
            body.style.width = previousStyles.bodyWidth;
            body.style.overflow = previousStyles.bodyOverflow;

            window.scrollTo({
                top: scrollPosition,
                left: 0,
                behavior: "instant",
            });
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleEscape = (event) => {
            if (event.key !== "Escape") {
                return;
            }

            if (pendingSubmission) {
                setPendingSubmission(null);
                return;
            }

            onClose();
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose, pendingSubmission]);

    if (!isOpen || !portalTarget) {
        return null;
    }

    const getConfirmationMessage = (event) => {
        if (typeof confirmSubmitMessage === "function") {
            return confirmSubmitMessage(event);
        }

        return confirmSubmitMessage;
    };

    const handleSubmitCapture = (event) => {
        if (skipNextConfirmation.current) {
            skipNextConfirmation.current = false;
            return;
        }

        const message = getConfirmationMessage(event)?.trim();

        if (!message) {
            return;
        }

        const form = event.target;

        if (!(form instanceof HTMLFormElement)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        setPendingSubmission({
            form,
            submitter: event.nativeEvent?.submitter ?? null,
            message,
        });
    };

    const handleCancelConfirmation = () => {
        setPendingSubmission(null);
    };

    const handleConfirmSubmission = () => {
        if (!pendingSubmission) {
            return;
        }

        const { form, submitter } = pendingSubmission;

        setPendingSubmission(null);
        skipNextConfirmation.current = true;

        window.requestAnimationFrame(() => {
            if (!form.isConnected) {
                skipNextConfirmation.current = false;
                return;
            }

            const validSubmitter = submitter?.isConnected
                ? submitter
                : undefined;

            form.requestSubmit(validSubmitter);
        });
    };

    const handleBackdropClick = () => {
        if (pendingSubmission) {
            handleCancelConfirmation();
            return;
        }

        onClose();
    };

    const accessibleLabel = pendingSubmission
        ? pendingSubmission.message
        : hideHeader
          ? (ariaLabel ?? title)
          : undefined;

    const modalContent = (
        <div
            className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-black/85"
            role="dialog"
            aria-modal="true"
            aria-labelledby={
                !pendingSubmission && !hideHeader && title ? titleId : undefined
            }
            aria-label={accessibleLabel}
        >
            <div className="relative flex min-h-full w-full items-center justify-center p-3 sm:p-6">
                <button
                    type="button"
                    className="fixed inset-0 cursor-default"
                    aria-label={
                        pendingSubmission
                            ? "Cancel confirmation"
                            : "Close modal"
                    }
                    onClick={handleBackdropClick}
                />

                <div
                    onSubmitCapture={handleSubmitCapture}
                    aria-hidden={pendingSubmission ? "true" : undefined}
                    className={`${PANEL_CLASS} max-h-[calc(100dvh-1.5rem)] w-[calc(100vw-1.5rem)] sm:max-h-[calc(100dvh-3rem)] sm:w-[calc(100vw-3rem)] ${maxWidth} ${
                        pendingSubmission ? "hidden" : ""
                    } ${panelClassName}`}
                >
                    {!hideHeader ? (
                        <header className="relative shrink-0 px-6 pb-3 pt-6 sm:px-8 sm:pb-4 sm:pt-8">
                            <h2
                                id={titleId}
                                className="max-w-[calc(100%-3rem)] font-heading text-lg font-bold text-[#FBBF24] sm:text-xl"
                            >
                                {title}
                            </h2>

                            {showCloseButton ? (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className={`absolute right-3 top-3 sm:right-4 sm:top-4 ${MODAL_CLOSE_BUTTON_CLASS}`}
                                    aria-label="Close modal"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            ) : null}
                        </header>
                    ) : null}

                    {hideHeader && showCloseButton ? (
                        <button
                            type="button"
                            onClick={onClose}
                            className={`absolute right-3 top-3 z-10 sm:right-4 sm:top-4 ${MODAL_CLOSE_BUTTON_CLASS}`}
                            aria-label="Close modal"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    ) : null}

                    <div
                        className={`min-h-0 flex-1 px-6 py-5 sm:px-8 sm:py-7 ${
                            scrollable
                                ? "overflow-y-auto overscroll-contain"
                                : ""
                        } ${bodyClassName}`}
                    >
                        {children}
                    </div>

                    {footer ? (
                        <footer className="shrink-0 px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
                            {footer}
                        </footer>
                    ) : null}
                </div>

                {pendingSubmission ? (
                    <div
                        className={`${PANEL_CLASS} h-[465px] max-h-[calc(100dvh-1.5rem)] w-[calc(100vw-1.5rem)] max-w-[330px] sm:max-h-[calc(100dvh-3rem)] sm:w-[calc(100vw-3rem)] sm:max-w-[526px]`}
                    >
                        <button
                            type="button"
                            onClick={handleCancelConfirmation}
                            className={`absolute right-3 top-3 z-10 sm:right-4 sm:top-4 ${MODAL_CLOSE_BUTTON_CLASS}`}
                            aria-label="Cancel confirmation"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-8 py-14 sm:px-16 sm:py-16">
                            <div className="w-full">
                                <p className="mx-auto mb-10 max-w-[400px] break-words text-left font-heading text-lg font-bold leading-[1.5] text-[#F5F1E6] sm:text-center sm:text-2xl sm:leading-[1.35]">
                                    {pendingSubmission.message}
                                </p>

                                <div className="mx-auto grid w-full max-w-[400px] grid-cols-2 gap-2.5 sm:gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCancelConfirmation}
                                        autoFocus
                                        className={MODAL_CANCEL_CLASS}
                                    >
                                        {cancelSubmitText}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleConfirmSubmission}
                                        className={MODAL_CONFIRM_YES_CLASS}
                                    >
                                        {confirmSubmitText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );

    return createPortal(modalContent, portalTarget);
}
