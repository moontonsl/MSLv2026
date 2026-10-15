export default function NewsletterSection() {
    return (
        <section
            aria-labelledby="news-subscribe-heading"
            className="pb-20 pt-24 lg:pb-32 lg:pt-44"
        >
            <div className="rounded-xl border border-[#3B3445] bg-[linear-gradient(115deg,#121020_0%,#151020_55%,#251821_100%)] px-6 py-12 text-center md:px-12 md:py-16">
                <h2
                    id="news-subscribe-heading"
                    className="font-heading text-[32px] font-extrabold leading-[40px] text-white md:text-[48px] md:leading-[58px]"
                >
                    Never Miss an Update
                </h2>

                <p className="mx-auto mt-3 max-w-[820px] font-['Figtree'] text-[20px] font-normal leading-[32px] text-[#C1BEC8]">
                    Subscribe to our{" "}
                    <strong className="font-sans font-bold">
                        monthly digest
                    </strong>{" "}
                    for the latest tournament announcements, community
                    spotlights, and game updates directly to your inbox.
                </p>

                <form
                    onSubmit={(event) => event.preventDefault()}
                    className="mx-auto mt-12 flex max-w-[540px] flex-col gap-5 sm:flex-row"
                >
                    <label className="min-w-0 flex-1">
                        <span className="sr-only">Email address</span>

                        <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            required
                            placeholder="Enter your email address"
                            className="h-[52px] w-full rounded-xl border border-[#393240] bg-[#100D19] px-4 text-[16px] font-normal leading-[24px] text-white placeholder:text-gray-500 focus:border-[#FBBF24] focus:outline-none focus:ring-1 focus:ring-[#FBBF24]"
                        />
                    </label>

                    <button
                        type="submit"
                        className="inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-xl bg-[#FBBF24] px-5 text-[16px] font-semibold leading-[24px] text-black transition-colors hover:bg-[#FCD34D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]"
                    >
                        Subscribe
                    </button>
                </form>

                <p className="mx-auto mt-12 max-w-[960px] text-[12px] font-normal leading-[18px] text-[#9B97A4]">
                    By subscribing, you consent to our collection of your email
                    for newsletter purposes in compliance with the Data Privacy
                    Act of 2012. Unsubscribe at any time.
                </p>
            </div>
        </section>
    );
}
