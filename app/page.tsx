// app/page.tsx
import { getTutorials, getStrapiMediaUrl } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Rocket, Terminal, Zap } from "lucide-react";

export default async function Home() {
  const dataTutorials = await getTutorials();
  const tutorials = dataTutorials.data || [];
  // Take top 6 tutorials for the homepage specifically
  const recentTutorials = tutorials.slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden relative">

      {/* Dynamic Background Glow */}
      <div className="absolute top-0 inset-x-0 h-[800px] w-full bg-gradient-to-b from-blue-50/80 via-slate-50 to-slate-50 dark:from-blue-950/20 dark:via-slate-950 dark:to-slate-950 pointer-events-none -z-10" />
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/4" />
      <div className="absolute top-40 left-0 w-[600px] h-[600px] bg-indigo-400/10 dark:bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -z-10 -translate-x-1/3" />

      {/* Editor's Pick Grid */}
      <section className="container mx-auto px-4 max-w-7xl py-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
              Publikasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Terbaru</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Jelajahi panduan troubleshoot masalah yang disusun khusus agar mudah dipraktikkan langsung oleh Anda.
            </p>
          </div>
          <Link href="/tutorial" className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group shadow-sm hover:shadow-md">
            Lihat Semua
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentTutorials.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-900/50 rounded-[3rem] p-16 text-center border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
              <BookOpen className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Belum Ada Publikasi</h3>
              <p className="text-lg text-slate-500 dark:text-slate-400">Konten edukatif sedang dipersiapkan oleh tim editor kami.</p>
            </div>
          ) : (
            recentTutorials.map((tutorial, index) => {
              const imgUrl = getStrapiMediaUrl(
                tutorial.featuredImage?.formats?.medium?.url ?? tutorial.featuredImage?.url
              );

              // Make the first item take up 2 columns on large screens for a "featured" layout look
              const isFeatured = index === 0;

              return (
                <Link
                  href={`/tutorial/${tutorial.slug}`}
                  key={tutorial.documentId || tutorial.id}
                  className={`group flex flex-col bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-[2rem] border border-slate-200/60 dark:border-slate-800/80 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-2 transition-all duration-300 overflow-hidden ${isFeatured ? 'lg:col-span-2 lg:flex-row' : ''}`}
                >
                  <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 ${isFeatured ? 'w-full lg:w-1/2 aspect-video lg:aspect-auto h-full shrink-0' : 'aspect-video w-full'}`}>
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={tutorial.featuredImage?.alternativeText || tutorial.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                        priority={isFeatured}
                      />
                    ) : (
                      <BookOpen className={`opacity-40 block transform group-hover:scale-110 transition-transform duration-500 ${isFeatured ? 'w-24 h-24' : 'w-12 h-12'}`} />
                    )}
                    {/* Subtle gradient overlay to give depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className={`flex flex-col flex-1 p-8 md:p-10 ${isFeatured ? 'lg:w-1/2 justify-center' : ''}`}>
                    {tutorial.category && (
                      <span className="inline-flex items-center px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-widest rounded-full mb-6 w-fit border border-blue-100 dark:border-blue-800/50 shadow-sm">
                        {tutorial.category.name}
                      </span>
                    )}

                    <h2 className={`font-extrabold text-slate-900 dark:text-white mb-4 line-clamp-2 leading-[1.25] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${isFeatured ? 'text-3xl lg:text-4xl' : 'text-2xl'}`}>
                      {tutorial.title}
                    </h2>

                    <p className={`text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-1 ${isFeatured ? 'line-clamp-4 text-lg' : 'line-clamp-3 text-base'}`}>
                      {tutorial.seo?.metaDescription || `Pelajari selengkapnya tentang ${tutorial.title} dalam panduan teknis yang ringkas dan padat ini.`}
                    </p>

                    <div className="mt-auto flex items-center text-blue-600 dark:text-blue-400 font-extrabold text-sm gap-2 group-hover:gap-3 transition-all">
                      Baca Panduan <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* Hero Section */}
      <section className="container mx-auto px-4 max-w-7xl pt-12 pb-12 md:pt-32 md:pb-28 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-sm mb-8 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm shadow-sm animate-pulse-slow">
          <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Pusat Solusi Masalah Anda</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.15] max-w-5xl mx-auto drop-shadow-sm">
          Kuasai Teknologi dengan <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Panduan Terstruktur
          </span>
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          TutorinBang membantu Anda mengatasi berbagai kendala hardware dan software sehari-hari. Temukan langkah-langkah perbaikan yang mudah dipahami oleh siapa saja.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/tutorial" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-all duration-300 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group hover:-translate-y-1">
            <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            Cari Solusi Sekarang
          </Link>
          <Link href="/tentang" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-2 group hover:-translate-y-1">
            <Terminal className="w-5 h-5" />
            Visi & Misi Kami
          </Link>
        </div>
      </section>

      {/* Stats/Feature Ribbon */}
      <section className="border-y border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-4 max-w-7xl py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-200 dark:divide-slate-800/80">
            <div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">100%</div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Akses Gratis</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Step-by-step</div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Terstruktur</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Sederhana</div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Mudah Dipahami</div>
            </div>
            <div className="border-t md:border-t-0 border-slate-200 dark:border-slate-800/80 pt-8 md:pt-0 col-span-2 md:col-span-1">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Lokal</div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Bahasa Indonesia</div>
            </div>
          </div>
        </div>
      </section>

      {/* Massive CTA Bottom */}
      <section className="container mx-auto px-4 max-w-6xl pb-12 pt-12 relative z-10">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20 group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-white/20 transition-colors duration-700 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/3 group-hover:bg-blue-300/30 transition-colors duration-700 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <Rocket className="w-16 h-16 text-white/90 mb-8" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
              Kendala Error <br className="hidden md:block" /> Menghambat Aktivitas?
            </h2>
            <p className="text-xl text-blue-50/90 max-w-2xl mx-auto mb-12 leading-relaxed">
              Jangan panik dulu! Temukan berbagai panduan troubleshoot sederhana yang bisa Anda praktikkan sendiri. Hemat waktu, tenaga, dan selesaikan masalah dengan cepat.
            </p>
            <Link href="/tutorial" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white hover:bg-slate-50 text-blue-700 font-extrabold text-lg transition-transform hover:-translate-y-1 shadow-xl shadow-black/10 group">
              Temukan Solusinya
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}