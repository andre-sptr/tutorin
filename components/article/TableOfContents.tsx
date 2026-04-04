"use client";

import { useEffect, useState } from "react";
import { Link2 } from "lucide-react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Cari semua heading di konten artikel, asumsikan konten ada dalam id="article-content"
    const articleContainer = document.getElementById("article-content");
    if (!articleContainer) return;

    const elements = Array.from(articleContainer.querySelectorAll("h2, h3"));
    const headingData = elements.map((el) => {
      // Jika belum punya ID, buatkan otomatis
      if (!el.id) {
        el.id = el.textContent?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || `heading-${Math.random().toString(36).substr(2, 9)}`;
      }
      return {
        id: el.id,
        text: el.textContent || "",
        level: Number(el.tagName.replace("H", "")),
      };
    });

    setHeadings(headingData);

    // Setup intersection observer for scrollspy
    const callback = (entries: IntersectionObserverEntry[]) => {
      const visibleHeadings = entries.filter(entry => entry.isIntersecting);
      if (visibleHeadings.length > 0) {
        // Ambil yang paling atas
        setActiveId(visibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "0px 0px -80% 0px"
    });

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-8 sticky top-24">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-4">
        <Link2 className="w-4 h-4 text-blue-500" />
        Daftar Isi
      </h3>
      <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`block text-sm transition-colors duration-200 ${
              h.level === 3 ? "pl-4" : "pl-0"
            } ${
              activeId === h.id 
                ? "text-blue-600 font-semibold" 
                : "text-slate-600 hover:text-slate-900"
            } py-1`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
