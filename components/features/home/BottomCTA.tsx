import Link from "next/link";
import { Rocket, ArrowRight } from "lucide-react";

export default function BottomCTA() {
    return (
        <section className="container mx-auto px-4 max-w-6xl pb-8 md:pb-12 pt-6 md:pt-12 relative z-10">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20 group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-white/20 transition-colors duration-700 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/3 group-hover:bg-blue-300/30 transition-colors duration-700 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <Rocket className="w-10 h-10 md:w-16 md:h-16 text-white/90 mb-4 md:mb-8" />
                    <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white mb-3 md:mb-6 leading-[1.2] md:leading-[1.1]">
                        Kendala Error <br className="hidden md:block" /> Menghambat Aktivitas?
                    </h2>
                    <p className="text-sm md:text-xl text-blue-50/90 max-w-2xl mx-auto mb-6 md:mb-12 leading-relaxed">
                        Jangan panik dulu! Temukan berbagai tutorial troubleshoot sederhana yang bisa Anda praktikkan sendiri. Hemat waktu, tenaga, dan selesaikan masalah dengan cepat.
                    </p>
                    <Link href="/tutorial" className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-5 rounded-2xl bg-white hover:bg-slate-50 text-blue-700 font-extrabold text-base md:text-lg transition-transform hover:-translate-y-1 shadow-xl shadow-black/10 group">
                        Temukan Solusinya
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
