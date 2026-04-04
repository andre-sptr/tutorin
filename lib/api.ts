// lib/api.ts

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tutorinbang.my.id";

export function getStrapiMediaUrl(url: string | null | undefined): string {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${STRAPI_URL}${url}`;
}

// --- Types ---

export type StrapiImage = {
    id: number;
    documentId: string;
    url: string;
    alternativeText: string | null;
    width: number;
    height: number;
    formats?: {
        thumbnail?: { url: string; width: number; height: number };
        small?: { url: string; width: number; height: number };
        medium?: { url: string; width: number; height: number };
        large?: { url: string; width: number; height: number };
    };
};

export type StrapiCategory = {
    id: number;
    documentId: string;
    name: string;
    slug: string;
};

export type StrapiTag = {
    id: number;
    documentId: string;
    name: string;
    slug: string;
};

export type StrapiSeo = {
    id: number;
    metaTitle: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
};

// Strapi 5 Blocks content nodes
export type StrapiTextNode = {
    type: "text";
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
};

export type StrapiLinkNode = {
    type: "link";
    url: string;
    children: StrapiTextNode[];
};

export type StrapiListItemNode = {
    type: "list-item";
    children: (StrapiTextNode | StrapiLinkNode)[];
};

export type StrapiBlockNode =
    | { type: "paragraph"; children: (StrapiTextNode | StrapiLinkNode)[] }
    | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: StrapiTextNode[] }
    | { type: "list"; format: "ordered" | "unordered"; children: StrapiListItemNode[] }
    | { type: "quote"; children: StrapiTextNode[] }
    | { type: "code"; language?: string; children: StrapiTextNode[] }
    | { type: "image"; image: StrapiImage; children: StrapiTextNode[] };

export type StrapiTutorial = {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    content: StrapiBlockNode[];
    featuredImage: StrapiImage | null;
    seo: StrapiSeo | null;
    category: StrapiCategory | null;
    tags?: StrapiTag[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
};

export type StrapiListResponse<T> = {
    data: T[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
};

// --- API functions ---

export async function getTutorials(): Promise<StrapiListResponse<StrapiTutorial>> {
    try {
        const res = await fetch(`${STRAPI_URL}/api/tutorials?populate=*&sort=publishedAt:desc`, {
            next: { revalidate: 120 },
        });
        if (!res.ok) throw new Error("Gagal mengambil data dari Strapi");
        return await res.json();
    } catch {
        return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } };
    }
}

export type TutorialFilters = {
    q?: string;
    category?: string;
    page?: number;
    pageSize?: number;
};

export async function getTutorialsFiltered(
    filters: TutorialFilters = {}
): Promise<StrapiListResponse<StrapiTutorial>> {
    try {
        const params = new URLSearchParams();
        params.set("populate", "*");
        params.set("pagination[pageSize]", String(filters.pageSize ?? 12));
        params.set("pagination[page]", String(filters.page ?? 1));
        params.set("sort", "publishedAt:desc");

        if (filters.q) {
            params.set("filters[title][$containsi]", filters.q);
        }
        if (filters.category) {
            params.set("filters[category][slug][$eq]", filters.category);
        }

        const res = await fetch(`${STRAPI_URL}/api/tutorials?${params.toString()}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) throw new Error("Gagal mengambil data dari Strapi");
        return await res.json();
    } catch {
        return { data: [], meta: { pagination: { page: 1, pageSize: 12, pageCount: 0, total: 0 } } };
    }
}

export async function getTutorialBySlug(slug: string): Promise<StrapiListResponse<StrapiTutorial>> {
    try {
        const res = await fetch(
            `${STRAPI_URL}/api/tutorials?filters[slug][$eq]=${slug}&populate=*`,
            { next: { revalidate: 3600 } }
        );
        if (!res.ok) throw new Error("Gagal mengambil data artikel");
        return await res.json();
    } catch {
        return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } };
    }
}

export async function getRelatedArticles(
    categorySlug: string,
    excludeSlug: string,
    limit = 3
): Promise<StrapiTutorial[]> {
    try {
        const params = new URLSearchParams();
        params.set("populate", "*");
        params.set("pagination[pageSize]", String(limit));
        params.set("filters[category][slug][$eq]", categorySlug);
        params.set("filters[slug][$ne]", excludeSlug);
        params.set("sort", "publishedAt:desc");

        const res = await fetch(`${STRAPI_URL}/api/tutorials?${params.toString()}`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        const data: StrapiListResponse<StrapiTutorial> = await res.json();
        return data.data ?? [];
    } catch {
        return [];
    }
}

export async function getCategories(): Promise<StrapiListResponse<StrapiCategory>> {
    try {
        const res = await fetch(`${STRAPI_URL}/api/categories?sort=name:asc`, {
            next: { revalidate: 300 },
        });
        if (!res.ok) throw new Error("Gagal mengambil data kategori");
        return await res.json();
    } catch {
        return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } };
    }
}

export async function getCategoryBySlug(slug: string): Promise<StrapiCategory | null> {
    try {
        const res = await fetch(
            `${STRAPI_URL}/api/categories?filters[slug][$eq]=${slug}`,
            { next: { revalidate: 300 } }
        );
        if (!res.ok) return null;
        const data: StrapiListResponse<StrapiCategory> = await res.json();
        return data.data?.[0] ?? null;
    } catch {
        return null;
    }
}

export async function getSearchSuggestions(q: string): Promise<{ title: string; slug: string }[]> {
    try {
        const params = new URLSearchParams();
        params.set("filters[title][$containsi]", q);
        params.set("pagination[pageSize]", "5");
        params.set("fields[0]", "title");
        params.set("fields[1]", "slug");
        params.set("sort", "publishedAt:desc");

        const res = await fetch(`${STRAPI_URL}/api/tutorials?${params.toString()}`, {
            next: { revalidate: 0 },
        });
        if (!res.ok) return [];
        const data: StrapiListResponse<StrapiTutorial> = await res.json();
        return data.data.map((t) => ({ title: t.title, slug: t.slug }));
    } catch {
        return [];
    }
}