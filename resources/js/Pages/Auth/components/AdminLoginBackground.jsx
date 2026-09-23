const HERO_IMAGE = "/Images/Admin/heroes/brody.png";
const BACKGROUND_IMAGE = "/Images/Admin/background/eruditio.png";

export default function AdminLoginBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
        >
            <div className="absolute inset-0 overflow-hidden bg-brand-50 md:right-auto md:w-[38.1726%]">
                <img
                    src={HERO_IMAGE}
                    alt=""
                    draggable="false"
                    className="absolute inset-0 h-full w-full object-cover object-center opacity-80 md:origin-center md:scale-[1.2] md:translate-x-[-4.25%] md:translate-y-[3.42%]"
                />
            </div>

            <div className="absolute inset-y-0 right-0 hidden w-[61.8274%] overflow-hidden bg-[#737169] shadow-[-10px_0_40px_rgba(0,0,0,0.18)] md:block">
                <div className="absolute inset-y-0 -left-[5.75%] right-0">
                    <img
                        src={BACKGROUND_IMAGE}
                        alt=""
                        draggable="false"
                        className="h-full w-full object-cover object-right"
                    />
                </div>

                <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/50 to-black/30" />
            </div>
        </div>
    );
}
