export default function NewsletterSection() {
    return (
        <section className="flex w-full justify-center bg-[#0A0A0A] px-4 pb-8 pt-2 md:px-8 md:py-16">
            <div className="flex w-full max-w-5xl flex-col items-center rounded-3xl border border-white/5 bg-gradient-to-br from-[#1A1825] to-[#111111] p-8 text-center shadow-2xl md:p-16">
                <h2 className="mb-4 font-heading text-3xl font-black tracking-tighter text-white md:text-4xl lg:text-5xl">
                    Never Miss an Update
                </h2>

                <p className="mb-8 max-w-2xl font-sans text-sm leading-relaxed text-gray-300 md:text-base">
                    Subscribe to our{' '}
                    <span className="font-bold text-white">monthly digest</span> for the latest
                    tournament announcements, community spotlights, and game updates directly to your
                    inbox.
                </p>

                <form
                    className="mx-auto mb-8 flex w-full max-w-md flex-col items-center gap-3 sm:flex-row"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        required
                        autoComplete="email"
                        className="w-full rounded-xl border border-neutral-700/50 bg-[#0A0A0A] px-4 py-3 text-white placeholder:text-gray-500 transition-all focus:border-[#FFC107] focus:outline-none focus:ring-1 focus:ring-[#FFC107] md:py-3.5"
                    />
                    <button
                        type="submit"
                        className="w-full shrink-0 rounded-xl bg-[#FFC107] px-8 py-3 font-sans font-bold text-black transition-all hover:bg-yellow-400 active:scale-95 sm:w-auto md:py-3.5"
                    >
                        Subscribe
                    </button>
                </form>

                <p className="max-w-3xl text-[10px] text-gray-500 md:text-xs">
                    By subscribing, you consent to our collection of your email for newsletter
                    purposes in compliance with the Data Privacy Act of 2012. Unsubscribe at any time.
                </p>
            </div>
        </section>
    );
}
