import Link from 'next/link';
import { Zap, ArrowRight, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10 overflow-hidden">
            {/* Subtle Background Glow at top of footer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/10 pointer-events-none" />

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Top Section - Branding & Links */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                    <div className="lg:col-span-5">
                        <Link href="/" className="font-extrabold text-3xl tracking-tight text-slate-900 dark:text-white mb-6 inline-flex items-center gap-2 group">
                            Tutorin<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Bang</span>
                            <Zap className="w-6 h-6 text-blue-500 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                        </Link>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base mb-8 max-w-md">
                            Platform edukasi dan referensi independen untuk talenta digital nusantara. Mengubah abstraksi teknis yang kompleks menjadi kode nyata yang siap dikirim ke produksi.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-5 h-5">
                                    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" />
                                </svg>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-4 h-4">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-500 hover:border-red-200 dark:hover:border-red-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-5 h-5">
                                    <path d="M23.5 6.2c-.3-1.2-1.2-2-2.4-2.3C18.9 3.5 12 3.5 12 3.5s-6.9 0-9.1.4A3.4 3.4 0 0 0 .5 6.2C0 8.3 0 12 0 12s0 3.7.5 5.8c.2 1.2 1.1 2.1 2.4 2.3 2.2.4 9.1.4 9.1.4s6.9 0 9.1-.4c1.2-.2 2.1-1.1 2.4-2.3.4-2.1.4-5.8.4-5.8s0-3.7-.4-5.8zM9.5 15.5v-7l6.5 3.5-6.5 3.5z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
                        <div>
                            <h3 className="font-extrabold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Eksplorasi</h3>
                            <ul className="space-y-4">
                                <li><Link href="/tutorial" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-sm flex items-center gap-2 group">Kumpulan Tutorial <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" /></Link></li>
                                <li><Link href="/tutorial?category=komputer" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-sm flex items-center gap-2 group">Tips Komputer <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" /></Link></li>
                                <li><Link href="/tutorial?category=printer" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-sm flex items-center gap-2 group">Tips Printer <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" /></Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-extrabold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Platform</h3>
                            <ul className="space-y-4">
                                <li><Link href="/tentang" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-sm flex items-center gap-2 group">Tentang Kami <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" /></Link></li>
                                <li><Link href="/author" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-sm flex items-center gap-2 group">Hubungi Tim <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" /></Link></li>
                                <li><span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs ring-1 ring-inset ring-emerald-600/20 cursor-default">Menulis untuk Kami</span></li>
                            </ul>
                        </div>
                        <div className="col-span-2 sm:col-span-1 border-t sm:border-0 border-slate-100 dark:border-slate-800 pt-6 sm:pt-0">
                            <h3 className="font-extrabold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Kebijakan</h3>
                            <ul className="space-y-4">
                                <li><Link href="/privasi" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-sm">Kebijakan Privasi</Link></li>
                                <li><Link href="/syarat" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-sm">Syarat & Ketentuan</Link></li>
                                <li><Link href="/disclaimer" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-sm">Penafian (Disclaimer)</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright Section */}
                <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 pb-2">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        &copy; {new Date().getFullYear()} TutorinBang. Seluruh hak cipta dilindungi.
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm cursor-default hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-center shrink-0">
                        Didesain dengan <Heart className="w-4 h-4 text-red-500 fill-red-500" /> di Indonesia
                    </div>
                </div>
            </div>
        </footer>
    );
}
