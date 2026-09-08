import { MODAL_CLOSE_BUTTON_CLASS } from "@/Components/Admin/adminModalFormStyles";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function BaseModal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    maxWidth = "max-w-lg",
    hideHeader = false,
    scrollable = true,
    panelClassName = "",
    bodyClassName = "",
}) {
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

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        /*
         * Keep the scrollbar visible while preventing the page
         * behind the modal from scrolling.
         */
        documentElement.style.overflowY = "scroll";
        body.style.position = "fixed";
        body.style.top = `-${scrollPosition}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);

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
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "base-modal-title" : undefined}
        >
            <button
                type="button"
                className="absolute inset-0 cursor-default"
                aria-label="Close modal"
                onClick={onClose}
            />

            <div
                className={`relative mx-auto flex w-[95%] ${maxWidth} max-h-[90dvh] flex-col overflow-hidden rounded-xl border border-[#333] border-t-2 border-t-yellow-500 bg-[#111111] shadow-2xl ${panelClassName}`}
            >
                {!hideHeader ? (
                    <div className="shrink-0 border-b border-[#333]/60 px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-6">
                        <div className="flex items-start justify-between gap-4 pr-10 sm:pr-12">
                            <h2
                                id="base-modal-title"
                                className="text-lg font-bold text-yellow-500 sm:text-xl"
                            >
                                {title}
                            </h2>

                            <button
                                type="button"
                                onClick={onClose}
                                className={`absolute right-2 top-2 sm:right-3 sm:top-3 ${MODAL_CLOSE_BUTTON_CLASS}`}
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ) : null}

                {hideHeader ? (
                    <button
                        type="button"
                        onClick={onClose}
                        className={`absolute right-2 top-2 z-10 sm:right-3 sm:top-3 ${MODAL_CLOSE_BUTTON_CLASS}`}
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                ) : null}

                <div
                    className={`min-h-0 flex-1 px-4 py-4 sm:px-6 sm:py-5 ${
                        scrollable ? "overflow-y-auto overscroll-contain" : ""
                    } ${bodyClassName}`}
                >
                    {children}
                </div>

                {footer ? (
                    <div className="shrink-0 border-t border-[#333]/60 bg-[#111111] px-4 py-4 sm:px-6">
                        {footer}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
