<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('carousels')) {
            Schema::create('carousels', function (Blueprint $table): void {
                $table->id();
                $table->string('title')->nullable();
                $table->string('image_path')->nullable();
                $table->integer('order')->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('event_photos')) {
            Schema::create('event_photos', function (Blueprint $table): void {
                $table->id();
                $table->string('event_name');
                $table->string('school_name');
                $table->string('picture')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('events')) {
            Schema::create('events', function (Blueprint $table): void {
                $table->id();
                $table->string('title');
                $table->text('description')->nullable();
                $table->dateTime('start_date');
                $table->dateTime('end_date');
                $table->string('location')->nullable();
                $table->unsignedBigInteger('created_by')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (!Schema::hasTable('settings')) {
            Schema::create('settings', function (Blueprint $table): void {
                $table->id();
                $table->string('key')->unique();
                $table->text('value')->nullable();
                $table->string('type')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('short_links')) {
            Schema::create('short_links', function (Blueprint $table): void {
                $table->id();
                $table->string('code')->unique();
                $table->text('original_url');
                $table->unsignedBigInteger('clicks')->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('violation_reports')) {
            Schema::create('violation_reports', function (Blueprint $table): void {
                $table->id();
                $table->string('name')->nullable();
                $table->string('school')->nullable();
                $table->string('incident_type');
                $table->text('description');
                $table->text('evidence')->nullable();
                $table->boolean('is_anonymous')->default(false);
                $table->string('status')->default('Pending');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('msl_events_data')) {
            Schema::create('msl_events_data', function (Blueprint $table): void {
                $table->id();
                $table->string('event_name');
                $table->string('event_state')->default('Active');
                $table->string('event_canonical')->unique();
                $table->string('event_logo')->nullable();
                $table->string('event_title');
                $table->text('event_subtitle')->nullable();
                $table->longText('event_content01')->nullable();
                $table->longText('event_content02')->nullable();
                $table->string('event_img01')->nullable();
                $table->string('event_img02')->nullable();
                $table->string('event_img03')->nullable();
                $table->string('event_img04')->nullable();
                $table->string('event_img05')->nullable();
                $table->boolean('is_featured')->default(false);
                $table->string('redirect_url')->nullable();
                $table->timestamps();
            });
        } elseif (!Schema::hasColumn('msl_events_data', 'redirect_url')) {
            Schema::table('msl_events_data', fn (Blueprint $table) => $table->string('redirect_url')->nullable());
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('msl_events_data');
        Schema::dropIfExists('violation_reports');
        Schema::dropIfExists('short_links');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('events');
        Schema::dropIfExists('event_photos');
        Schema::dropIfExists('carousels');
    }
};
