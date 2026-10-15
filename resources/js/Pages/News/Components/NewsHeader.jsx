export default function NewsHeader() {
    return (
        <header className="border-b border-[#292929] pb-16 pt-16 text-center lg:pb-20 lg:pt-24">
            <h1 className="font-heading text-[40px] font-extrabold leading-[48px] text-[#FAFAF5] md:text-[60px] md:leading-[72px]">
                News <span className="text-[#FBBF24]">&amp;</span> Updates
            </h1>

            <p className="mx-auto mt-3 max-w-[640px] text-[18px] font-normal leading-[28px] text-[#D2D2CC]">
                Stay ahead of the meta. The latest stories, tournament results,
                and community highlights from MSL Philippines.
            </p>
        </header>
    );
}
