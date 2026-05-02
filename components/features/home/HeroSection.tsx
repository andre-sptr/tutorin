import Link from "next/link";
import { Rocket, Terminal, Zap } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="container mx-auto px-4 max-w-7xl pt-8 pb-8 md:pt-32 md:pb-28 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-blue-100/50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs md:text-sm mb-4 md:mb-8 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm shadow-sm animate-pulse-slow">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Pusat Solusi Anda</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 md:mb-8 leading-[1.15] max-w-5xl mx-auto drop-shadow-sm">
                Kuasai Teknologi dengan <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    Panduan Terstruktur
                </span>
            </h1>

            <p className="text-sm md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6 md:mb-10">
                TutorinBang membantu Anda mengatasi berbagai kendala hardware dan software sehari-hari. Temukan langkah-langkah perbaikan yang mudah dipahami oleh siapa saja.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/tutorial" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base md:text-lg transition-all duration-300 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group hover:-translate-y-1">
                    <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    Cari Solusi Sekarang
                </Link>
                <Link href="/tentang" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-base md:text-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-2 group hover:-translate-y-1">
                    <Terminal className="w-5 h-5" />
                    Visi & Misi Kami
                </Link>
            </div>
        </section>
    );
}
