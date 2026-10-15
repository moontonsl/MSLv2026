import { buildFeaturedSlides, newsArticles } from "./newsData";

const cardOrder = [
    "student-leader-summit-2024",
    "collegiate-cup-season-4",
    "community-guidelines-update",
    "regional-finals-luzon",
    "patch-notes-roundup",
];

const articlesBySlug = new Map(
    newsArticles.map((article) => [article.slug, article]),
);

// Reuse the existing detail-page records and arrange the listing to match the
// reference UI's Events, Esports, Community, Events, and Game Update sequence.
export const articleData = cardOrder
    .map((slug) => articlesBySlug.get(slug))
    .filter(Boolean);

export const featuredData = buildFeaturedSlides();

export const articleFilters = [
    { value: "Esports", label: "Esports" },
    { value: "Community", label: "Community" },
    { value: "Events", label: "Events" },
    { value: "Game Update", label: "Game Updates" },
];
