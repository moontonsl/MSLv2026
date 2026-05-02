import ArticleCard from '@/Components/ArticleCard';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { newsArticles } from '@/data/newsData';
import { Calendar, ChevronLeft, Clock, Share2, User } from 'lucide-react';

const articleBodyTypography =
    '[&_p]:mb-6 [&_p]:leading-relaxed [&_p]:text-gray-300 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-gray-300 [&_li]:mb-2 [&_strong]:font-bold [&_strong]:text-white';

export default function ArticleDetail({ slug }) {
    const article = newsArticles.find((a) => a.slug === slug);

    if (!article) {
        return (
            <MainLayout>
                <Head title="Article not found" />
                <div className="min-h-[50vh] bg-[#0A0A0A] px-4 py-24 text-center text-white">
                    <p className="mb-6 text-gray-400">This article could not be found.</p>
                    <Link href="/news" className="font-bold text-[#FBBF24] hover:underline">
                        Back to News
                    </Link>
                </div>
            </MainLayout>
        );
    }

    const readNext = newsArticles.filter((a) => a.slug !== slug).slice(0, 3);

    const handleShare = async () => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        try {
            if (navigator.share) {
                await navigator.share({
                    title: article.title,
                    url,
                });
            } else if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
            }
        } catch {
            /* dismissed or unsupported */
        }
    };

    return (
        <MainLayout>
            <Head title={article.title} />

            <div className="w-full min-h-screen bg-[#0A0A0A] pb-24 font-sans text-white">
                <div className="mx-auto w-full max-w-5xl px-4 py-6 md:py-8">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-sm font-bold text-white transition-transform hover:-translate-x-1"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to News
                    </button>
                </div>

                <div className="relative mx-auto w-full max-w-6xl">
                    <div className="relative h-[240px] w-full overflow-hidden sm:h-[320px] md:h-[600px]">
                        <img
                            src={article.heroImage}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent md:block" />
                    </div>

                    <div className="relative w-full px-4 pb-6 pt-4 md:absolute md:bottom-0 md:left-0 md:max-w-4xl md:p-12">
                        <div className="mb-4 flex flex-wrap items-center gap-4">
                            <span className="rounded-md bg-[#FBBF24] px-3 py-1 text-xs font-bold text-black md:text-sm">
                                {article.category}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-300 md:text-sm">
                                <Calendar className="h-4 w-4 shrink-0" />
                                {article.date}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-300 md:text-sm">
                                <Clock className="h-4 w-4 shrink-0" />
                                {article.readTime}
                            </span>
                        </div>

                        <h1 className="mb-4 font-heading text-2xl font-black leading-tight text-white sm:text-3xl md:mb-6 md:text-5xl">
                            {article.title}
                        </h1>

                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs text-gray-400 md:hidden">
                                <User className="h-4 w-4 shrink-0 text-[#FBBF24]" />
                                <span>
                                    Written by{' '}
                                    <strong className="text-white">{article.author.role}</strong>
                                </span>
                            </div>

                            <div className="hidden min-w-0 items-center gap-3 md:flex">
                                {article.author.avatar ? (
                                    <img
                                        src={article.author.avatar}
                                        alt=""
                                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-600">
                                        <User className="h-5 w-5 text-neutral-300" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-white md:text-base">
                                        {article.author.name}
                                    </p>
                                    <p className="text-sm text-gray-400">{article.author.role}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleShare}
                                className="ml-auto shrink-0 text-[#FBBF24] transition-transform hover:scale-110 md:ml-0"
                                aria-label="Share article"
                            >
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <main className="mx-auto w-full max-w-4xl px-4 py-8 md:py-12">
                    <hr className="my-8 border-neutral-800" />

                    <div
                        className={articleBodyTypography}
                        dangerouslySetInnerHTML={{ __html: article.content.trim() }}
                    />

                    <hr className="my-8 border-neutral-800" />
                </main>

                <section className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
                    <h2 className="mb-8 font-heading text-2xl font-black text-white md:text-3xl">
                        Read Next
                    </h2>
                    <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3 lg:gap-8">
                        {readNext.map((a) => (
                            <ArticleCard key={a.slug} article={a} />
                        ))}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
