"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { SavedArticle } from "@/components/article/BookmarkButton";
import Link from "next/link";
import { Bookmark, Trash2, ArrowRight } from "lucide-react";

export default function SavedArticlesPage() {
    const [savedArticles, setSavedArticles] = useLocalStorage<SavedArticle[]>("tutorinbang_saved", []);

    const removeArticle = (slug: string) => {
        setSavedArticles(savedArticles.filter(a => a.slug !== slug));
    };

    return (
        <main className="min-h-screen py-8 md:py-16 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex items-center gap-3 mb-8 md:mb-12">
                    <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-xl">
                        <Bookmark className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Daftar Bacaan Saya</h1>
                        <p className="text-slate-500 dark:text-slate-400">Artikel yang Anda simpan untuk dibaca nanti.</p>
                    </div>
                </div>

                {savedArticles.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
                        <Bookmark className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Belum Ada Artikel Tersimpan</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">Anda belum mem-bookmark artikel apapun. Mulai jelajahi tutorial kami!</p>
                        <Link href="/tutorial" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
                            Cari Tutorial <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {savedArticles.map((article) => (
                            <div key={article.slug} className="flex items-center justify-between p-4 md:p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex-1 min-w-0 pr-4">
                                    {article.categoryName && (
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 block">
                                            {article.categoryName}
                                        </span>
                                    )}
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                                        <Link href={`/tutorial/${article.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                            {article.title}
                                        </Link>
                                    </h3>
                                </div>
                                <button 
                                    onClick={() => removeArticle(article.slug)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                    title="Hapus"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
