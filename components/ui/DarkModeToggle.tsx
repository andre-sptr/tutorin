"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Read saved preference or system preference
        const saved = localStorage.getItem("theme");
        if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggle = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        if (newDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    // Prevent hydration mismatch
    if (!mounted) return <div className="w-9 h-9" />;

    return (
        <button
            onClick={toggle}
            aria-label={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
        >
            {isDark ? (
                <Sun className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            ) : (
                <Moon className="w-[18px] h-[18px]" />
            )}
        </button>
    );
}
