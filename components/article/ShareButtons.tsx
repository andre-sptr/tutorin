"use client";

import { Link as LinkIcon, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal copy link", err);
    }
  };

  const shareText = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url);

  return (
    <div className="flex items-center gap-3 mt-6 mb-8 border-y border-slate-100 dark:border-slate-800 py-4">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Bagikan:</span>
      
      <a 
        href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-700 dark:hover:text-blue-400 transition-colors flex items-center justify-center w-9 h-9"
        aria-label="Share ke X (Twitter)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.961h-1.921z"></path></svg>
      </a>
      
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors flex items-center justify-center w-9 h-9"
        aria-label="Share ke Facebook"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
      </a>

      <button 
        onClick={copyToClipboard}
        className={`p-2 rounded-full transition-colors flex items-center justify-center w-9 h-9 ${copied ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}
        aria-label="Copy Link"
        title="Copy Link"
      >
        {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
      </button>
    </div>
  );
}
