import HoverOutline from '@/Components/HoverOutline';
import typography from '@/Pages/ContentMedia.module.css';

// Same team layout as Campus ("Meet the Campus Team") and Contents & Social Media
// ("Leadership"): a featured card for the division head, then square member cards.
const ACCENT = '#22D3EE'; // cyan accent for the Software Engineering Division

function Portrait({ person, className = '' }) {
    if (person.image) {
        return (
            <img
                src={person.image}
                alt=""
                loading="lazy"
                className={`${typography.posterImage} h-full w-full object-cover object-top ${className}`}
            />
        );
    }

    // Monogram placeholder until a photo is added in aboutData.js.
    return (
        <span
            aria-hidden="true"
            className={`${typography.posterImage} flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.22),transparent_60%),linear-gradient(160deg,#10202a,#0b0b0b)] font-heading text-5xl font-extrabold text-cyan-300/80 sm:text-6xl ${className}`}
        >
            {person.name.charAt(0)}
        </span>
    );
}

export default function SoftwareEngineeringTeam({ division }) {
    const { head, members } = division;

    return (
        <>
            <div className="text-center">
                <h2 className="mb-4 text-3xl font-bold">{division.title}</h2>
                <p className="mx-auto max-w-xl text-body-sm text-gray-200 sm:text-body-md">
                    {division.description}
                </p>
            </div>

            {/* Division head */}
            <article className="relative mx-auto mt-10 flex max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#111111] p-4 md:flex-row lg:mt-14 lg:p-5">
                <div className={`${typography.zoomFrame} relative aspect-square w-full shrink-0 overflow-hidden rounded-t-2xl md:w-5/12 md:self-center md:rounded-l-2xl md:rounded-tr-none`}>
                    <Portrait person={head} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center rounded-b-2xl bg-[#1e1e1e] p-4 sm:p-6 md:rounded-b-none md:rounded-r-2xl">
                    <p className={`uppercase text-cyan-400 ${typography.featuredRole}`}>{head.role}</p>
                    <h3 className={`mt-2 text-xl font-bold leading-7 text-white sm:text-2xl sm:leading-8 lg:text-subsection ${typography.ralewayTitle}`}>
                        {head.name}
                    </h3>
                    <p className={`mt-5 border-l-2 border-cyan-400 pl-4 text-gray-300 ${typography.featuredQuote}`}>
                        {head.statement}
                    </p>
                </div>
                <HoverOutline color={ACCENT} />
            </article>

            {/* Division team */}
            <div className="mt-12 border-t border-neutral-800 pt-8 lg:mt-16">
                <h3 className="mb-6 font-inter text-sm font-bold uppercase leading-5 text-gray-400 lg:text-xl lg:leading-7">
                    The Team
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    {members.map((member) => (
                        <article
                            key={member.id}
                            className={`${typography.poster} relative aspect-square w-full overflow-hidden rounded-xl border border-neutral-800 bg-[#111111]`}
                        >
                            <Portrait person={member} />
                            <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black via-black/70 to-transparent p-3 pt-10">
                                <span className="block text-[10px] font-bold uppercase leading-tight text-cyan-300">{member.role}</span>
                                <span className="mt-1 block font-inter text-sm font-bold leading-5 text-white lg:text-xl lg:leading-7">{member.name}</span>
                            </span>
                            <HoverOutline color={ACCENT} />
                        </article>
                    ))}
                </div>
            </div>
        </>
    );
}
