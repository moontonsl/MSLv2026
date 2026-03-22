export default function LoginLanding({ onSignIn }) {

    return (
        <div className="min-h-screen flex items-center justify-center px-md">

            {/* MAIN CARD */}
            <div className="w-full max-w-6xl flex rounded-[28px] border border-white/10 bg-bg-card overflow-hidden">

                {/* ================= LEFT ================= */}
                <div className="w-[520px] pl-[48px] pr-[24px] py-xl flex flex-col justify-center">

                    {/* LOGO */}
                    <div className="flex items-center gap-xs mb-md">
                        <img
                            src="MSL_LOGO.png"
                            alt="MSL Logo"
                            className="w-10 h-10"
                        />
                        <span className="text-white font-bold text-subsection">
                            MSL Philippines
                        </span>
                    </div>

                    {/* HERO TEXT */}
                    <div className="space-y-xs mb-lg">

                        <h1 className="text-section font-bold leading-[1.1]">
                            Where Student Gamers
                        </h1>

                        <h1 className="text-section font-bold text-brand-500 leading-[1.1]">
                            Become Campus Legends
                        </h1>

                    </div>

                    {/* BUTTONS */}
                    <div className="flex flex-col gap-md">

                        {/* SIGN IN */}
                        <button
                            onClick={onSignIn}
                            className="w-[354px] py-md px-lg rounded-xl bg-brand-500 text-black font-semibold hover:bg-brand-600 transition"
                        >
                            Sign In
                        </button>

                        {/* CREATE ACCOUNT */}
                        <a
                            href="/register"
                            className="w-[354px] py-md px-lg rounded-xl border border-brand-500 text-brand-500 text-center font-semibold hover:bg-brand-500 hover:text-black transition"
                        >
                            Create an Account
                        </a>

                    </div>

                </div>

                {/* ================= RIGHT ================= */}
                <div className="flex-1 relative">

                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90">

                        <iframe
                            src="https://player.vimeo.com/video/1091173390?h=b2f78d509b&autoplay=1&loop=1&muted=1&background=1"
                            title="MSL Video"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-none"
                        />

                        {/* OPTIONAL OVERLAY */}
                        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-bg-cardHover/60 to-bg-card/60" /> */}

                    </div>

                </div>

            </div>

        </div>
    );
}