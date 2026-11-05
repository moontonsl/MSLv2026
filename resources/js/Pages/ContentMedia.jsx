import {
    BROADCAST_ITEMS,
    CAPTION_POST,
    EDITORIAL_ITEMS,
    FUNCTIONAL_DIVISIONS,
    PRODUCTION_STREAMERS,
    VISUAL_ARTS_GRID,
} from '@/data/contentsSocialMediaData';
import MainLayout from '@/Layouts/MainLayout';
import DepartmentBadge from '@/Components/DepartmentBadge';
import BroadcastVideoCard from '@/Components/BroadcastVideoCard';
import EditorialList from '@/Components/EditorialList';
import FunctionalDivisions from '@/Components/FunctionalDivisions';
import Leadership from '@/Components/Leadership';
import { LEADERSHIP_PROFILES } from '@/data/leadershipData';
import { comingSoonHref } from '@/data/siteNavigation';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import styles from './ContentMedia.module.css';
import {
    ArrowRight,
    Globe,
    Heart,
    MessageCircle,
    MessageSquare,
    Mic,
    Palette,
    PenTool,
    Play,
    Share2,
    Video,
    X,
} from 'lucide-react';

export default function ContentMedia() {
    const heroDesign = VISUAL_ARTS_GRID[0];
    const heroBroadcast = BROADCAST_ITEMS.find((item) => item.video);
    const [selectedPoster, setSelectedPoster] = useState(null);
    const [captionExpanded, setCaptionExpanded] = useState(true);
    const posterDialog = useRef(null);

    useEffect(() => {
        if (!selectedPoster) return;
        if (!posterDialog.current.open) posterDialog.current.showModal();
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previousOverflow; };
    }, [selectedPoster]);

    const openPoster = (poster) => {
        setSelectedPoster(poster);
    };

    return (
        <MainLayout fullWidth>
            <Head title="Contents & Social Media">
                <link
                    head-key="csmd-raleway"
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap"
                />
            </Head>

            <div className={`${styles.typography} ${styles.interactionScope} min-h-screen overflow-hidden bg-[#0A0A0A] px-4 pt-8 font-sans text-white sm:px-6 lg:px-8 lg:pt-20`}>
                <div className="mx-auto max-w-7xl space-y-16 lg:space-y-24">
                    <section className={`${styles.heroSection} flex flex-col items-center justify-between gap-12 lg:flex-row`}>
                        <div className="flex w-full flex-col items-center text-center lg:w-3/5 lg:max-w-3xl lg:shrink-0 lg:items-start lg:text-left">
                            <DepartmentBadge icon={PenTool} className={`mb-6 ${styles.departmentBadge}`}>
                                Content & Social Media Department
                            </DepartmentBadge>
                            <h1 className={`mb-6 font-extrabold ${styles.heroTitle}`}>
                                <span className="block whitespace-nowrap">
                                    We <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">WRITE</span>,{" "}
                                    We <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">CREATE</span>,
                                </span>{" "}
                                <span className="block">
                                    We <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">DELIVER</span>
                                </span>
                            </h1>
                            <p className={`mb-6 max-w-xl text-gray-300 lg:mb-8 ${styles.heroDescription}`}>
                                We at CSMD are the WRITE people for VISUALovable contents! From
                                elating write-ups, graphics, and livestreams, we always deliver!
                                We don&apos;t just strive for perfection—we create consistent,
                                competent, and potent materials that bring collegiate esports
                                to a higher level.
                            </p>
                            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                <a
                                    href="#our-output"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#D946EF] px-8 py-3.5 text-sm font-semibold leading-[22px] text-white transition-opacity hover:opacity-90 sm:w-auto lg:py-4 lg:text-base lg:leading-[26px]"
                                >
                                    View Our Works
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                                <Link
                                    href={comingSoonHref('membership')}
                                    className="flex w-full items-center justify-center rounded-xl bg-[#1F162A] px-8 py-3.5 text-sm font-semibold leading-[22px] text-gray-300 transition-colors hover:bg-[#2D1F3D] sm:w-auto lg:py-4 lg:text-base lg:leading-[26px]"
                                >
                                    Join Our Team
                                </Link>
                            </div>
                        </div>

                        <div className={styles.heroArtwork} role="group" aria-label="Featured creative work">
                            {heroDesign && (
                                <button
                                    type="button"
                                    onClick={() => openPoster(heroDesign)}
                                    aria-label={`View ${heroDesign.title} full size`}
                                    aria-haspopup="dialog"
                                    className={`${styles.heroArtCard} ${styles.heroDesignCard} ${styles.poster} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-400`}
                                >
                                    <img src={heroDesign.src} alt="" className={`${styles.heroArtImage} ${styles.posterImage}`} />
                                    <span className={styles.heroArtShade} aria-hidden="true" />
                                    <span className={styles.heroCardCaption}>
                                        <span className={styles.heroCardCategory}><Palette className="h-3 w-3" aria-hidden="true" />{heroDesign.category}</span>
                                        <span className={styles.heroCardTitle}>{heroDesign.title}</span>
                                    </span>
                                </button>
                            )}
                            {heroBroadcast && (
                                <button
                                    type="button"
                                    onClick={() => openPoster({ src: heroBroadcast.image, title: heroBroadcast.title, video: heroBroadcast.video })}
                                    aria-label={`Play ${heroBroadcast.title}`}
                                    aria-haspopup="dialog"
                                    className={`${styles.heroArtCard} ${styles.heroBroadcastCard} ${styles.poster} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-400`}
                                >
                                    <img src={heroBroadcast.image} alt="" className={`${styles.heroArtImage} ${styles.posterImage}`} />
                                    <span className={styles.heroArtShade} aria-hidden="true" />
                                    <span className={styles.heroCardPlay} aria-hidden="true"><Play className="h-9 w-9" fill="currentColor" strokeWidth={0} /></span>
                                    <span className={styles.heroCardCaption}>
                                        <span className={styles.heroCardCategory}><Video className="h-3 w-3" aria-hidden="true" />{heroBroadcast.category}</span>
                                        <span className={styles.heroCardTitle}>{heroBroadcast.title}</span>
                                    </span>
                                </button>
                            )}
                        </div>
                    </section>

                    <section id="our-output" className="scroll-mt-28">
                        <div className="mb-12 text-center">
                            <h2 className={styles.sectionTitle}>Our Output</h2>
                            <p className={`mx-auto mt-3 max-w-2xl text-gray-400 ${styles.sectionDescription}`}>
                                Explore the diverse portfolio produced by our student-led
                                creative teams.
                            </p>
                        </div>

                        <div className="mb-8 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-900/50 lg:h-14 lg:w-14">
                                <Palette className="h-5 w-5 text-purple-400 lg:h-7 lg:w-7" />
                            </div>
                            <h3 className={`text-white ${styles.subsectionTitle}`}>Visual Arts & Assets</h3>
                        </div>
                        <div className="mb-16 grid grid-cols-2 gap-3 md:grid-cols-4 md:auto-rows-[240px] md:gap-4">
                            {VISUAL_ARTS_GRID.map((item, index) => (
                                <figure
                                    key={item.src}
                                    className={`${styles.poster} relative min-w-0 overflow-hidden rounded-xl border border-neutral-800 bg-[#111111] ${index === 0 ? 'col-span-2 aspect-[16/7] md:row-span-2 md:aspect-auto' : 'aspect-square md:aspect-auto'}`}
                                >
                                    <img
                                        src={item.src}
                                        alt={item.title}
                                        loading="lazy"
                                        className={`${styles.posterImage} absolute inset-0 h-full w-full object-cover object-center`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" aria-hidden="true" />
                                    <button
                                        type="button"
                                        onClick={() => openPoster(item)}
                                        aria-label={`View ${item.title} full size`}
                                        className="absolute inset-0 z-10 cursor-zoom-in rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-purple-400"
                                    />
                                    <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                                        <p className="mb-1 text-[10px] font-bold uppercase leading-4 tracking-wide text-purple-400 lg:text-xs">
                                            {item.category}
                                        </p>
                                        <h4 className={`text-sm font-bold leading-5 text-white sm:text-xl sm:leading-7 lg:text-2xl lg:leading-8 ${styles.ralewayTitle}`}>
                                            {item.title}
                                        </h4>
                                    </figcaption>
                                </figure>
                            ))}
                        </div>

                        <div className="mb-8 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-950/80 lg:h-14 lg:w-14">
                                <Video className="h-5 w-5 text-red-400 lg:h-7 lg:w-7" />
                            </div>
                            <h3 className={`text-white ${styles.subsectionTitle}`}>Broadcast & Motion</h3>
                        </div>
                        <div className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                            {BROADCAST_ITEMS.map((item) => item.video ? (
                                <BroadcastVideoCard key={item.id} item={item} />
                            ) : (
                                <figure key={item.id} className={`${styles.poster} relative aspect-video overflow-hidden rounded-2xl border border-neutral-800 bg-black`}>
                                    <img src={item.image} alt={item.title} loading="lazy" className={`${styles.posterImage} absolute inset-0 h-full w-full object-cover object-center`} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" aria-hidden="true" />
                                    <button
                                        type="button"
                                        onClick={() => openPoster({ ...item, src: item.image })}
                                        aria-label={`View ${item.title} full size`}
                                        className="absolute inset-0 z-10 cursor-zoom-in rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-red-400"
                                    />
                                    <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                                        <span className="inline-flex items-center rounded bg-red-600 px-2 py-1 text-[10px] font-semibold uppercase leading-4 tracking-wide text-white lg:text-xs lg:leading-[18px]">{item.category}</span>
                                        <h4 className={`mt-2 text-sm font-bold leading-5 text-white sm:text-lg sm:leading-[26px] lg:text-subsection ${styles.ralewayTitle}`}>{item.title}</h4>
                                    </figcaption>
                                </figure>
                            ))}
                        </div>

                        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
                            <div className="lg:col-span-6">
                                <EditorialList items={EDITORIAL_ITEMS} />
                            </div>

                            <div className="lg:col-span-6">
                                <div className="mb-8 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 lg:h-14 lg:w-14">
                                        <MessageSquare className="h-5 w-5 text-blue-400 lg:h-7 lg:w-7" />
                                    </div>
                                    <h3 className={`text-white ${styles.subsectionTitle}`}>
                                        Caption Writing
                                    </h3>
                                </div>
                                <article className="rounded-2xl border border-neutral-800 bg-[#1e1e1e] p-4 sm:p-5">
                                    <div className="mb-4 flex items-center gap-3">
                                        <img src={CAPTION_POST.avatar || '/MSL_LOGO.png'} alt="" width="40" height="40" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                                        <div>
                                            <p className="text-[15px] font-bold leading-[22px] text-white">
                                                {CAPTION_POST.author}
                                            </p>
                                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                                                Public <Globe className="h-3 w-3" aria-hidden="true" />
                                            </p>
                                        </div>
                                    </div>
                                    <h4 className="mb-2 text-[14.5px] font-normal leading-6 text-gray-200">
                                        <a href="https://www.facebook.com/hashtag/mplbattletrips" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:underline">{CAPTION_POST.leadingHashtag}</a>{' '}
                                        {CAPTION_POST.heading}
                                    </h4>
                                    <div id="caption-post-text" className="space-y-2 text-sm leading-5 text-gray-200">
                                        {CAPTION_POST.body.slice(0, captionExpanded ? CAPTION_POST.body.length : 1).map((paragraph) => (
                                            <p key={paragraph} className={`text-[14.5px] leading-6 ${captionExpanded ? '' : 'line-clamp-3'}`}>{paragraph}</p>
                                        ))}
                                        {captionExpanded && (
                                            <p className="flex flex-col items-start text-[14.5px] font-medium leading-[18px] text-blue-400">
                                                {CAPTION_POST.hashtags.map((hashtag) => (
                                                    <a key={hashtag} href={`https://www.facebook.com/hashtag/${hashtag.slice(1).toLowerCase()}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{hashtag}</a>
                                                ))}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        aria-expanded={captionExpanded}
                                        aria-controls="caption-post-text"
                                        onClick={() => setCaptionExpanded((expanded) => !expanded)}
                                        className={`mb-3 inline-flex min-h-11 items-center text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 ${captionExpanded ? 'text-blue-400 hover:text-blue-300' : 'text-gray-300 hover:text-white'}`}
                                    >
                                        {captionExpanded ? 'See less' : 'See more'}
                                    </button>
                                    {CAPTION_POST.image && <button type="button" aria-label="View Battle Trips collage full size" onClick={() => openPoster({ src: CAPTION_POST.image, title: CAPTION_POST.heading })} className={`${styles.zoomFrame} mb-4 block aspect-video w-full cursor-zoom-in overflow-hidden rounded-xl bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400`}>
                                        <img
                                            src={CAPTION_POST.image}
                                            alt="Student gamers featured across eight weeks of Smart MPL Battle Trips"
                                            width="960"
                                            height="960"
                                            loading="lazy"
                                            className={`${styles.posterImage} h-full w-full object-contain`}
                                        />
                                    </button>}
                                    <div className="flex items-center gap-6 border-t border-neutral-800 pt-4 text-sm font-medium leading-5 text-gray-500">
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 transition-colors hover:text-gray-300"
                                        >
                                            <Heart className="h-4 w-4" />
                                            Like
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 transition-colors hover:text-gray-300"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            Comment
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 transition-colors hover:text-gray-300"
                                        >
                                            <Share2 className="h-4 w-4" />
                                            Share
                                        </button>
                                    </div>
                                </article>
                            </div>
                        </div>

                        <div className="mb-8 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-500/20 bg-green-500/10 lg:h-14 lg:w-14"><Mic className="h-5 w-5 text-green-400 lg:h-7 lg:w-7" /></span>
                            <h3 className={`text-white ${styles.subsectionTitle}`}>On-Air Talent</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
                            {PRODUCTION_STREAMERS.map((streamer) => (
                                <article
                                    key={streamer.name}
                                    className={`${styles.poster} ${styles.talentCard} overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111]`}
                                >
                                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-800">
                                        <img
                                            src={streamer.image}
                                            alt={streamer.name}
                                            loading="lazy"
                                            className={`${styles.posterImage} ${styles.talentImage} h-full w-full object-cover object-top`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => openPoster({ src: streamer.image, title: streamer.name })}
                                            aria-label={`View ${streamer.name} full size`}
                                            className="absolute inset-0 z-10 cursor-zoom-in rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-teal-300"
                                        />
                                        <div className="absolute bottom-0 z-[2] w-full bg-gradient-to-t from-black via-black/70 to-transparent p-3 sm:p-4">
                                            <h3 className="mb-1 font-inter text-xs font-bold leading-[18px] text-white sm:text-sm lg:text-lg lg:leading-7">{streamer.name}</h3>
                                            <p className="text-[10px] font-semibold uppercase leading-4 tracking-wide text-teal-300 lg:text-xs lg:leading-[18px]">
                                                <span className="block">Streamer</span>
                                                <span className="mt-1 block text-xs font-normal normal-case text-gray-200">{streamer.started}</span>
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <FunctionalDivisions divisions={FUNCTIONAL_DIVISIONS} />

                    <Leadership profiles={LEADERSHIP_PROFILES} />

                    <section className={`text-center ${styles.closingSection}`}>
                        <h2 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl">
                            Have a Story to Tell?
                        </h2>
                        <p className="mx-auto mb-6 max-w-xl text-sm leading-[22px] text-gray-300">
                            Whether you are a graphic designer, a writer, a streamer, or a
                            community manager, there is a place for you in our creative team.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href={comingSoonHref('membership')}
                                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-purple-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-300 sm:w-auto"
                            >
                                Be a Member of Our Team
                            </Link>
                            <Link
                                href={comingSoonHref('msl')}
                                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-neutral-800 bg-[#1A1A1A] px-6 py-3 text-sm font-semibold text-gray-200 transition-colors hover:bg-[#222222] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-300 sm:w-auto"
                            >
                                Submit a Portfolio
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
            <dialog
                ref={posterDialog}
                onClose={() => setSelectedPoster(null)}
                onClick={(event) => {
                    if (event.target === event.currentTarget) posterDialog.current.close();
                }}
                aria-labelledby="poster-preview-title"
                className={`${styles.interactionScope} fixed inset-0 m-auto h-fit max-h-none w-fit max-w-none overflow-visible border-0 bg-transparent p-0 text-white backdrop:bg-black/90`}
            >
                {selectedPoster && (
                    <>
                        <h2 id="poster-preview-title" className="sr-only">{selectedPoster.title}</h2>
                        <button
                            type="button"
                            onClick={() => posterDialog.current.close()}
                            aria-label="Close media preview"
                            className="fixed right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-400"
                        >
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {selectedPoster.video ? (
                            <video
                                src={selectedPoster.video}
                                poster={selectedPoster.src}
                                aria-label={selectedPoster.title}
                                controls
                                autoPlay
                                playsInline
                                className="block h-[90dvh] w-[92vw] object-contain"
                            />
                        ) : (
                            <img src={selectedPoster.src} alt={selectedPoster.title} className="block h-[90dvh] w-[92vw] object-contain" />
                        )}
                    </>
                )}
            </dialog>
        </MainLayout>
    );
}
