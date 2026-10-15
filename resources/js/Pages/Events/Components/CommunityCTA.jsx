import { ArrowRight } from "lucide-react";
import { focusStyles } from "../eventStyles";

export default function CommunityCTA() {
    return (
        <section
            aria-labelledby="community-heading"
            className="mx-auto mt-20 flex max-w-[1288px] items-center justify-center rounded-xl border border-white/15 bg-[linear-gradient(120deg,#13101f_0%,#171426_48%,#251923_100%)] px-6 py-16 shadow-[inset_0_0_18px_rgba(137,121,240,0.08)] sm:mt-28 sm:px-12 lg:mt-[180px] lg:min-h-[439px]"
        >
            <div className="flex w-full max-w-[1100px] flex-col items-center gap-[50px] text-center">
                <div className="flex w-full flex-col items-center gap-2.5">
                    <h2
                        id="community-heading"
                        className="font-manrope text-[32px] font-extrabold leading-10 text-white sm:text-hero-md"
                    >
                        Don&apos;t see a tournament for your school?
                    </h2>

                    <p className="max-w-[808px] font-['Figtree'] text-body-lg font-normal text-gray-300 sm:text-body-xl">
                        Take the lead. Organize an official MSL-accredited
                        tournament in your campus and we&apos;ll support you
                        with prizes and logistics.
                    </p>
                </div>

                <button
                    type="button"
                    className={`inline-flex min-h-[53px] w-full max-w-[360px] items-center justify-center gap-5 rounded-[10px] border border-white/70 bg-white/10 px-4 py-2 text-lg font-semibold leading-8 text-white transition-colors hover:bg-white/15 sm:text-body-xl ${focusStyles}`}
                >
                    Find Your Community Head
                    <ArrowRight
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0"
                    />
                </button>
            </div>
        </section>
    );
}
