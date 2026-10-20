import { useMemo } from "react";
import NewsArticleCard from "./NewsArticleCard";

export default function NewsResults({
    articles,
    hasArticles,
    filterOptions,
    error,
}) {
    const mobileGroups = useMemo(() => {
        const grouped = new Map();

        articles.forEach((article) => {
            if (!grouped.has(article.category)) {
                grouped.set(article.category, []);
            }

            grouped.get(article.category).push(article);
        });

        const categoryOrder = [
            ...filterOptions
                .filter((option) => option.value !== "All")
                .map((option) => option.value),
            ...[...grouped.keys()].filter(
                (category) =>
                    !filterOptions.some((option) => option.value === category),
            ),
        ];

        return categoryOrder
            .filter((category) => grouped.has(category))
            .map((category) => ({
                value: category,
                label:
                    filterOptions.find((option) => option.value === category)
                        ?.label || category,
                articles: grouped.get(category),
            }));
    }, [articles, filterOptions]);

    if (error) {
        return (
            <p
                role="alert"
                className="py-16 text-center text-[18px] leading-[28px] text-gray-300"
            >
                {error}
            </p>
        );
    }

    if (!articles.length) {
        return (
            <p
                role="status"
                className="py-16 text-center text-[18px] leading-[28px] text-gray-400"
            >
                {hasArticles
                    ? "No articles match your search or category."
                    : "No articles have been published yet."}
            </p>
        );
    }

    return (
        <>
            <div className="mt-12 hidden gap-10 md:grid md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
                {articles.map((article) => (
                    <NewsArticleCard key={article.id} article={article} />
                ))}
            </div>

            <div className="mt-10 space-y-10 md:hidden">
                {mobileGroups.map((group) => (
                    <section key={group.value}>
                        <h2 className="mb-4 font-heading text-[24px] font-extrabold leading-[24px] text-[#FBBF24]">
                            {group.label}
                        </h2>

                        <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
                            {group.articles.map((article) => (
                                <div
                                    key={article.id}
                                    className="w-[85%] max-w-[400px] shrink-0 snap-start"
                                >
                                    <NewsArticleCard article={article} />
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </>
    );
}
