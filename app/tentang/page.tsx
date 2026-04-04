import { Code, Users, Lightbulb, Rocket, Target, HeartHandshake } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Tentang Kami - TutorinBang",
  description: "Kenali lebih dekat visi dan misi TutorinBang",
};

export default function TentangPage() {
  return (
    <main className="min-h-screen pb-20 pt-16 bg-slate-50 dark:bg-slate-950 overflow-hidden relative">

      {/* Global Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/5 dark:bg-blue-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-400/5 dark:bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Premium Hero Section */}
      <section className="relative container mx-auto px-4 max-w-5xl mb-24">
        <div className="text-center relative z-10 pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-sm mb-6 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm shadow-sm">
            <Rocket className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Kisah Kami</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.15]">
            Membangun Masa Depan <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Talenta Digital Lokal
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Berawal dari keinginan untuk memiliki platform referensi bahasa Indonesia yang setara dengan publikasi teknologi internasional, kami merintis <strong className="text-slate-900 dark:text-slate-200">TutorinBang</strong>.
          </p>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="container mx-auto px-4 max-w-5xl mb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">

          <div className="bg-white dark:bg-slate-900/80 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-2 transition-transform duration-300 group backdrop-blur-xl">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-8 transform -rotate-3 group-hover:rotate-0 transition-transform duration-300 border border-blue-100 dark:border-blue-800/50 shadow-sm">
              <Code className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Teknologi Terkini</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
              Fokus pada adopsi web modern seperti Next.js, React, TypeScript, dan Headless CMS yang relevan dengan kebutuhan industri global saat ini.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-2 transition-transform duration-300 group mt-0 md:mt-10 backdrop-blur-xl">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-8 transform rotate-3 group-hover:rotate-0 transition-transform duration-300 border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Untuk Komunitas</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
              Ditulis oleh engineer lokal, untuk membantu talenta pemrograman nusantara tanpa hambatan semantik terjemahan dan gaya bahasa yang kaku.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-2 transition-transform duration-300 group mt-0 md:mt-20 backdrop-blur-xl">
            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-8 transform -rotate-3 group-hover:rotate-0 transition-transform duration-300 border border-purple-100 dark:border-purple-800/50 shadow-sm">
              <Lightbulb className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Evolusi Skuler</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
              Setiap bulannya kami meneruskan tren arsitektur baru, untuk menjamin pengetahuan Anda selalu diperbarui. Praktik terbaik adalah komitmen kami.
            </p>
          </div>

        </div>
      </section>

      {/* Visi & Misi Content Container */}
      <section className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="bg-white dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] p-10 md:p-16 border border-slate-200/80 dark:border-slate-800/90 shadow-2xl relative overflow-hidden">
          {/* Minimalist Watermark */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent dark:from-blue-600/10 rounded-bl-full pointer-events-none" />

          <div className="flex items-center gap-4 mb-8 relative">
            <div className="w-12 h-12 bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center rounded-xl shadow-lg shadow-blue-600/30 dark:shadow-none border border-blue-500">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Visi & Misi</h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 relative">
            <p className="lead text-xl font-medium text-slate-800 dark:text-slate-200 mb-8">
              Pengetahuan teknis tingkat lanjut tidak seharusnya menjadi rahasia yang tersembunyi di balik terminologi rumit.
            </p>
            <p>
              <strong>Visi kami</strong> adalah menjadi tempat persinggahan utama bagi setiap kreator dan pengembang web di Indonesia. Entah Anda adalah junior pemula yang masih mencoba memahami state pada React, maupun <em>engineer senior</em> yang sedang merancang arsitektur micro-frontend skala besar.
            </p>
            <p>
              Melalui tulisan kami, kami membawa <strong>misi</strong> untuk menyajikan topik rekayasa perangkat lunak sekompleks apapun ke dalam modul-modul yang ringan, langsung bekerja <em>(hands-on)</em>, namun tetap dalam koridor standar pemrograman pro-level.
            </p>

            <hr className="my-12 border-slate-200 dark:border-slate-800/80" />

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-8 border border-slate-100 dark:border-slate-700/50 shadow-inner mt-8">
              <div className="w-16 h-16 shrink-0 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-800">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0 mb-2">Mari Berkolaborasi!</h3>
                <p className="mb-0 text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
                  Punya insight ide tutorial menarik? Kesulitan konfigurasi API? Atau sekedar tawaran kolaborasi iklan? Jangan ragu mengirimkan ping digital ke kotak masuk kami.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
