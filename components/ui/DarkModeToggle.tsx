"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

const THEME_CHANGE_EVENT = "themechange";

function getStoredTheme() {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

function subscribeTheme(onStoreChange: () => void) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    window.addEventListener("storage", onStoreChange);
    window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
    media.addEventListener("change", onStoreChange);

    return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
        media.removeEventListener("change", onStoreChange);
    };
}

function applyTheme(isDark: boolean) {
    document.documentElement.classList.toggle("dark", isDark);
}

export default function DarkModeToggle() {
    const isDark = useSyncExternalStore(subscribeTheme, getStoredTheme, () => false);

    useEffect(() => {
        applyTheme(isDark);
    }, [isDark]);

    const toggle = () => {
        const newDark = !isDark;
        applyTheme(newDark);
        localStorage.setItem("theme", newDark ? "dark" : "light");
        window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    };

    return (
        <button
            onClick={toggle}
            aria-label={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
        >
            {isDark ? (
                <Sun className="w-[18px] h-[18px]" />
            ) : (
                <Moon className="w-[18px] h-[18px]" />
            )}
        </button>
    );
}
