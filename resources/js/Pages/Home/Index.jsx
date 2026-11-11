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

export default function Home({ pinnedFaqs = [], heroSlides = [], statistics = [], networkLogos = [] }) {
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

    return (
        <MainLayout fullWidth>
            <Head title="Home" />

            <div className="overflow-x-clip bg-[#050505] font-sans text-white">
                <HomeAnnouncement data={homeData.announcement} />
                <HomeHero data={heroData} />
                <AboutSection data={aboutData} />
                <NetworkSection data={networkData} />
                <ProgramsSection data={homeData.programs} />
                {homeData.community.visible !== false && (
                    <CommunityVoicesSection data={homeData.community} />
                )}
                <ChooseYourPathSection data={homeData.paths} />
                <FAQSection data={faqData} />
            </div>
        </MainLayout>
    );
}
