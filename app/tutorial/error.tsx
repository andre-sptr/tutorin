"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Tutorial list error:", error);
    }, [error]);

    return (
        <main className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-3">
                Gagal memuat daftar tutorial
            </h1>
            <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
                Terjadi kesalahan saat mengambil data. Periksa koneksi internet Anda dan coba lagi.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
                <button
                    onClick={reset}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Coba Lagi
                </button>
                <Link
                    href="/"
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                    <Home className="w-4 h-4" />
                    Kembali ke Beranda
                </Link>
            </div>
        </main>
    );
}
