import { useState } from "react";
import StudentTypeModal from "./StudentTypeModal";

export default function LoginLanding({ onSignIn }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="min-h-screen flex items-start md:items-center justify-center px-md pt-[100px] md:pt-0">

            {/* MAIN CARD */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row gap-[8px] md:gap-[32px] rounded-[28px] border border-white/10 bg-bg-card overflow-hidden min-h-[450px]">

                {/* ================= LEFT ================= */}
                <div className="w-full md:w-[520px] px-[20px] md:px-[48px] py-lg md:py-xl flex flex-col justify-center">

                    {/* HERO TEXT */}
                    <div className="space-y-1 md:space-y-xs mb-md md:mb-lg">

                        <h1 className="text-xl md:text-section font-bold leading-[1.2] md:whitespace-nowrap">
                            Where Student Gamers
                        </h1>

                        <h1 className="text-xl md:text-section font-bold text-brand-500 leading-[1.2] md:whitespace-nowrap">
                            Become Campus Legends
                        </h1>

                    </div>

                    {/* BUTTONS */}
                    <div className="flex flex-col gap-md">

                        {/* SIGN IN */}
                        <button
                            onClick={onSignIn}
                            className="w-full md:w-[354px] py-3 md:py-md px-lg rounded-xl bg-brand-500 text-black text-sm md:text-base font-semibold hover:bg-brand-600 transition"
                        >
                            Sign In
                        </button>

                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full md:w-[354px] py-3 md:py-md px-lg rounded-xl border border-brand-500 text-brand-500 text-center font-semibold hover:bg-brand-500 hover:text-black transition"
                        >
                            Create an Account
                        </button>

                        {/* STUDENT TYPE MODAL */}
                        <StudentTypeModal
                            isOpen={showModal}
                            onClose={() => setShowModal(false)}
                            onSelect={(type) => {
                                setShowModal(false);

                                if (type === 'shs') {
                                    window.location.href = '/register/shs';
                                } else {
                                    window.location.href = '/register/college';
                                }
                            }}
                        />

                    </div>

                </div>

                {/* ================= RIGHT ================= */}
                <div className="w-full md:flex-1 relative aspect-video md:aspect-auto">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90">
                        <iframe
                            src="https://player.vimeo.com/video/1091173390?context=Vimeo%5CController%5CApi%5CResources%5CVideoController.&h=b2f78d509b&s=e3ba5b9062fe0eb9a97262a95d7f03fe2cb1c579_1778490740&autoplay=1&loop=1&muted=1"
                            title="MSL Video"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* OPTIONAL OVERLAY */}
                        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-bg-cardHover/60 to-bg-card/60" /> */}

                    </div>

                </div>

                

            </div>

        </div>
    );
}
