"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTransition, useCallback } from "react";

type Props = {
    currentPage: number;
    totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const goToPage = useCallback(
        (page: number) => {
            const params = new URLSearchParams(searchParams.toString());
            if (page === 1) {
                params.delete("page");
            } else {
                params.set("page", String(page));
            }
            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`, { scroll: true });
            });
        },
        [router, pathname, searchParams]
    );

    if (totalPages <= 1) return null;

    const getPages = (): (number | "...")[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages: (number | "...")[] = [1];
        if (currentPage > 3) pages.push("...");
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    const pages = getPages();

    return (
        <nav
            aria-label="Pagination"
            className={`flex justify-center items-center gap-1 md:gap-1.5 mt-8 md:mt-14 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
        >
            {/* Prev */}
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Halaman sebelumnya"
                className="flex items-center gap-1 px-2 md:px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Page numbers */}
            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => goToPage(p as number)}
                        aria-label={`Halaman ${p}`}
                        aria-current={p === currentPage ? "page" : undefined}
                        className={`w-8 h-8 md:w-9 md:h-9 rounded-xl text-sm font-semibold border transition-all ${p === currentPage
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600"
                            }`}
                    >
                        {p}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Halaman berikutnya"
                className="flex items-center gap-1 px-2 md:px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </nav>
    );
}
