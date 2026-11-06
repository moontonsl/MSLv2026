import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './UnavailablePage.module.css';

export default function UnavailablePage({ pageTitle, description, notFound = false }) {
    const NavigationAction = notFound ? Link : 'button';
    const NavigationIcon = notFound ? ChevronRight : ChevronLeft;
    const navigationProps = notFound
        ? { href: '/' }
        : {
            type: 'button',
            onClick: () => {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    router.visit('/');
                }
            },
        };

    return (
        <>
            <Head title={pageTitle} />
            <main className="flex min-h-screen items-center bg-bg px-4 py-16 text-center text-white sm:px-6">
                <section className="mx-auto w-full max-w-4xl" aria-labelledby="unavailable-title">
                    {notFound ? (
                        <>
                            <div className={`${styles.errorCode} font-heading font-extrabold text-brand-600`} aria-hidden="true">
                                <span>4</span>
                                <img src="/crying-diggie.png" alt="" width="359" height="234" className={styles.errorIcon} />
                                <span>4</span>
                            </div>
                            <h1 id="unavailable-title" className="mt-6 text-subsection font-bold sm:mt-8 sm:text-section">
                                <span className="sr-only">404: </span>Oops...Page Not Found!
                            </h1>
                        </>
                    ) : (
                        <h1 id="unavailable-title" aria-label="Coming Soon" className={`${styles.comingCode} font-heading font-extrabold text-brand-600`}>
                            <span className={styles.comingWord} aria-hidden="true">
                                C<img src="/crying-diggie.png" alt="" width="359" height="234" className={styles.comingIcon} />ming
                            </span>
                            <span aria-hidden="true">Soon</span>
                        </h1>
                    )}
                    <p className="mx-auto mt-6 max-w-3xl text-body-md font-semibold text-gray-100 sm:text-body-xl">{description}</p>
                    <NavigationAction {...navigationProps} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-sm py-2 text-body-md font-semibold text-brand-500 transition-colors duration-150 hover:text-brand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 motion-reduce:transition-none sm:mt-8 sm:text-body-lg">
                        {!notFound && <NavigationIcon className="h-5 w-5 shrink-0" aria-hidden="true" />}
                        {notFound ? 'Go back to Homepage' : 'Back to Previous'}
                        {notFound && <NavigationIcon className="h-5 w-5 shrink-0" aria-hidden="true" />}
                    </NavigationAction>
                </section>
            </main>
        </>
    );
}
