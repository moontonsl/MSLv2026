import { ButtonLink, HomeContainer, HomeIcon, SectionHeading } from "./HomeUI";

function PathCard({ path }) {
    const isStudent = path.theme === "student";

    return (
        <article
            className={`flex flex-col rounded-[20px] border p-8 xl:p-10 ${
                isStudent
                    ? "border-[#F2C21A]/25 bg-gradient-to-br from-[#19170D] via-[#111111] to-[#111111]"
                    : "border-blue-500/25 bg-gradient-to-br from-[#141B21] via-[#111111] to-[#111111]"
            }`}
        >
            <span
                className={`grid h-16 w-16 place-items-center rounded-2xl ${
                    isStudent
                        ? "bg-[#F2C21A]/20 text-[#D4A810]"
                        : "bg-blue-500/15 text-blue-400"
                }`}
            >
                <HomeIcon name={path.icon} size={30} />
            </span>

            <h3 className="mt-10 font-heading text-[30px] font-extrabold leading-[38px] text-white">
                {path.title}
            </h3>

            <p className="mb-10 mt-4 font-sans text-[18px] font-normal leading-[28px] text-[#9CA3AF]">
                {path.description}
            </p>

            <ButtonLink
                href={path.href}
                variant={isStudent ? "primary" : "partner"}
                className="mt-auto w-full rounded-lg"
            >
                {path.buttonLabel}
            </ButtonLink>
        </article>
    );
}

export default function ChooseYourPathSection({ data }) {
    return (
        <section
            aria-labelledby="home-paths-title"
            className="border-y border-white/[0.04] bg-[#0A0A0A] py-16 md:py-24"
        >
            <HomeContainer>
                <div className="mx-auto max-w-[768px] text-center">
                    <SectionHeading id="home-paths-title">
                        {data.title}
                    </SectionHeading>

                    <p className="mt-4 font-sans text-[16px] font-normal leading-[26px] text-[#D1D5DB]">
                        {data.description}
                    </p>
                </div>

                <div className="mx-auto mt-10 grid max-w-[1040px] grid-cols-1 gap-6 md:mt-12 md:grid-cols-2 xl:gap-12">
                    {data.items.map((path) => (
                        <PathCard key={path.id} path={path} />
                    ))}
                </div>
            </HomeContainer>
        </section>
    );
}
