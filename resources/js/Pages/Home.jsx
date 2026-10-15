import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import { homeData } from "@/data/homeData";

import HomeAnnouncement from "@/Components/Home/HomeAnnouncement";
import HomeHero from "@/Components/Home/HomeHero";
import AboutSection from "@/Components/Home/AboutSection";
import NetworkSection from "@/Components/Home/NetworkSection";
import ProgramsSection from "@/Components/Home/ProgramsSection";
import CommunityVoicesSection from "@/Components/Home/CommunityVoicesSection";
import ChooseYourPathSection from "@/Components/Home/ChooseYourPathSection";
import FAQSection from "@/Components/Home/FAQSection";

export default function Home() {
    return (
        <MainLayout fullWidth>
            <Head title="Home" />

            <div className="overflow-x-clip bg-[#050505] font-sans text-white">
                <HomeAnnouncement data={homeData.announcement} />
                <HomeHero data={homeData.hero} />
                <AboutSection data={homeData.about} />
                <NetworkSection data={homeData.network} />
                <ProgramsSection data={homeData.programs} />
                <CommunityVoicesSection data={homeData.community} />
                <ChooseYourPathSection data={homeData.paths} />
                <FAQSection data={homeData.faq} />
            </div>
        </MainLayout>
    );
}
