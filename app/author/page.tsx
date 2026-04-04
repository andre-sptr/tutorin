import { Code, Users, PenTool, Cpu, Laptop, MessageCircle, Mail, Globe, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Author Tim TutorinBang - Profil Lengkap",
  description: "Kenali lebih dekat Tim TutorinBang, kreator di balik artikel dan tutorial bermanfaat seputar teknologi.",
};

export default function AuthorPage() {
  return (
    <main className="min-h-screen pb-20 pt-16 bg-slate-50 dark:bg-slate-950 overflow-hidden relative">

      {/* Global Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/5 dark:bg-blue-900/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-indigo-400/5 dark:bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero Header Section */}
      <section className="relative container mx-auto px-4 max-w-4xl mb-16 pt-10">
        <div className="bg-white dark:bg-slate-900/90 rounded-[2rem] p-8 md:p-12 shadow-2xl border border-slate-200/80 dark:border-slate-800/90 relative overflow-hidden backdrop-blur-xl">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 mt-12 md:mt-16">
            {/* Avatar */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-extrabold text-5xl md:text-6xl">
                T
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold text-xs mb-4 border border-blue-200/50 dark:border-blue-800/50">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified Author</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">Tim TutorinBang</h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                Kami adalah kolektif kreator, teknisi, dan pegiat teknologi yang berfokus menyajikan tutorial, panduan, dan tips praktis seputar hardware dan software sehari-hari.
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-start gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="container mx-auto px-4 max-w-4xl mb-16 relative z-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center md:text-left">Keahlian & Fokus Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-lg shadow-slate-200/20 dark:shadow-none flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Hardware Troubleshoot</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Dari rakit PC, masalah laptop panas, hingga perbaikan komponen dengan peralatan sederhana.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-lg shadow-slate-200/20 dark:shadow-none flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Software & OS</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Panduan instalasi Windows, Linux, optimasi performa sistem, serta mengatasi blue screen of death (BSOD).</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-lg shadow-slate-200/20 dark:shadow-none flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400 shrink-0">
              <PenTool className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Tips Produktivitas</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Cara menggunakan aplikasi perkantoran, tools desain, dan shortcut yang mempercepat pekerjaan Anda.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-lg shadow-slate-200/20 dark:shadow-none flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Review & Rekomendasi</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Rekomendasi rakitan PC budget, review aksesori, serta perbandingan spesifikasi perangkat terbaru.</p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA / Contact Section */}
      <section className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-10 text-center shadow-xl text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold mb-4">Ingin berkolaborasi?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Punya tawaran kerja sama, request artikel khusus, atau tertarik menjadi kontributor di TutorinBang? Kami sangat terbuka untuk berdiskusi dengan Anda.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/kontak" className="px-8 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-slate-50 transition-colors shadow-lg">
                Hubungi Kami
              </Link>
              <Link href="/" className="px-8 py-3 bg-blue-700/50 text-white font-medium rounded-full hover:bg-blue-800/60 backdrop-blur-md transition-colors border border-blue-400/30">
                Baca Artikel Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
