"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition, useRef, useEffect, useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import type { StrapiCategory } from "@/lib/api";

type Props = {
    categories: StrapiCategory[];
    totalCount: number;
    currentPage?: number;
    totalPages?: number;
};

export default function TutorialFilter({ categories, totalCount }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [localQ, setLocalQ] = useState(searchParams.get("q") ?? "");

    const currentQ = searchParams.get("q") ?? "";
    const currentCategory = searchParams.get("category") ?? "";

    // Sync input if URL param changes externally (e.g. Header search)
    useEffect(() => {
        setLocalQ(currentQ);
        if (inputRef.current) inputRef.current.value = currentQ;
    }, [currentQ]);

    const updateParams = useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());
            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === "") {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            });
            params.delete("page");
            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`, { scroll: false });
            });
        },
        [searchParams, pathname, router]
    );

    // Debounced search — fires 450ms after user stops typing
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalQ(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            updateParams({ q: val.trim() || null });
        }, 450);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (debounceRef.current) clearTimeout(debounceRef.current);
        updateParams({ q: localQ.trim() || null });
    };

    const handleClear = () => {
        setLocalQ("");
        if (inputRef.current) inputRef.current.value = "";
        if (debounceRef.current) clearTimeout(debounceRef.current);
        updateParams({ q: null });
    };

    // Cleanup debounce on unmount
    useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

    const hasActiveFilter = currentQ || currentCategory;

    return (
        <div className="mb-10 space-y-5">
            {/* Search bar with debounce */}
            <form onSubmit={handleSearchSubmit} className="relative" role="search">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                    ref={inputRef}
                    type="search"
                    value={localQ}
                    onChange={handleSearchChange}
                    placeholder="Cari tutorial..."
                    aria-label="Cari tutorial"
                    className="w-full h-12 pl-11 pr-24 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {localQ && (
                        <button
                            type="button"
                            onClick={handleClear}
                            aria-label="Hapus pencarian"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    <button
                        type="submit"
                        className="h-8 px-4 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Cari
                    </button>
                </div>
            </form>

            {/* Category filter pills */}
            {categories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Kategori:
                    </span>
                    <button
                        onClick={() => updateParams({ category: null })}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${!currentCategory
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600"
                            }`}
                    >
                        Semua
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.documentId}
                            onClick={() =>
                                updateParams({
                                    category: currentCategory === cat.slug ? null : cat.slug,
                                })
                            }
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${currentCategory === cat.slug
                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Status bar */}
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>
                    {isPending ? (
                        <span className="animate-pulse">Memuat...</span>
                    ) : (
                        <>
                            Menampilkan{" "}
                            <span className="font-semibold text-slate-700">{totalCount}</span>{" "}
                            tutorial
                            {currentQ && (
                                <>
                                    {" "}untuk{" "}
                                    <span className="font-semibold text-blue-600">
                                        &ldquo;{currentQ}&rdquo;
                                    </span>
                                </>
                            )}
                            {currentCategory && (
                                <>
                                    {" "}dalam kategori{" "}
                                    <span className="font-semibold text-blue-600 capitalize">
                                        {currentCategory}
                                    </span>
                                </>
                            )}
                        </>
                    )}
                </span>
                {hasActiveFilter && (
                    <button
                        onClick={() => updateParams({ q: null, category: null })}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                        Hapus filter
                    </button>
                )}
            </div>
        </div>
    );
}
