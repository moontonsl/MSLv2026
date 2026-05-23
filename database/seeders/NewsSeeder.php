<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\News;
use Illuminate\Support\Str;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Esports',
            'Community',
            'Events',
            'Game Update',
            'Reports'
        ];

        foreach ($categories as $index => $category) {
            News::create([
                'news_canonical' => Str::slug($category . ' Dummy Article ' . ($index + 1)),
                'news_state' => $category,
                'news_title' => $category . ' Dummy Article ' . ($index + 1),
                'news_subtitle' => 'This is a subtitle for the ' . $category . ' article.',
                'news_published' => now()->subDays($index),
                'news_writer' => 'Admin User',
                'news_img1' => null, // Will use default placeholder
                'news_content' => '<p>This is the content for the ' . $category . ' dummy article. It contains all the necessary information.</p>',
            ]);
        }

        // Add one highlight
        News::create([
            'news_canonical' => 'highlight-dummy-article',
            'news_state' => 'Highlight',
            'news_title' => 'Highlight Dummy Article',
            'news_subtitle' => 'This is a subtitle for the highlight article.',
            'news_published' => now(),
            'news_writer' => 'Admin User',
            'news_img1' => null, // Will use default placeholder
            'news_content' => '<p>This is the highlight content.</p>',
        ]);
    }
}
