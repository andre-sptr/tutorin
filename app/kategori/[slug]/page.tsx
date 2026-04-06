import { getTutorialsFiltered, getCategoryBySlug, getCategories, getStrapiMediaUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Layers, Home, ChevronRight } from "lucide-react";
import Pagination from "@/components/features/Pagination";
import { Suspense } from "react";
import type { StrapiTutorial } from "@/lib/api";

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
    const dataCategories = await getCategories();
    return dataCategories.data.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);
    if (!category) return { title: "Kategori Tidak Ditemukan" };
    return {
        title: `Tutorial ${category.name} - TutorinBang`,
        description: `Kumpulan tutorial dan panduan ${category.name} terlengkap di TutorinBang.`,
    };
}

function TutorialCard({ tutorial }: { tutorial: StrapiTutorial }) {
    const imgUrl = getStrapiMediaUrl(
        tutorial.featuredImage?.formats?.medium?.url ?? tutorial.featuredImage?.url
    );
    return (
        <Link
            href={`/tutorial/${tutorial.slug}`}
            className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
            <div className="aspect-video w-full bg-slate-100 relative overflow-hidden flex items-center justify-center text-slate-300">
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
            <div className="p-4 md:p-6 flex flex-col flex-1">
                <h2 className="text-base md:text-xl font-bold text-slate-900 mb-2 md:mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {tutorial.title}
                </h2>
                <p className="text-slate-600 text-xs md:text-sm line-clamp-2 md:line-clamp-3 mb-3 md:mb-6 flex-1">
                    {tutorial.seo?.metaDescription || `Pelajari selengkapnya tentang ${tutorial.title}.`}
                </p>
                <div className="mt-auto flex items-center text-blue-600 font-semibold text-sm gap-1 group-hover:gap-2 transition-all">
                    Mulai Belajar <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </Link>
    );
}

export default async function KategoriPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { page: pageStr } = await searchParams;
    const page = Math.max(1, Number(pageStr ?? 1));

    const [category, dataTutorials] = await Promise.all([
        getCategoryBySlug(slug),
        getTutorialsFiltered({ category: slug, page }),
    ]);

    if (!category) notFound();

    const tutorials = dataTutorials.data ?? [];
    const { total, pageCount } = dataTutorials.meta.pagination;

    return (
        <main className="min-h-screen py-8 md:py-16 bg-slate-50">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs md:text-sm text-slate-500 mb-4 md:mb-8">
                    <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" />
                        Beranda
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    <Link href="/tutorial" className="hover:text-blue-600 transition-colors">Tutorial</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-blue-600 font-medium capitalize">{category.name}</span>
                </nav>

                {/* Hero */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-16 mb-6 md:mb-12 text-white text-center relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="relative z-10">
                        <Layers className="w-10 h-10 md:w-14 md:h-14 mx-auto mb-3 md:mb-5 text-blue-200" />
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 md:mb-4 capitalize">
                            Tutorial {category.name}
                        </h1>
                        <p className="text-sm md:text-xl text-blue-100 max-w-xl mx-auto">
                            {total} tutorial tersedia dalam kategori ini
                        </p>
                    </div>
                </div>

                {/* Grid */}
                {tutorials.length === 0 ? (
                    <div className="text-center py-24 text-slate-500">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">Belum ada tutorial dalam kategori ini.</p>
                        <Link href="/tutorial" className="mt-4 inline-block text-blue-600 hover:underline font-medium">
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
