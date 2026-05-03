"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    Bot,
    CalendarClock,
    CheckCircle2,
    ExternalLink,
    FileText,
    Loader2,
    Lock,
    LogOut,
    RefreshCw,
    Send,
} from "lucide-react";

type AdminTutorial = {
    documentId: string;
    title: string;
    slug: string;
    status: "draft" | "published";
    updatedAt: string;
    publishedAt: string | null;
    categoryName: string | null;
    tags: string[];
    adminUrl: string;
    publicUrl: string;
    metaDescription: string | null;
    featuredImageUrl: string | null;
    generationWarnings?: string[];
};

type SessionState = {
    loading: boolean;
    authenticated: boolean;
    username: string | null;
};

type Notice = {
    type: "success" | "error" | "info";
    message: string;
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
});

function formatDate(value: string | null) {
    if (!value) return "-";
    return dateFormatter.format(new Date(value));
}

async function readJson<T>(response: Response): Promise<T> {
    const data = (await response.json().catch(() => ({}))) as T & { error?: string };
    if (!response.ok) {
        throw new Error(data.error || `Request gagal (${response.status})`);
    }
    return data;
}

export default function AdminPanel() {
    const [session, setSession] = useState<SessionState>({
        loading: true,
        authenticated: false,
        username: null,
    });
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("");
    const [tutorials, setTutorials] = useState<AdminTutorial[]>([]);
    const [notice, setNotice] = useState<Notice | null>(null);
    const [loadingContent, setLoadingContent] = useState(false);
    const [submittingLogin, setSubmittingLogin] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [publishingId, setPublishingId] = useState<string | null>(null);

    const draftCount = useMemo(() => tutorials.filter((tutorial) => tutorial.status === "draft").length, [tutorials]);
    const publishedCount = tutorials.length - draftCount;

    const loadContent = useCallback(async () => {
        setLoadingContent(true);
        try {
            const data = await readJson<{ tutorials: AdminTutorial[] }>(await fetch("/api/admin/content", { cache: "no-store" }));
            setTutorials(data.tutorials);
        } catch (error) {
            setNotice({ type: "error", message: error instanceof Error ? error.message : "Gagal memuat konten." });
        } finally {
            setLoadingContent(false);
        }
    }, []);

    const loadSession = useCallback(async () => {
        try {
            const data = await readJson<{ authenticated: boolean; username: string | null }>(
                await fetch("/api/admin/session", { cache: "no-store" }),
            );
            setSession({ loading: false, authenticated: data.authenticated, username: data.username });
            if (data.authenticated) {
                void loadContent();
            }
        } catch {
            setSession({ loading: false, authenticated: false, username: null });
        }
    }, [loadContent]);

    useEffect(() => {
        void loadSession();
    }, [loadSession]);

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmittingLogin(true);
        setNotice(null);
        try {
            const data = await readJson<{ authenticated: boolean; username: string }>(
                await fetch("/api/admin/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                }),
            );
            setSession({ loading: false, authenticated: data.authenticated, username: data.username });
            setPassword("");
            setNotice({ type: "success", message: "Login berhasil." });
            await loadContent();
        } catch (error) {
            setNotice({ type: "error", message: error instanceof Error ? error.message : "Login gagal." });
        } finally {
            setSubmittingLogin(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        setSession({ loading: false, authenticated: false, username: null });
        setTutorials([]);
        setNotice({ type: "info", message: "Anda sudah logout." });
    };

    const handleGenerate = async () => {
        setGenerating(true);
        setNotice({ type: "info", message: "AI sedang membuat draft baru. Proses ini bisa memakan waktu." });
        try {
            const data = await readJson<{ tutorial: AdminTutorial; attempt: number; warnings?: string[] }>(
                await fetch("/api/admin/ai/generate", { method: "POST" }),
            );
            setTutorials((current) => [data.tutorial, ...current.filter((item) => item.documentId !== data.tutorial.documentId)]);
            const warnings = data.warnings?.length ? ` Catatan: ${data.warnings.join(" ")}` : "";
            setNotice({ type: "success", message: `Draft AI berhasil dibuat pada attempt ke-${data.attempt}.${warnings}` });
        } catch (error) {
            setNotice({ type: "error", message: error instanceof Error ? error.message : "Generate gagal." });
        } finally {
            setGenerating(false);
        }
    };

    const handlePublish = async (tutorial: AdminTutorial) => {
        setPublishingId(tutorial.documentId);
        setNotice(null);
        try {
            const data = await readJson<{ tutorial: AdminTutorial }>(
                await fetch(`/api/admin/tutorials/${tutorial.documentId}/publish`, { method: "POST" }),
            );
            setTutorials((current) => current.map((item) => (item.documentId === data.tutorial.documentId ? data.tutorial : item)));
            setNotice({ type: "success", message: "Draft berhasil dipublish lewat frontend." });
        } catch (error) {
            setNotice({
                type: "error",
                message: `${error instanceof Error ? error.message : "Publish gagal."} Gunakan link Edit Strapi pada draft terkait sebagai fallback.`,
            });
        } finally {
            setPublishingId(null);
        }
    };

    if (session.loading) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-16">
                <div className="mx-auto flex max-w-5xl items-center gap-3 text-slate-600 dark:text-slate-300">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Memeriksa sesi admin...
                </div>
            </main>
        );
    }

    if (!session.authenticated) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-12 md:py-20">
                <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <Lock className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-950 dark:text-white">Admin AI Konten</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Masuk untuk mengelola draft AI TutorinBang.</p>
                        </div>
                    </div>

                    {notice && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                            {notice.message}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="admin-username" className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Username
                            </label>
                            <input
                                id="admin-username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                autoComplete="username"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="admin-password" className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Password
                            </label>
                            <input
                                id="admin-password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete="current-password"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submittingLogin}
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submittingLogin ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                            Masuk
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                            <Bot className="h-3.5 w-3.5" />
                            AI Content Console
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-4xl">
                            Admin Panel TutorinBang
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                            Generate draft tutorial harian, cek histori konten AI, lalu publish setelah review.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={loadContent}
                            disabled={loadingContent}
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <RefreshCw className={`h-4 w-4 ${loadingContent ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-4 px-4 py-6 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Draft AI</p>
                        <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-slate-950 dark:text-white">{draftCount}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Published AI</p>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-slate-950 dark:text-white">{publishedCount}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Scheduler</p>
                        <CalendarClock className="h-5 w-5 text-indigo-600" />
                    </div>
                    <p className="mt-3 text-sm font-bold text-slate-950 dark:text-white">09.00 WIB setiap hari</p>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-10">
                {notice && (
                    <div
                        className={`mb-4 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
                            notice.type === "success"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
                                : notice.type === "error"
                                  ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
                                  : "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300"
                        }`}
                    >
                        {notice.type === "error" ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
                        {notice.message}
                    </div>
                )}

                <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Generate Konten Manual</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Jalankan generator di luar jadwal cron. Output tetap berupa draft Strapi.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={generating}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Generate Draft
                    </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Histori Draft AI</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Draft yang tidak dipublish tetap disimpan sebagai histori anti-duplikasi.
                        </p>
                    </div>

                    {loadingContent ? (
                        <div className="flex items-center gap-3 px-5 py-10 text-sm text-slate-500 dark:text-slate-400">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Memuat histori...
                        </div>
                    ) : tutorials.length === 0 ? (
                        <div className="px-5 py-10 text-sm text-slate-500 dark:text-slate-400">
                            Belum ada draft AI yang tercatat.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-800">
                            {tutorials.map((tutorial) => (
                                <article key={tutorial.documentId} className="p-5">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                                        tutorial.status === "published"
                                                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                                                    }`}
                                                >
                                                    {tutorial.status === "published" ? "Published" : "Draft"}
                                                </span>
                                                {tutorial.categoryName && (
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                        {tutorial.categoryName}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-base font-extrabold leading-snug text-slate-950 dark:text-white md:text-lg">
                                                {tutorial.title}
                                            </h3>
                                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                                {tutorial.metaDescription || "Tidak ada meta description."}
                                            </p>
                                            <p className={`mt-2 text-xs font-semibold ${tutorial.featuredImageUrl ? "text-emerald-600 dark:text-emerald-300" : "text-amber-600 dark:text-amber-300"}`}>
                                                {tutorial.featuredImageUrl ? "Featured image tersedia" : "Featured image belum tersedia"}
                                            </p>
                                            {tutorial.generationWarnings?.length ? (
                                                <p className="mt-2 text-xs leading-5 text-amber-700 dark:text-amber-300">
                                                    {tutorial.generationWarnings.join(" ")}
                                                </p>
                                            ) : null}
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {tutorial.tags.map((tag) => (
                                                    <span key={tag} className="text-xs font-semibold text-blue-600 dark:text-blue-300">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
                                                Update: {formatDate(tutorial.updatedAt)}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 lg:justify-end">
                                            {tutorial.status === "draft" && (
                                                <button
                                                    type="button"
                                                    onClick={() => handlePublish(tutorial)}
                                                    disabled={publishingId === tutorial.documentId}
                                                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {publishingId === tutorial.documentId ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                                    Publish
                                                </button>
                                            )}
                                            {tutorial.status === "published" && (
                                                <a
                                                    href={tutorial.publicUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:text-slate-200"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    Buka
                                                </a>
                                            )}
                                            <a
                                                href={tutorial.adminUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:text-slate-200"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                Edit Strapi
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
