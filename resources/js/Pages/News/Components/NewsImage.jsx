import { useState } from "react";

export default function NewsImage({ src, className = "", eager = false }) {
    const [failedSource, setFailedSource] = useState(null);

    if (!src || failedSource === src) return null;

    return (
        <img
            src={src}
            alt=""
            loading={eager ? "eager" : "lazy"}
            className={className}
            onError={() => setFailedSource(src)}
        />
    );
}
