import { Eye, EyeOff } from "lucide-react";

export default function PasswordToggle({ visible, onToggle }) {
    return (
        <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            onClick={onToggle}
            className="ml-3 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded text-black/20 transition-colors hover:text-black/50 focus:outline-none "
        >
            {visible ? (
                <EyeOff aria-hidden="true" className="h-[22px] w-[22px]" />
            ) : (
                <Eye aria-hidden="true" className="h-[22px] w-[22px]" />
            )}
        </button>
    );
}
