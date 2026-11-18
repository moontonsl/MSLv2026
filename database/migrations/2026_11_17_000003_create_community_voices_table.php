<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_voices', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->string('school');
            $table->text('quote');
            $table->string('image_path', 500)->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
        });

        $now = now();
        $portrait = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80';

        DB::table('community_voices')->insert([
            [
                'name' => 'Leslie Alexander',
                'role' => 'Student Leader',
                'school' => 'University of Santo Tomas',
                'quote' => 'MSL gave our community a platform to grow as leaders and inspire student-gamers nationwide.',
                'image_path' => $portrait,
                'is_active' => true,
                'order' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Jacob Jones',
                'role' => 'Campus Organizer',
                'school' => 'Ateneo de Manila University',
                'quote' => 'Our campus programs became more structured because we learned directly from the MSL network.',
                'image_path' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
                'is_active' => true,
                'order' => 2,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Kristin Watson',
                'role' => 'Student Leader',
                'school' => 'De La Salle University',
                'quote' => 'The mentorship gave us confidence to lead bigger events and support more student-gamers.',
                'image_path' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80',
                'is_active' => true,
                'order' => 3,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('community_voices');
    }
};
