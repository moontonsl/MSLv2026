import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";
import MainLayout from "@/Layouts/MainLayout";

import NewsHeader from "./Components/NewsHeader";
import FeaturedNews from "./Components/FeaturedNews";
import NewsFilters from "./Components/NewsFilters";
import NewsResults from "./Components/NewsResults";
import NewsletterSection from "./Components/NewsletterSection";
import useNewsData from "./hooks/useNewsData";

// Set to false when you want to use your database.
const USE_DEMO_DATA = true;

const CATEGORIES = [
    { value: "Esports", label: "Esports" },
    { value: "Community", label: "Community" },
    { value: "Events", label: "Events" },
    { value: "Game Update", label: "Game Updates" },
];

export default function News() {
    const { articles, featuredSlides, isLoading, error } =
        useNewsData(USE_DEMO_DATA);

    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filterOptions = useMemo(() => {
        const additionalCategories = [
            ...new Set(
                articles
                    .map((article) => article.category)
                    .filter((category) => category !== "Highlight"),
            ),
        ].filter(
            (category) =>
                !CATEGORIES.some((option) => option.value === category),
        );

        return [
            { value: "All", label: "All" },
            ...CATEGORIES,
            ...additionalCategories.map((category) => ({
                value: category,
                label: category,
            })),
        ];
    }, [articles]);

    const filteredArticles = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return articles.filter((article) => {
            const matchesCategory =
                activeFilter === "All" || article.category === activeFilter;

            const matchesSearch =
                !query ||
                [
                    article.title,
                    article.excerpt,
                    article.category,
                    article.author,
                ].some((value) =>
                    String(value || "")
                        .toLowerCase()
                        .includes(query),
                );

            return matchesCategory && matchesSearch;
        });
    }, [activeFilter, articles, searchQuery]);

    return (
        <MainLayout fullWidth>
            <Head title="News & Updates" />

            <div className="w-full bg-[#080808] bg-[radial-gradient(ellipse_65%_30%_at_50%_4%,rgba(251,191,36,0.055),transparent)] font-sans text-white">
                <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-[76px]">
                    <NewsHeader />

                    {isLoading ? (
                        <p
                            role="status"
                            className="py-24 text-center text-[18px] leading-[28px] text-gray-400"
                        >
                            Loading news...
                        </p>
                    ) : (
                        <>
                            <FeaturedNews articles={featuredSlides} />

                            <section
                                aria-label="Browse news articles"
                                className={
                                    featuredSlides.length
                                        ? "mt-24 lg:mt-48"
                                        : "mt-12"
                                }
                            >
                                <NewsFilters
                                    options={filterOptions}
                                    activeFilter={activeFilter}
                                    searchQuery={searchQuery}
                                    onFilterChange={setActiveFilter}
                                    onSearchChange={setSearchQuery}
                                />

                                <NewsResults
                                    articles={filteredArticles}
                                    hasArticles={articles.length > 0}
                                    filterOptions={filterOptions}
                                    error={error}
                                />
                            </section>
                        </>
                    )}

                    <NewsletterSection />
                </div>
            </div>
        </MainLayout>
    );
}
