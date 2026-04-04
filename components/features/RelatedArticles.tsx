import { getStrapiMediaUrl, type StrapiTutorial } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight } from "lucide-react";

type Props = {
    articles: StrapiTutorial[];
};

export default function RelatedArticles({ articles }: Props) {
    if (!articles || articles.length === 0) return null;

    return (
        <section className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                Artikel Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {articles.map((article) => {
                    const imgUrl = getStrapiMediaUrl(
                        article.featuredImage?.formats?.small?.url ?? article.featuredImage?.url
                    );
                    return (
                        <Link
                            key={article.documentId || article.id}
                            href={`/tutorial/${article.slug}`}
                            className="group flex flex-col bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200 overflow-hidden"
                        >
                            <div className="aspect-video w-full bg-slate-200 dark:bg-slate-700 relative overflow-hidden flex items-center justify-center">
                                {imgUrl ? (
                                    <Image
                                        src={imgUrl}
                                        alt={article.featuredImage?.alternativeText || article.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 640px) 100vw, 33vw"
                                    />
                                ) : (
                                    <BookOpen className="w-8 h-8 text-slate-300" />
                                )}
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                                    {article.title}
                                </h3>
                                <div className="mt-auto flex items-center gap-1 text-xs text-blue-600 font-semibold">
                                    Baca <ArrowRight className="w-3 h-3" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
