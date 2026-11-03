import { Head, router } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

export default function LegalPage({ pageTitle, title, introduction, sections }) {
    const goBack = () => {
        if (window.history.length > 1) window.history.back();
        else router.visit('/');
    };

    return (
        <MainLayout fullWidth>
            <Head title={pageTitle} />
            <div className="bg-bg text-white">
                <div className="border-b border-white/20 bg-gradient-to-b from-brand-500/5 to-transparent">
                    <div className="mx-auto max-w-7xl px-5 pb-10 pt-5 sm:px-6 sm:pb-16 sm:pt-12">
                        <button type="button" onClick={goBack} className="inline-flex min-h-11 items-center gap-2 rounded-sm text-body-sm font-medium text-gray-100 transition-colors hover:text-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 motion-reduce:transition-none sm:text-body-lg">
                            <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                            Back to Previous
                        </button>
                        <div className="mt-8 text-center sm:mt-16">
                            <h1 className="text-subsection font-bold sm:text-hero-md lg:text-hero-lg">{title}</h1>
                            {introduction && <p className="mx-auto mt-3 max-w-4xl text-body-sm text-gray-100 sm:text-body-lg">{introduction}</p>}
                        </div>
                    </div>
                </div>
                <div className="mx-auto max-w-6xl space-y-16 px-5 py-12 sm:px-6 sm:py-20 lg:px-0 lg:py-24">
                    {sections.map((section) => (
                        <section key={section.heading}>
                            <h2 className="mb-8 text-heading-sm font-bold text-white sm:text-card-title">{section.heading}</h2>
                            <div className="space-y-4 sm:space-y-6">
                                {section.paragraphs.map((paragraph) => <p key={paragraph} className="break-words text-body-md text-gray-100 sm:text-body-xl">{paragraph}</p>)}
                            </div>
                            {section.items && (
                                <ul className="mt-4 space-y-4 sm:mt-6 sm:space-y-6">
                                    {section.items.map((item) => <li key={item} className="text-body-md text-gray-100 sm:text-body-xl">{item}</li>)}
                                </ul>
                            )}
                        </section>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
