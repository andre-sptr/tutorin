import { Code, Users, Lightbulb, Rocket, Target, HeartHandshake } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Tentang Kami - TutorinBang",
  description: "Kenali lebih dekat visi dan misi TutorinBang",
};

export default function TentangPage() {
  return (
    <main className="min-h-screen pb-10 md:pb-20 pt-8 md:pt-16 bg-slate-50 dark:bg-slate-950 overflow-hidden relative">

      {/* Global Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/5 dark:bg-blue-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-400/5 dark:bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Premium Hero Section */}
      <section className="relative container mx-auto px-4 max-w-5xl mb-8 md:mb-24">
        <div className="text-center relative z-10 pt-4 md:pt-10">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-blue-100/50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs md:text-sm mb-3 md:mb-6 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm shadow-sm">
            <Rocket className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600 dark:text-blue-400" />
            <span>Kisah Kami</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 md:mb-8 leading-[1.2] md:leading-[1.15]">
            Membangun Kemandirian <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Menghadapi Kendala Teknologi
            </span>
          </h1>
          <p className="text-sm md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Berawal dari seringnya melihat kebingungan mahasiswa saat menghadapi masalah device sehari-hari, kami merintis <strong className="text-slate-900 dark:text-slate-200">TutorinBang</strong> sebagai pusat tutorial troubleshoot yang ramah dan mudah dipahami.
          </p>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="container mx-auto px-4 max-w-5xl mb-10 md:mb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 items-start">

          <div className="bg-white dark:bg-slate-900/80 p-5 md:p-8 rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-2 transition-transform duration-300 group backdrop-blur-xl">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4 md:mb-8 transform -rotate-3 group-hover:rotate-0 transition-transform duration-300 border border-blue-100 dark:border-blue-800/50 shadow-sm">
              <Code className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-4">Solusi Menyeluruh</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
              Fokus pada penyediaan solusi praktis untuk berbagai masalah hardware dan software yang paling sering dialami oleh user dalam aktivitas sehari-hari.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-5 md:p-8 rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-2 transition-transform duration-300 group mt-0 md:mt-10 backdrop-blur-xl">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4 md:mb-8 transform rotate-3 group-hover:rotate-0 transition-transform duration-300 border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
              <Users className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-4">Bahasa Lokal</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
              Ditulis dengan gaya bahasa membumi dan santai, agar setiap langkah troubleshoot dapat diikuti oleh siapa saja tanpa hambatan istilah teknis asing yang rumit.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-5 md:p-8 rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-2 transition-transform duration-300 group mt-0 md:mt-20 backdrop-blur-xl">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4 md:mb-8 transform -rotate-3 group-hover:rotate-0 transition-transform duration-300 border border-purple-100 dark:border-purple-800/50 shadow-sm">
              <Lightbulb className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-4">Selalu Relevan</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
              Setiap saat kami memantau tren kendala teknologi terbaru, untuk menjamin solusi yang kami berikan selalu relevan dengan pembaruan sistem masa kini.
            </p>
          </div>

        </div>
      </section>

      {/* Visi & Misi Content Container */}
      <section className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="bg-white dark:bg-slate-900/90 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 lg:p-16 border border-slate-200/80 dark:border-slate-800/90 shadow-2xl relative overflow-hidden">
          {/* Minimalist Watermark */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent dark:from-blue-600/10 rounded-bl-full pointer-events-none" />

          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8 relative">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center rounded-xl shadow-lg shadow-blue-600/30 dark:shadow-none border border-blue-500">
              <Target className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Visi & Misi</h2>
          </div>

          <div className="prose prose-sm md:prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 relative">
            <p className="lead text-base md:text-xl font-medium text-slate-800 dark:text-slate-200 mb-4 md:mb-8">
              Solusi perbaikan hardware dan software tidak seharusnya menjadi rahasia yang tersembunyi di balik buku manual yang membosankan.
            </p>
            <p>
              <strong>Visi kami</strong> adalah menjadi tempat persinggahan utama bagi masyarakat Indonesia saat menghadapi kendala teknologi. Entah Anda adalah seorang mahasiswa yang panik karena tugas tidak bisa disimpan, maupun pekerja profesional yang kesulitan mengatur koneksi internet di rumah.
            </p>
            <p>
              Melalui tulisan kami, kami membawa <strong>misi</strong> untuk menyajikan proses perbaikan sekompleks apapun ke dalam artikel yang ringan, langsung bisa dipraktikkan <em>(hands-on)</em>, dan pastinya bisa untuk dilakukan secara mandiri.
            </p>

            <hr className="my-12 border-slate-200 dark:border-slate-800/80" />

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-8 border border-slate-100 dark:border-slate-700/50 shadow-inner mt-8">
              <div className="w-16 h-16 shrink-0 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-800">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0 mb-2">Punya Pertanyaan atau Ide?</h3>
                <p className="mb-0 text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
                  Punya pengalaman unik saat mengatasi error device? Ingin request tutorial tertentu? Atau tawaran kerja sama? Jangan ragu mengirimkan pesan ke kotak masuk kami!
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
