"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import DarkModeToggle from "@/components/ui/DarkModeToggle";

type Suggestion = { title: string; slug: string };

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState(-1);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Close on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
        setShowSuggestions(false);
    }, [pathname]);

    // Fetch suggestions with debounce
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (query.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
                if (res.ok) {
                    const data: Suggestion[] = await res.json();
                    setSuggestions(data);
                    setShowSuggestions(data.length > 0);
                    setSelectedIdx(-1);
                }
            } catch { /* silent */ }
        }, 300);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [query]);

    // Close suggestions on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!suggestionsRef.current?.contains(e.target as Node) && !inputRef.current?.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSearch = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            const trimmed = query.trim();
            setShowSuggestions(false);
            router.push(trimmed ? `/tutorial?q=${encodeURIComponent(trimmed)}` : "/tutorial");
            setMobileSearchOpen(false);
        },
        [query, router]
    );

    const handleSuggestionClick = (slug: string) => {
        setShowSuggestions(false);
        setQuery("");
        router.push(`/tutorial/${slug}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIdx((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIdx((i) => Math.max(i - 1, -1));
        } else if (e.key === "Enter" && selectedIdx >= 0) {
            e.preventDefault();
            handleSuggestionClick(suggestions[selectedIdx].slug);
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between gap-4">
                    {/* Logo + Nav */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                        <Link
                            href="/"
                            className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
                        >
                            Tutorin<span className="text-blue-600">Bang</span>
                        </Link>
                        <nav className="hidden md:flex gap-6">
                            {[
                                { href: "/", label: "Beranda" },
                                { href: "/tutorial", label: "Tutorial" },
                                { href: "/tentang", label: "Tentang" },
                            ].map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`text-sm font-medium transition-colors ${isActive(href)
                                        ? "text-blue-600"
                                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600"
                                        }`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2 min-w-0">
                        {/* Desktop search with autocomplete */}
                        <div className="hidden lg:block relative">
                            <form onSubmit={handleSearch} role="search">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                                    <input
                                        ref={inputRef}
                                        type="search"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                        placeholder="Cari tutorial..."
                                        aria-label="Cari tutorial"
                                        aria-autocomplete="list"
                                        aria-expanded={showSuggestions}
                                        className="h-10 pl-10 pr-4 rounded-full bg-slate-100 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 border border-transparent text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all w-52 focus:w-72"
                                    />
                                </div>
                            </form>

                            {/* Suggestion dropdown */}
                            {showSuggestions && (
                                <div
                                    ref={suggestionsRef}
                                    className="absolute top-12 left-0 right-0 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden z-50"
                                    role="listbox"
                                >
                                    {suggestions.map((s, i) => (
                                        <button
                                            key={s.slug}
                                            role="option"
                                            aria-selected={i === selectedIdx}
                                            onClick={() => handleSuggestionClick(s.slug)}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${i === selectedIdx
                                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                                : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                }`}
                                        >
                                            <Search className="w-3.5 h-3.5 inline mr-2 text-slate-400" />
                                            {s.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile search toggle */}
                        <button
                            aria-label={mobileSearchOpen ? "Tutup pencarian" : "Cari tutorial"}
                            onClick={() => {
                                setMobileSearchOpen((p) => !p);
                                setMobileMenuOpen(false);
                                setTimeout(() => mobileInputRef.current?.focus(), 50);
                            }}
                            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                        >
                            {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                        </button>

                        {/* Dark mode toggle */}
                        <DarkModeToggle />

                        {/* GitHub */}
                        <div className="hidden sm:flex items-center border-l border-slate-200 dark:border-slate-700 pl-2 ml-1">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-5 h-5">
                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                            </a>
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
                            onClick={() => { setMobileMenuOpen((p) => !p); setMobileSearchOpen(false); }}
                            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile search bar */}
                {mobileSearchOpen && (
                    <div className="lg:hidden border-t border-slate-100 dark:border-slate-700 px-4 py-3 bg-white dark:bg-slate-900">
                        <form onSubmit={handleSearch} role="search" className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                <input
                                    ref={mobileInputRef}
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Cari tutorial..."
                                    aria-label="Cari tutorial"
                                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-100 dark:bg-slate-700 dark:text-slate-100 border border-transparent text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 h-10 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                Cari
                            </button>
                        </form>
                    </div>
                )}

                {/* Mobile nav */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-4 space-y-1">
                        {[
                            { href: "/", label: "Beranda" },
                            { href: "/tutorial", label: "Tutorial" },
                            { href: "/tentang", label: "Tentang" },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(href)
                                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                )}
            </header>
        </>
    );
}
