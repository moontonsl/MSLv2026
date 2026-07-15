export default function AdminFieldLabel({ htmlFor, children, required = false }) {
    return (
        <label htmlFor={htmlFor} className="mb-2 block text-sm text-gray-400">
            {children}
            {required ? <span className="text-red-500"> *</span> : null}
        </label>
    );
}
