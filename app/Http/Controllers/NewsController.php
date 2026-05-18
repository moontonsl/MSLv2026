<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News;
use Inertia\Inertia;

class NewsController extends Controller
{
    // Helper to resolve the correct image URL
    private function resolveImageUrl(?string $filename): string
    {
        if (empty($filename)) return '/images/default-news-placeholder.jpg';
        return '/storage/news/' . $filename;
    }

    // Fetch all articles for the main news page
    public function getArticles()
    {
        $articles = News::orderByDesc('news_published')
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'canonical' => $article->news_canonical,
                    'category' => $article->news_state,
                    'title' => $article->news_title,
                    'subtitle' => $article->news_subtitle,
                    'author' => $article->news_writer,
                    'date' => $article->news_published,
                    'image' => $this->resolveImageUrl($article->news_img1),
                    'link' => '/news/' . $article->news_canonical,
                    'content' => $article->news_content,
                ];
            });

        return response()->json($articles);
    }

    // Fetch highlighted news for carousels
    public function getHighlights()
    {
        $highlights = News::where('news_state', 'Highlight')
            ->orderByDesc('news_published')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->news_title,
                    'author' => $item->news_writer,
                    'date' => $item->news_published,
                    'src' => $this->resolveImageUrl($item->news_img1),
                    'link' => '/news/' . ($item->news_canonical ?? $item->id),
                ];
            });

        return response()->json($highlights);
    }

    // Fetch related articles
    public function getRelatedArticles()
    {
        $related = News::orderByDesc('news_published')
            ->take(3)
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'canonical' => $article->news_canonical,
                    'category' => $article->news_state,
                    'title' => $article->news_title,
                    'author' => $article->news_writer,
                    'date' => $article->news_published,
                    'image' => $this->resolveImageUrl($article->news_img1),
                    'link' => '/news/' . $article->news_canonical,
                ];
            });

        return response()->json($related);
    }

    // Show single article view
    public function show(string $canonical)
    {
        $article = News::where('news_canonical', $canonical)
            ->orWhere('id', str_replace('article-', '', $canonical))
            ->firstOrFail();

        $article->image = $this->resolveImageUrl($article->news_img1);
        $article->image2 = $article->news_img2 ? $this->resolveImageUrl($article->news_img2) : null;
        $article->image3 = $article->news_img3 ? $this->resolveImageUrl($article->news_img3) : null;

        $readNext = News::where('news_canonical', '!=', $canonical)
            ->orderByDesc('news_published')
            ->take(3)
            ->get()
            ->map(function ($a) {
                return [
                    'slug' => $a->news_canonical,
                    'title' => $a->news_title,
                    'excerpt' => $a->news_subtitle,
                    'date' => $a->news_published ? date('M d, Y', strtotime($a->news_published)) : '',
                    'author' => $a->news_writer ?? 'Admin',
                    'category' => $a->news_state,
                    'readTime' => '3 min read',
                    'imageSrc' => $this->resolveImageUrl($a->news_img1),
                    'href' => '/news/' . $a->news_canonical,
                ];
            });

        return Inertia::render('News/ArticleDetail', [
            'article' => [
                'slug' => $article->news_canonical,
                'title' => $article->news_title,
                'category' => $article->news_state,
                'date' => $article->news_published ? date('M d, Y', strtotime($article->news_published)) : '',
                'readTime' => '3 min read', // Placeholder
                'heroImage' => $article->image,
                'content' => $article->news_content ?? '',
                'author' => [
                    'name' => $article->news_writer ?? 'Admin',
                    'role' => 'Contributor',
                    'avatar' => null,
                ]
            ],
            'readNext' => $readNext
        ]);
    }

    public function index()
    {
        return Inertia::render('News');
    }
}
