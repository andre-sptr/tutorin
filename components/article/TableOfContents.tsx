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
    const articleContainer = document.getElementById("article-content");
    if (!articleContainer) return;

    const elements = Array.from(articleContainer.querySelectorAll("h2, h3"));
    const headingData = elements.map((el) => {
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

    const callback = (entries: IntersectionObserverEntry[]) => {
      const visibleHeadings = entries.filter(entry => entry.isIntersecting);
      if (visibleHeadings.length > 0) {
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
    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 md:p-5 rounded-xl border border-slate-100 dark:border-slate-800 mb-6 md:mb-8 sticky top-24 backdrop-blur-xl">
      <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3 md:mb-4">
        <Link2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
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
            className={`block text-sm transition-colors duration-200 ${h.level === 3 ? "pl-4" : "pl-0"
              } ${activeId === h.id
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
