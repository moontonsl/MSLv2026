import styles from '@/Pages/ContentMedia.module.css';
import { Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function BroadcastVideoCard({ item }) {
    const [started, setStarted] = useState(false);
    const [failed, setFailed] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (started) videoRef.current?.focus({ preventScroll: true });
    }, [started]);

    return (
        <article className="overflow-hidden rounded-2xl border border-neutral-800 bg-black">
            <div className="relative aspect-video">
                {started ? (
                    <video
                        ref={videoRef}
                        src={item.video}
                        poster={item.image}
                        controls
                        autoPlay
                        playsInline
                        tabIndex={0}
                        aria-label={item.title}
                        onError={() => setFailed(true)}
                        className="h-full w-full object-contain focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-red-400"
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => setStarted(true)}
                        aria-label={`Play ${item.title}`}
                        className={`${styles.zoomFrame} absolute inset-0 block h-full w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-red-400`}
                    >
                        <img src={item.image} alt="" loading="lazy" className={`${styles.posterImage} absolute inset-0 h-full w-full object-cover object-center`} />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" aria-hidden="true" />
                        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/30 motion-reduce:transition-none lg:h-16 lg:w-16" aria-hidden="true">
                            <Play className="ml-1 h-7 w-7" fill="currentColor" strokeWidth={0} />
                        </span>
                        <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                            <span className="inline-flex items-center rounded bg-red-600 px-2 py-1 text-[10px] font-semibold uppercase leading-4 tracking-wide text-white lg:text-xs lg:leading-[18px]">
                                {item.category}
                            </span>
                            <span className={`mt-2 block text-sm font-bold leading-5 text-white sm:text-lg sm:leading-[26px] lg:text-subsection ${styles.ralewayTitle}`}>
                                {item.title}
                            </span>
                        </span>
                    </button>
                )}
            </div>
            {failed && (
                <p role="alert" className="p-4 text-sm text-red-200">
                    This video could not be played.{' '}
                    <a href={item.video} className="underline underline-offset-4">Open the video directly</a>.
                </p>
            )}
        </article>
    );
}
