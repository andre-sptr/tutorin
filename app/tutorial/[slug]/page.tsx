import { getTutorialBySlug, getTutorials, getRelatedArticles, getStrapiMediaUrl, SITE_URL } from "@/lib/api";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSenseSlot from "@/components/AdSenseSlot";
import ShareButtons from "@/components/article/ShareButtons";
import TableOfContents from "@/components/article/TableOfContents";
import AuthorBox from "@/components/article/AuthorBox";
import StrapiBlocksRenderer from "@/components/article/StrapiBlocksRenderer";
import RelatedArticles from "@/components/features/RelatedArticles";
import { Clock, Calendar, Tag, Home, ChevronRight } from "lucide-react";

type Props = {
    params: Promise<{ slug: string }>;
};

// Pre-build all known slugs at build time (SSG)
export async function generateStaticParams() {
    const dataTutorials = await getTutorials();
    return dataTutorials.data.map((t) => ({ slug: t.slug }));
}

function estimateReadingTime(content: { type: string; children?: { text?: string }[] }[]): string {
    if (!content || !Array.isArray(content)) return "3 mnt baca";
    const text = content
        .filter(b => b.type === "paragraph" || b.type === "heading")
        .flatMap(b => b.children || [])
        .map(c => c.text || "")
        .join(" ");
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(wordCount / 200));
    return `${minutes} mnt baca`;
}

function formatDate(isoString: string): string {
    try {
        return new Date(isoString).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric",
        });
    } catch { return isoString; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const dataTutorial = await getTutorialBySlug(slug);
    const tutorial = dataTutorial?.data?.[0];

    if (!tutorial) return { title: "Artikel Tidak Ditemukan" };

    const seo = tutorial.seo;
    const featuredImageUrl = getStrapiMediaUrl(tutorial.featuredImage?.url);
    const canonicalUrl = seo?.canonicalUrl || `${SITE_URL}/tutorial/${tutorial.slug}`;

    return {
        title: seo?.metaTitle || tutorial.title,
        description: seo?.metaDescription || undefined,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            type: "article",
            title: seo?.metaTitle || tutorial.title,
            description: seo?.metaDescription || undefined,
            url: canonicalUrl,
            images: featuredImageUrl
                ? [{ url: featuredImageUrl, width: tutorial.featuredImage?.width, height: tutorial.featuredImage?.height, alt: tutorial.featuredImage?.alternativeText || tutorial.title }]
                : [],
            publishedTime: tutorial.publishedAt,
            modifiedTime: tutorial.updatedAt,
        },
        twitter: {
            card: "summary_large_image",
            title: seo?.metaTitle || tutorial.title,
            description: seo?.metaDescription || undefined,
            images: featuredImageUrl ? [featuredImageUrl] : [],
        },
    };
}

export default async function TutorialPage({ params }: Props) {
    const { slug } = await params;
    const dataTutorial = await getTutorialBySlug(slug);
    const tutorial = dataTutorial?.data?.[0];

    if (!tutorial) notFound();

    const publishDate = formatDate(tutorial.publishedAt || tutorial.createdAt);
    const readingTime = estimateReadingTime(tutorial.content as Parameters<typeof estimateReadingTime>[0]);
    const featuredImageUrl = getStrapiMediaUrl(tutorial.featuredImage?.url);
    const featuredImageAlt = tutorial.featuredImage?.alternativeText || tutorial.title;
    const canonicalUrl = `${SITE_URL}/tutorial/${tutorial.slug}`;

    // Fetch related articles (same category)
    const relatedArticles = tutorial.category
        ? await getRelatedArticles(tutorial.category.slug, tutorial.slug, 3)
        : [];

    // JSON-LD Structured Data
    const tagKeywords = tutorial.tags && tutorial.tags.length > 0
        ? tutorial.tags.map((t) => t.name).join(", ")
        : undefined;
    const allKeywords = [
        tutorial.category?.name,
        tagKeywords,
    ].filter(Boolean).join(", ") || undefined;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": tutorial.title,
        "description": tutorial.seo?.metaDescription || "",
        "url": canonicalUrl,
        "image": featuredImageUrl || undefined,
        "datePublished": tutorial.publishedAt,
        "dateModified": tutorial.updatedAt,
        "author": {
            "@type": "Organization",
            "name": "TutorinBang",
            "url": SITE_URL,
        },
        "publisher": {
            "@type": "Organization",
            "name": "TutorinBang",
            "url": SITE_URL,
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl,
        },
        ...(tutorial.category && {
            "articleSection": tutorial.category.name,
        }),
        ...(allKeywords && { "keywords": allKeywords }),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="container mx-auto px-4 max-w-7xl py-4 md:py-8 bg-white dark:bg-slate-900 min-h-screen">

                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-4 md:mb-8">
                    <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" />
                        Beranda
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                    <Link href="/tutorial" className="hover:text-blue-600 transition-colors">Tutorial</Link>
                    {tutorial.category && (
                        <>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                            <Link href={`/kategori/${tutorial.category.slug}`} className="hover:text-blue-600 transition-colors capitalize">
                                {tutorial.category.name}
                            </Link>
                        </>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                    <span className="text-slate-400 dark:text-slate-500 truncate max-w-[200px]">{tutorial.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Main Content */}
                    <div className="col-span-1 lg:col-span-8">
                        <article>
                            <header className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    {tutorial.category && (
                                        <Link
                                            href={`/kategori/${tutorial.category.slug}`}
                                            className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
                                        >
                                            <Tag className="w-3 h-3" />
                                            {tutorial.category.name}
                                        </Link>
                                    )}
                                </div>

                                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.2] md:leading-[1.15] mb-4 md:mb-6 tracking-tight">
                                    {tutorial.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 pb-2">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>{publishDate}</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        <span>{readingTime}</span>
                                    </div>
                                </div>

                                <ShareButtons title={tutorial.title} />
                            </header>

                            {/* Featured Image */}
                            {featuredImageUrl && (
                                <div className="relative w-full overflow-hidden rounded-2xl mb-8 shadow-md aspect-video">
                                    <Image
                                        src={featuredImageUrl}
                                        alt={featuredImageAlt}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                                        priority
                                    />
                                </div>
                            )}

                            {/* Ad: Above Article */}
                            <AdSenseSlot slot="0987654321" />

                            {/* Article Body */}
                            <div id="article-content" className="prose prose-sm md:prose-lg max-w-none w-full dark:prose-invert">
                                <StrapiBlocksRenderer content={tutorial.content} />
                            </div>

                            {/* Tags */}
                            {tutorial.tags && tutorial.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider self-center">Tags:</span>
                                    {tutorial.tags.map((tag) => (
                                        <Link
                                            key={tag.documentId}
                                            href={`/tag/${tag.slug}`}
                                            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            #{tag.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Ad: Below Article */}
                            <AdSenseSlot slot="1122334455" />

                            {/* Author Box */}
                            <AuthorBox />

                            {/* Related Articles */}
                            {relatedArticles.length > 0 && (
                                <RelatedArticles articles={relatedArticles} />
                            )}
                        </article>
                    </div>

                    {/* Sidebar */}
                    <aside className="col-span-1 lg:col-span-4 lg:sticky lg:top-24 space-y-8 hidden md:block">
                        <TableOfContents />
                        <div>
                            <AdSenseSlot slot="9988776655" />
                        </div>
                    </aside>

                </div>
            </main>
        </>
    );
}