"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    const handleScroll = useCallback(() => {
        setVisible(window.scrollY > 300);
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="Kembali ke atas"
            className={`fixed bottom-6 right-20 z-30 w-11 h-11 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                }`}
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
}
