"use client";

import { Bookmark } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type SavedArticle = {
    slug: string;
    title: string;
    categoryName?: string;
};

export default function BookmarkButton({ tutorial }: { tutorial: SavedArticle }) {
    const [savedArticles, setSavedArticles] = useLocalStorage<SavedArticle[]>("tutorinbang_saved", []);
    const isSaved = savedArticles.some(a => a.slug === tutorial.slug);

    const toggleSave = () => {
        if (isSaved) {
            setSavedArticles(savedArticles.filter(a => a.slug !== tutorial.slug));
        } else {
            setSavedArticles([...savedArticles, tutorial]);
        }
    };

    return (
        <button
            onClick={toggleSave}
            className={`p-2 rounded-full transition-colors flex items-center gap-2 ${isSaved ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"}`}
            title={isSaved ? "Hapus dari Tersimpan" : "Simpan Artikel"}
        >
            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            <span className="text-sm font-semibold hidden sm:inline">{isSaved ? "Tersimpan" : "Simpan"}</span>
        </button>
    );
}
