import { useEffect, useState } from "react";
import { demoArticles, demoHighlights } from "@/data/articleData";

function formatDate(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getReadTime(content = "") {
    const text = String(content)
        .replace(/<[^>]*>/g, " ")
        .trim();

    if (!text) return "3 min read";

    const words = text.split(/\s+/).length;

    return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function normalizeArticle(article) {
    const slug = article.canonical || `article-${article.id}`;

    return {
        id: article.id ?? slug,
        slug,
        title: String(article.title || "Untitled article"),
        excerpt: String(article.subtitle || ""),
        category:
            article.category === "Game Updates"
                ? "Game Update"
                : String(article.category || "News"),
        date: formatDate(article.date),
        author: String(article.author || "MSL Philippines"),
        image: article.image || "",
        href: `/News/${encodeURIComponent(slug)}`,
        readTime: getReadTime(article.content),
    };
}

function normalizeHighlight(highlight, articles) {
    const href = String(highlight.link || "").replace(/^\/news\//i, "/News/");

    const matchingArticle = articles.find(
        (article) => article.href === href || article.title === highlight.title,
    );

    return {
        ...matchingArticle,
        id: highlight.id ?? href,
        title: highlight.title || matchingArticle?.title || "Featured story",
        excerpt: matchingArticle?.excerpt || "",
        image: highlight.src || matchingArticle?.image || "",
        href: href || matchingArticle?.href || "/News",
        date: formatDate(highlight.date),
        author: String(
            highlight.author || matchingArticle?.author || "MSL Philippines",
        ),
    };
}

async function fetchNews(url, signal) {
    const response = await fetch(url, {
        signal,
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Unable to load news (${response.status}).`);
    }

    const payload = await response.json();

    if (!Array.isArray(payload)) {
        throw new Error("The news API returned an unexpected response.");
    }

    return payload;
}

export default function useNewsData(useDemoData = true) {
    const [state, setState] = useState(() => ({
        articles: useDemoData ? demoArticles : [],
        highlights: useDemoData ? demoHighlights : [],
        isLoading: !useDemoData,
        error: "",
    }));

    useEffect(() => {
        if (useDemoData) {
            setState({
                articles: demoArticles,
                highlights: demoHighlights,
                isLoading: false,
                error: "",
            });

            return;
        }

        const controller = new AbortController();

        setState({
            articles: [],
            highlights: [],
            isLoading: true,
            error: "",
        });

        async function loadNews() {
            const [articleResult, highlightResult] = await Promise.allSettled([
                fetchNews("/api/news/articles", controller.signal),
                fetchNews("/api/news/highlights", controller.signal),
            ]);

            if (controller.signal.aborted) return;

            const articles =
                articleResult.status === "fulfilled"
                    ? articleResult.value.map(normalizeArticle)
                    : [];

            const highlights =
                highlightResult.status === "fulfilled"
                    ? highlightResult.value.map((highlight) =>
                          normalizeHighlight(highlight, articles),
                      )
                    : [];

            setState({
                articles,
                highlights,
                isLoading: false,
                error:
                    articleResult.status === "rejected"
                        ? "We could not load the articles. Please refresh to try again."
                        : "",
            });
        }

        loadNews();

        return () => controller.abort();
    }, [useDemoData]);

    return {
        articles: state.articles,
        featuredSlides: state.highlights.length
            ? state.highlights
            : state.articles.slice(0, 1),
        isLoading: state.isLoading,
        error: state.error,
    };
}
