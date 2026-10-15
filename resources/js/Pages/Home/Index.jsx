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
