import { getTutorialsByTag, getTagBySlug, getTags, getStrapiMediaUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Hash, Home, ChevronRight } from "lucide-react";
import Pagination from "@/components/features/Pagination";
import { Suspense } from "react";
import type { StrapiTutorial } from "@/lib/api";

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
    const dataTags = await getTags();
    return dataTags.data.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const tag = await getTagBySlug(slug);
    if (!tag) return { title: "Tag Tidak Ditemukan" };
    return {
        title: `Tutorial #${tag.name} - TutorinBang`,
        description: `Kumpulan tutorial dan panduan bertag "${tag.name}" di TutorinBang.`,
    };
}

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
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                ) : (
                    <BookOpen className="w-8 h-8 md:w-12 md:h-12 opacity-50 block transform group-hover:scale-110 transition-transform duration-500" />
                )}
            </div>
            <div className="p-4 md:p-6 flex flex-col flex-1">
                {tutorial.category && (
                    <span className="inline-block px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full mb-2 w-fit">
                        {tutorial.category.name}
                    </span>
                )}
                <h2 className="text-base md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tutorial.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm line-clamp-2 md:line-clamp-3 mb-3 md:mb-6 flex-1">
                    {tutorial.seo?.metaDescription || `Pelajari selengkapnya tentang ${tutorial.title}.`}
                </p>
                <div className="mt-auto flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm gap-1 group-hover:gap-2 transition-all">
                    Mulai Belajar <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </Link>
    );
}

export default async function TagPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { page: pageStr } = await searchParams;
    const page = Math.max(1, Number(pageStr ?? 1));

    const [tag, dataTutorials] = await Promise.all([
        getTagBySlug(slug),
        getTutorialsByTag(slug, page),
    ]);

    if (!tag) notFound();

    const tutorials = dataTutorials.data ?? [];
    const { total, pageCount } = dataTutorials.meta.pagination;

    return (
        <main className="min-h-screen py-8 md:py-16 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-4 md:mb-8">
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" />
                        Beranda
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                    <Link href="/tutorial" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tutorial</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                    <span className="text-blue-600 dark:text-blue-400 font-medium">#{tag.name}</span>
                </nav>

                {/* Hero */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-700 dark:to-purple-800 rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-16 mb-6 md:mb-12 text-white text-center relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 bg-white/20 rounded-2xl mb-3 md:mb-5 shadow-inner">
                            <Hash className="w-5 h-5 md:w-7 md:h-7 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 md:mb-4">
                            #{tag.name}
                        </h1>
                        <p className="text-sm md:text-xl text-indigo-100 max-w-xl mx-auto">
                            {total} tutorial tersedia dengan tag ini
                        </p>
                    </div>
                </div>

                {/* Grid */}
                {tutorials.length === 0 ? (
                    <div className="text-center py-16 md:py-24 text-slate-500 dark:text-slate-400">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">Belum ada tutorial dengan tag ini.</p>
                        <Link href="/tutorial" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            Lihat semua tutorial →
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
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
