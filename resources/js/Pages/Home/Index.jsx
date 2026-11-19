import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import { homeData } from "@/data/homeData";

import HomeAnnouncement from "./Components/HomeAnnouncement";
import HomeHero from "./Components/HomeHero";
import AboutSection from "./Components/AboutSection";
import NetworkSection from "./Components/NetworkSection";
import ProgramsSection from "./Components/ProgramsSection";
import CommunityVoicesSection from "./Components/CommunityVoicesSection";
import ChooseYourPathSection from "./Components/ChooseYourPathSection";
import FAQSection from "./Components/FAQSection";

const showCommunityVoicesHomepage = false;

export default function Home({
    pinnedFaqs = [],
    heroSlides = [],
    statistics = [],
    networkLogos = [],
    announcements = [],
    bookmarkedPrograms = null,
    communityVoices = [],
    communityVisible = true,
}) {
    const faqData = {
        ...homeData.faq,
        items: (pinnedFaqs.length > 0 ? pinnedFaqs : homeData.faq.items).slice(0, 5),
    };

    const heroData = {
        ...homeData.hero,
        slides: heroSlides.length > 0 ? heroSlides : homeData.hero.slides,
    };

    const aboutData = {
        ...homeData.about,
        statistics: statistics.length > 0 ? statistics : homeData.about.statistics,
    };

    const networkData = {
        ...homeData.network,
        logos: networkLogos.length > 0 ? networkLogos : homeData.network.logos,
    };

    const programsData = {
        ...homeData.programs,
        items: Array.isArray(bookmarkedPrograms)
            ? bookmarkedPrograms.slice(0, 5)
            : homeData.programs.items.slice(0, 5),
    };

    const communityData = {
        ...homeData.community,
        voices: communityVoices.length > 0 ? communityVoices : homeData.community.voices,
    };

    const shouldShowCommunity =
        showCommunityVoicesHomepage &&
        Boolean(communityVisible) &&
        communityData.voices.length > 0;

    return (
        <MainLayout fullWidth>
            <Head title="Home" />

            <div className="overflow-x-clip bg-[#050505] font-sans text-white">
                <HomeAnnouncement
                    announcements={announcements}
                    data={homeData.announcement}
                />
                <HomeHero data={heroData} />
                <AboutSection data={aboutData} />
                <NetworkSection data={networkData} />
                {programsData.items.length > 0 && (
                    <ProgramsSection data={programsData} />
                )}
                {shouldShowCommunity && (
                    <CommunityVoicesSection data={communityData} />
                )}
                <ChooseYourPathSection data={homeData.paths} />
                <FAQSection data={faqData} />
            </div>
        </MainLayout>
    );
}
