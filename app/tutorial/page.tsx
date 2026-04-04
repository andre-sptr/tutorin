import { getTutorialsFiltered, getCategories, getStrapiMediaUrl } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowRight, BookOpen, Layers, GraduationCap } from "lucide-react";
import TutorialFilter from "@/components/features/TutorialFilter";
import Pagination from "@/components/features/Pagination";
import type { StrapiTutorial } from "@/lib/api";

export const metadata = {
    title: "Semua Tutorial - TutorinBang",
    description: "Jelajahi semua artikel tutorial seputar teknologi dan tips komputer di TutorinBang.",
};

type PageProps = {
    searchParams: Promise<{ q?: string; category?: string; page?: string }>;
};

function TutorialCard({ tutorial }: { tutorial: StrapiTutorial }) {
    const imgUrl = getStrapiMediaUrl(
        tutorial.featuredImage?.formats?.medium?.url ?? tutorial.featuredImage?.url
    );
    return (
        <Link
            href={`/tutorial/${tutorial.slug}`}
            className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
            <div className="aspect-video w-full bg-slate-100 dark:bg-slate-700 relative overflow-hidden flex items-center justify-center text-slate-300">
                {imgUrl ? (
                    <Image
                        src={imgUrl}
                        alt={tutorial.featuredImage?.alternativeText || tutorial.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <BookOpen className="w-12 h-12 opacity-50 block transform group-hover:scale-110 transition-transform duration-500" />
                )}
            </div>
            <div className="p-6 flex flex-col flex-1">
                {tutorial.category && (
                    <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full mb-4 w-fit">
                        {tutorial.category.name}
                    </span>
                )}
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tutorial.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                    {tutorial.seo?.metaDescription ||
                        `Pelajari selengkapnya tentang ${tutorial.title} dalam panduan komprehensif ini.`}
                </p>
                <div className="mt-auto flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm gap-1 group-hover:gap-2 transition-all">
                    Mulai Belajar <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </Link>
    );
}

export default async function TutorialIndexPage({ searchParams }: PageProps) {
    const resolved = await searchParams;
    const q = resolved.q?.trim() ?? "";
    const category = resolved.category?.trim() ?? "";
    const page = Math.max(1, Number(resolved.page ?? 1));

    const [dataTutorials, dataCategories] = await Promise.all([
        getTutorialsFiltered({ q: q || undefined, category: category || undefined, page }),
        getCategories(),
    ]);

    const tutorials = dataTutorials.data ?? [];
    const categories = dataCategories.data ?? [];
    const { total, pageCount } = dataTutorials.meta.pagination;

    return (
        <main className="min-h-screen py-16 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Premium Hero Header */}
                <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-14 mb-14 border border-slate-200/60 dark:border-slate-800/80 shadow-2xl overflow-hidden group">
                    {/* Abstract Background Glows */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-400/30 transition-colors duration-700 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 group-hover:bg-indigo-400/30 transition-colors duration-700 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold text-sm mb-6 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm shadow-sm">
                                <GraduationCap className="w-4 h-4" />
                                <span>Pusat Pembelajaran</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.15]">
                                Eksplorasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Tutorial</span>
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Temukan panduan praktis, tips komprehensif, dan wawasan mendalam untuk menguasai teknologi serta menyelesaikan masalah komputer Anda.
                            </p>
                        </div>
                        
                        {/* Decorative Graphic (Hidden on small screens) */}
                        <div className="hidden lg:flex relative w-64 h-64 items-center justify-center shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-3xl transform rotate-3 scale-105 border border-white/50 dark:border-slate-600 shadow-inner transition-transform duration-500 group-hover:rotate-6" />
                            <div className="absolute inset-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-3xl transform -rotate-3 border border-slate-200 dark:border-slate-700 shadow-xl flex items-center justify-center flex-col gap-4 overflow-hidden transition-transform duration-500 group-hover:-rotate-6">
                                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
                                <div className="p-4 bg-blue-50 dark:bg-slate-700/50 rounded-2xl">
                                    <Layers className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="text-center">
                                    <div className="font-extrabold text-slate-900 dark:text-white text-3xl">{total}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">Artikel</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <Suspense fallback={<div className="h-32 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl mb-10" />}>
                    <TutorialFilter categories={categories} totalCount={total} />
                </Suspense>

                {/* Grid */}
                {tutorials.length === 0 ? (
                    <div className="text-center py-24 text-slate-500 dark:text-slate-400">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">
                            {q || category
                                ? "Tidak ada tutorial yang cocok dengan filter ini."
                                : "Belum ada tutorial yang dipublikasikan saat ini."}
                        </p>
                        {(q || category) && (
                            <Link href="/tutorial" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                Lihat semua tutorial →
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tutorials.map((tutorial) => (
                                <TutorialCard key={tutorial.documentId || tutorial.id} tutorial={tutorial} />
                            ))}
                        </div>
                        <Suspense fallback={null}>
                            <Pagination currentPage={page} totalPages={pageCount} />
                        </Suspense>
                    </>
                )}
            </div>
        </main>
    );
}
