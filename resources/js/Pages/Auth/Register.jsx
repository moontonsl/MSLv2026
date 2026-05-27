import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Award, GraduationCap, Compass } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Register() {
    return (
        <div className="min-h-screen bg-[#060606] bg-[radial-gradient(circle_at_50%_0%,#18150c_0%,#060606_50%)] flex flex-col justify-between text-white font-['Figtree'] selection:bg-brand-500 selection:text-black">
            <Head title="Choose Division" />

            {/* Header */}
            <header className="px-6 py-5 md:px-12 flex justify-between items-center border-b border-white/5 bg-[#0b0b0b]/40 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <GraduationCap className="h-7 w-7 text-brand-500" strokeWidth={2.2} />
                    <span className="font-['League_Spartan'] font-black text-xl tracking-tight text-white uppercase">
                        MSL <span className="text-brand-500">Philippines</span>
                    </span>
                </div>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition group"
                >
                    <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 max-w-6xl mx-auto w-full">
                <div className="text-center max-w-2xl mb-12 md:mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-brand-400 uppercase">
                        Registration Portal
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black font-['League_Spartan'] tracking-tight leading-none text-white">
                        Choose your <span className="text-brand-500">Division</span>
                    </h1>
                    <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                        Join the biggest student esports league in the country. Select your current academic division below to customize your credentials and tournament access.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-8 w-full">
                    {/* Card 1: SHS */}
                    <div className="group relative rounded-3xl border border-white/10 bg-[#0b0b0b] p-8 md:p-10 shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-brand-500/30 hover:shadow-[0_0_30px_rgba(242,194,26,0.06)] hover:-translate-y-1">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-brand-500/5 blur-3xl group-hover:bg-brand-500/10 transition-colors duration-300" />
                        
                        <div className="relative z-10 space-y-6">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-brand-500 transition-colors duration-300 group-hover:bg-brand-500/10 group-hover:border-brand-500/20">
                                <BookOpen className="h-7 w-7" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white font-['League_Spartan']">
                                    Senior High School
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Designed for Grade 11 and Grade 12 student gamers across public and private high schools. Represent your campus strand and compete locally.
                                </p>
                            </div>
                            
                            <ul className="space-y-2 text-xs text-gray-500 pt-2">
                                <li className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                                    Esports Tournament Access
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                                    Campus Leaders Network
                                </li>
                            </ul>
                        </div>
                        
                        <div className="relative z-10 pt-8">
                            <a
                                href="/register/shs"
                                className="inline-flex w-full items-center justify-center rounded-xl bg-brand-500 px-4 py-3.5 text-base font-bold text-black transition-all hover:bg-brand-400 group-hover:shadow-lg group-hover:shadow-brand-500/20"
                            >
                                Register as SHS Student
                            </a>
                        </div>
                    </div>

                    {/* Card 2: College */}
                    <div className="group relative rounded-3xl border border-white/10 bg-[#0b0b0b] p-8 md:p-10 shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-brand-500/30 hover:shadow-[0_0_30px_rgba(242,194,26,0.06)] hover:-translate-y-1">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-brand-500/5 blur-3xl group-hover:bg-brand-500/10 transition-colors duration-300" />
                        
                        <div className="relative z-10 space-y-6">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-brand-500 transition-colors duration-300 group-hover:bg-brand-500/10 group-hover:border-brand-500/20">
                                <Award className="h-7 w-7" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white font-['League_Spartan']">
                                    College / University
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Designed for Undergraduate, Associate, or Vocational students representing university teams. Showcase your skills in national leagues.
                                </p>
                            </div>
                            
                            <ul className="space-y-2 text-xs text-gray-500 pt-2">
                                <li className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                                    National Championship Access
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                                    Scholarships & Partner Benefits
                                </li>
                            </ul>
                        </div>
                        
                        <div className="relative z-10 pt-8">
                            <a
                                href="/register/college"
                                className="inline-flex w-full items-center justify-center rounded-xl border border-brand-500 px-4 py-3.5 text-base font-bold text-brand-500 transition-all hover:bg-brand-500 hover:text-black group-hover:shadow-lg group-hover:shadow-brand-500/10"
                            >
                                Register as College Student
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="px-6 py-5 md:px-12 text-center text-xs text-gray-600 border-t border-white/5 bg-[#0b0b0b]/40 backdrop-blur-md">
                &copy; {new Date().getFullYear()} Moonton SLph. All rights reserved.
            </footer>
        </div>
    );
}
