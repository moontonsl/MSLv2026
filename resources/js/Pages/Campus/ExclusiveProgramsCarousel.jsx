import { useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Check } from 'lucide-react';
import { CarouselButton } from '../Home/Components/HomeUI';
import { campusPrograms } from './campusData';
import styles from './ExclusiveProgramsCarousel.module.css';

export default function ExclusiveProgramsCarousel() {
    const trackRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const goToSlide = (index) => {
        const track = trackRef.current;
        if (!track) return;
        const next = (index + campusPrograms.length) % campusPrograms.length;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        track.scrollTo({ left: next * track.clientWidth, behavior: reduceMotion ? 'instant' : 'smooth' });
    };

    const handleKeyDown = (event) => {
        if (event.target !== event.currentTarget) return;
        const destinations = { ArrowLeft: activeIndex - 1, ArrowRight: activeIndex + 1, Home: 0, End: campusPrograms.length - 1 };
        if (destinations[event.key] === undefined) return;
        event.preventDefault();
        goToSlide(destinations[event.key]);
    };

    return (
        <div className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Exclusive campus programs">
            <div
                ref={trackRef}
                className={styles.track}
                tabIndex={0}
                aria-label="Program slides. Use the left and right arrow keys to browse."
                onKeyDown={handleKeyDown}
                onScroll={(event) => {
                    const track = event.currentTarget;
                    if (track.clientWidth) setActiveIndex(Math.max(0, Math.min(campusPrograms.length - 1, Math.round(track.scrollLeft / track.clientWidth))));
                }}
            >
                {campusPrograms.map((program, index) => {
                    const external = /^https?:\/\//i.test(program.href || '');
                    const actionContent = <>{program.action}<ArrowRight size={18} aria-hidden="true" /></>;
                    return (
                        <article
                            key={program.id}
                            id={`campus-program-${program.id}`}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${index + 1} of ${campusPrograms.length}: ${program.title}`}
                            inert={index !== activeIndex ? '' : undefined}
                            className={styles.slide}
                        >
                            <div className={styles.photo}>
                                <img src={program.image} alt={program.imageAlt} loading="lazy" draggable="false" style={{ objectPosition: program.imagePosition }} />
                            </div>
                            <div className={styles.copy}>
                                <h3>{program.title}{program.flagship && <span className={styles.flagship}>Flagship</span>}</h3>
                                <p>{program.description}</p>
                                {program.benefits && (
                                    <ul className={styles.benefits}>
                                        {program.benefits.map((benefit) => <li key={benefit}><Check size={18} aria-hidden="true" />{benefit}</li>)}
                                    </ul>
                                )}
                                {program.href && (external ? (
                                    <a href={program.href} target="_blank" rel="noopener noreferrer" className={styles.action}>{actionContent}<span className="sr-only"> (opens in a new tab)</span></a>
                                ) : <Link href={program.href} className={styles.action}>{actionContent}</Link>)}
                            </div>
                        </article>
                    );
                })}
            </div>
            <div className={styles.controls}>
                <CarouselButton direction="previous" label="Previous campus program" onClick={() => goToSlide(activeIndex - 1)} className={styles.arrow} />
                <div className={styles.indicators}>
                    {campusPrograms.map((program, index) => (
                        <button
                            key={program.id}
                            type="button"
                            className={styles.indicator}
                            aria-label={`Show ${program.title}`}
                            aria-current={index === activeIndex ? 'true' : undefined}
                            aria-controls={`campus-program-${program.id}`}
                            onClick={() => goToSlide(index)}
                        ><span /></button>
                    ))}
                </div>
                <CarouselButton direction="next" label="Next campus program" onClick={() => goToSlide(activeIndex + 1)} className={styles.arrow} />
            </div>
            <p className="sr-only" aria-live="polite" aria-atomic="true">{campusPrograms[activeIndex].title}, {activeIndex + 1} of {campusPrograms.length}</p>
        </div>
    );
}
