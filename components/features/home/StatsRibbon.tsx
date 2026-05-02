export default function StatsRibbon() {
    return (
        <section className="border-y border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md relative z-10">
            <div className="container mx-auto px-4 max-w-7xl py-6 md:py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center divide-x divide-slate-200 dark:divide-slate-800/80">
                    <div className="py-2 md:py-0">
                        <div className="text-xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1 md:mb-2">100%</div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Akses Gratis</div>
                    </div>
                    <div className="py-2 md:py-0">
                        <div className="text-base md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1 md:mb-2">Step-by-step</div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Terstruktur</div>
                    </div>
                    <div className="py-2 md:py-0">
                        <div className="text-xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1 md:mb-2">Sederhana</div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Mudah Dipahami</div>
                    </div>
                    <div className="border-t md:border-t-0 border-slate-200 dark:border-slate-800/80 pt-4 md:pt-0 col-span-2 md:col-span-1 py-2 md:py-0">
                        <div className="text-xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1 md:mb-2">Lokal</div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Bahasa Indonesia</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
