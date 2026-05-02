"use client";

import { useState, useEffect } from "react";
import { Maximize, Minimize } from "lucide-react";

export default function ZenModeToggle() {
    const [isZenMode, setIsZenMode] = useState(false);

    useEffect(() => {
        if (isZenMode) {
            document.documentElement.classList.add("zen-mode");
        } else {
            document.documentElement.classList.remove("zen-mode");
        }
        
        return () => {
            document.documentElement.classList.remove("zen-mode");
        };
    }, [isZenMode]);

    return (
        <button
            onClick={() => setIsZenMode(!isZenMode)}
            className={`p-2 rounded-full transition-colors flex items-center gap-2 ${isZenMode ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"}`}
            title={isZenMode ? "Matikan Mode Fokus" : "Mode Fokus (Zen Mode)"}
        >
            {isZenMode ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            <span className="text-sm font-semibold hidden sm:inline">Fokus</span>
        </button>
    );
}
