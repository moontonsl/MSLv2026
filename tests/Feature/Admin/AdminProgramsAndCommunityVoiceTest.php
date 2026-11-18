<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\CommunityVoice;
use App\Models\Program;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminProgramsAndCommunityVoiceTest extends TestCase
{
    use RefreshDatabase;

    private function signInAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'CMS Admin',
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'Super Admin',
        ]);

        $this->actingAs($admin, 'admin');

        return $admin;
    }

    public function test_programs_crud_reflects_on_main_programs_page_and_enforces_max_five_homepage_bookmarks(): void
    {
        Storage::fake('public');
        $this->signInAdmin();

        // Migration seeds 6 default programs (5 bookmarked, 1 unbookmarked)
        $this->assertSame(5, Program::where('is_bookmarked', true)->count());
        $unbookmarked = Program::where('is_bookmarked', false)->firstOrFail();

        // Trying to bookmark a 6th program is blocked
        $this->patch(route('admin.home-page.programs.bookmark', $unbookmarked), [
            'is_bookmarked' => true,
        ])->assertSessionHas('error');

        $this->assertFalse($unbookmarked->fresh()->is_bookmarked);

        // Unbookmark one existing program, then bookmarking succeeds
        $firstBookmarked = Program::where('is_bookmarked', true)->firstOrFail();
        $this->patch(route('admin.home-page.programs.bookmark', $firstBookmarked), [
            'is_bookmarked' => false,
        ])->assertSessionHas('success');

        $this->assertSame(4, Program::where('is_bookmarked', true)->count());

        // Add a brand new program with bookmark enabled -> reflects on BOTH Homepage and /Programs
        $this->post(route('admin.home-page.programs.store'), [
            'title' => 'MSL Leadership Academy',
            'description' => 'National leadership bootcamp for collegiate esports officers.',
            'link' => '/MSLNetwork',
            'icon' => 'presentation',
            'color' => '#f2c21a',
            'is_bookmarked' => true,
            'is_active' => true,
            'image' => UploadedFile::fake()->image('academy.png', 600, 400),
        ])->assertSessionHas('success');

        $newProgram = Program::where('title', 'MSL Leadership Academy')->firstOrFail();
        $this->assertTrue($newProgram->is_bookmarked);

        // Verify /Programs main page includes ALL active programs (including non-bookmarked & newly added)
        $this->get('/Programs')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Programs/Index')
                ->has('programs', 7)
                ->where('programs.6.title', 'MSL Leadership Academy'));

        // Verify / Homepage ONLY receives the 5 bookmarked programs
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Home/Index')
                ->has('bookmarkedPrograms', 5));
    }

    public function test_community_voices_crud_and_homepage_visibility_toggle(): void
    {
        Storage::fake('public');
        $this->signInAdmin();

        $this->post(route('admin.home-page.community-voice.store'), [
            'name' => 'Maria Clara',
            'role' => 'Chapter President',
            'school' => 'Polytechnic University of the Philippines',
            'quote' => 'MSL empowered our student gamers to lead nationwide events.',
            'image' => UploadedFile::fake()->image('maria.jpg', 400, 400),
        ])->assertSessionHas('success');

        $voice = CommunityVoice::where('name', 'Maria Clara')->firstOrFail();

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('communityVisible', true)
                ->has('communityVoices', 4));

        // Toggle visibility off
        $this->post(route('admin.home-page.community-voice.visibility'), [
            'visible' => false,
        ])->assertSessionHas('success');

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('communityVisible', false));

        // Delete story
        $this->delete(route('admin.home-page.community-voice.delete', $voice))
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('community_voices', ['id' => $voice->id]);
    }
}
