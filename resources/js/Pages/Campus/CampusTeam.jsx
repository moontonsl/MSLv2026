import HoverOutline from '@/Components/HoverOutline';
import typography from '../ContentMedia.module.css';
import styles from './Campus.module.css';
import { campusTeamProfiles } from './campusTeamData';

const teamGroups = [
    { id: 'regional', title: 'Regional Admins' },
    { id: 'shs', title: 'Senior High School Admins' },
    { id: 'support', title: 'Campus Support Team' },
];

export default function CampusTeam() {
    const head = campusTeamProfiles[0];

    return (
        <>
            <div className="text-center">
                <h2 className={typography.sectionTitle}>Meet the Campus Team</h2>
                <p className={`mt-4 text-gray-400 ${typography.sectionDescription}`}>
                    Dedicated managers ensuring every school and region gets the support it needs.
                </p>
            </div>
            <article className="relative mx-auto mt-12 flex max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-neutral-800 bg-[#111111] p-4 md:flex-row lg:mt-20 lg:p-5">
                <div style={head.portraitFrame}
                    className={`${typography.zoomFrame} ${styles.teamPortrait} cursor-pointer aspect-square w-full shrink-0 overflow-hidden rounded-t-2xl focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-blue-400 md:w-5/12 md:self-center md:rounded-l-2xl md:rounded-tr-none`}>
                    <img src={head.image} alt={head.name} className={`${typography.posterImage} h-full w-full object-cover object-top`} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center rounded-b-2xl bg-[#1e1e1e] p-4 sm:p-6 md:rounded-b-none md:rounded-r-2xl">
                    <p className={`uppercase text-blue-400 ${typography.featuredRole}`}>{head.role}</p>
                    <h3 className={`mt-2 text-xl font-bold leading-7 text-white sm:text-2xl sm:leading-8 lg:text-subsection ${typography.ralewayTitle}`}>{head.name}</h3>
                    <blockquote className={`mt-5 whitespace-pre-line border-l-2 border-blue-400 pl-4 italic text-gray-300 ${typography.featuredQuote}`}>{head.quote}</blockquote>
                </div>
                <HoverOutline color="rgb(96 165 250)" />
            </article>

            {teamGroups.map((group) => (
                <div key={group.id} className="mt-12 border-t border-neutral-800 pt-8 lg:mt-16">
                    <h3 className="mb-6 font-inter text-sm font-bold uppercase leading-5 text-gray-400 lg:text-xl lg:leading-7">{group.title}</h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
                        {campusTeamProfiles.filter((profile) => profile.id !== head.id && profile.group === group.id).map((profile) => {
                            const Card = profile.email ? 'a' : 'article';
                            return (
                            <Card key={profile.id} style={profile.portraitFrame}
                                {...(profile.email ? { href: `mailto:${profile.email}`, 'aria-label': `Email ${profile.name}, ${profile.role}`, title: `Email ${profile.name}` } : {})}
                                className={`${typography.poster} ${styles.teamPortrait} cursor-pointer relative aspect-square w-full overflow-hidden rounded-xl border border-neutral-800 bg-[#111111] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400`}>
                                <img src={profile.image} alt="" loading="lazy" className={`${typography.posterImage} h-full w-full object-cover object-top`} />
                                <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black via-black/70 to-transparent p-3 pt-10">
                                    <span className="block text-[10px] font-bold uppercase leading-tight text-blue-300">{profile.role}</span>
                                    <span className="mt-1 block font-inter text-sm font-bold leading-5 text-white lg:text-xl lg:leading-7">{profile.name}</span>
                                </span>
                                <HoverOutline />
                            </Card>
                            );
                        })}
                    </div>
                </div>
            ))}

        </>
    );
}
