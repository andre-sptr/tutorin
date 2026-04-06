"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
    const pathname = usePathname();
    const totalWordsRef = useRef(0);
    const isArticlePage = pathname.startsWith("/tutorial/") && pathname !== "/tutorial/";

    // Estimate total words on mount for article pages
    useEffect(() => {
        if (!isArticlePage) {
            setTimeRemaining(null);
            return;
        }
        const articleEl = document.getElementById("article-content");
        if (articleEl) {
            const text = articleEl.innerText || articleEl.textContent || "";
            totalWordsRef.current = text.trim().split(/\s+/).filter(Boolean).length;
        }
    }, [pathname, isArticlePage]);

    useEffect(() => {
        const updateProgress = () => {
            const currentScroll = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight <= 0) { setProgress(0); return; }

            const pct = Math.min(100, (currentScroll / scrollHeight) * 100);
            setProgress(pct);

            // Update time remaining (only on article pages)
            if (isArticlePage && totalWordsRef.current > 0) {
                const wordsRemaining = totalWordsRef.current * (1 - pct / 100);
                const minutesLeft = Math.max(0, Math.ceil(wordsRemaining / 200));
                setTimeRemaining(minutesLeft === 0 ? "Selesai dibaca" : `~${minutesLeft} mnt tersisa`);
            }
        };

        window.addEventListener("scroll", updateProgress, { passive: true });
        updateProgress();
        return () => window.removeEventListener("scroll", updateProgress);
    }, [isArticlePage]);

    return (
        <>
            {/* Progress bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[60] pointer-events-none">
                <div
                    className="h-full bg-blue-600 transition-all duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Time remaining badge — only on article pages when scrolled */}
            {isArticlePage && timeRemaining && progress > 5 && (
                <div className="fixed bottom-16 md:bottom-20 right-4 md:right-6 z-40 pointer-events-none">
                    <div className="bg-slate-900/80 dark:bg-slate-700/90 text-white text-xs font-medium px-2.5 md:px-3 py-1 md:py-1.5 rounded-full backdrop-blur-sm shadow-lg">
                        {timeRemaining}
                    </div>
                </div>
            )}
        </>
    );
}
