import { SITE_URL, STRAPI_URL } from "@/lib/api/client";
import type { StrapiBlockNode, StrapiCategory, StrapiListResponse, StrapiTag, StrapiTutorial } from "@/lib/api/types";
import { SYSTEM_AI_TAG_NAME, SYSTEM_AI_TAG_SLUG, slugifyId, visibleTags } from "@/lib/admin/content-policy";

type StrapiSingleResponse<T> = {
    data: T;
    meta?: Record<string, unknown>;
};

export type AdminTutorialSummary = {
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
};

export type CreateTutorialInput = {
    title: string;
    slug: string;
    content: StrapiBlockNode[];
    seo: {
        metaTitle: string;
        metaDescription: string;
        canonicalUrl: string | null;
    };
    category: string;
    tags: string[];
};

export class StrapiAdminError extends Error {
    status: number;
    detail: string;

    constructor(message: string, status: number, detail: string) {
        super(message);
        this.name = "StrapiAdminError";
        this.status = status;
        this.detail = detail;
    }
}

function getWriteToken(): string {
    const token = process.env.STRAPI_WRITE_TOKEN;
    if (!token) throw new Error("STRAPI_WRITE_TOKEN belum dikonfigurasi.");
    return token;
}

function getAdminUrl(documentId: string): string {
    return `${STRAPI_URL}/admin/content-manager/collection-types/api::tutorial.tutorial/${documentId}`;
}

async function strapiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${STRAPI_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getWriteToken()}`,
            ...(options.headers ?? {}),
        },
        cache: "no-store",
    });

    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new StrapiAdminError(`Strapi request gagal: ${response.status} ${response.statusText}`, response.status, detail);
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
}

function toAdminSummary(tutorial: StrapiTutorial): AdminTutorialSummary {
    return {
        documentId: tutorial.documentId,
        title: tutorial.title,
        slug: tutorial.slug,
        status: tutorial.publishedAt ? "published" : "draft",
        updatedAt: tutorial.updatedAt,
        publishedAt: tutorial.publishedAt ?? null,
        categoryName: tutorial.category?.name ?? null,
        tags: visibleTags(tutorial.tags).map((tag) => tag.name),
        adminUrl: getAdminUrl(tutorial.documentId),
        publicUrl: `${SITE_URL}/tutorial/${tutorial.slug}`,
        metaDescription: tutorial.seo?.metaDescription ?? null,
    };
}

async function findBySlug<T extends { slug: string }>(collection: "categories" | "tags", slug: string): Promise<T | null> {
    const params = new URLSearchParams();
    params.set("filters[slug][$eq]", slug);
    params.set("pagination[pageSize]", "1");

    const data = await strapiRequest<StrapiListResponse<T>>(`/api/${collection}?${params.toString()}`);
    return data.data?.[0] ?? null;
}

async function createCategory(name: string, slug: string): Promise<StrapiCategory> {
    const data = await strapiRequest<StrapiSingleResponse<StrapiCategory>>("/api/categories", {
        method: "POST",
        body: JSON.stringify({ data: { name, slug } }),
    });
    return data.data;
}

async function createTag(name: string, slug: string): Promise<StrapiTag> {
    const data = await strapiRequest<StrapiSingleResponse<StrapiTag>>("/api/tags", {
        method: "POST",
        body: JSON.stringify({ data: { name, slug } }),
    });
    return data.data;
}

export async function findOrCreateCategory(name: string): Promise<StrapiCategory> {
    const cleanName = name.trim();
    const slug = slugifyId(cleanName);
    const existing = await findBySlug<StrapiCategory>("categories", slug);
    return existing ?? createCategory(cleanName, slug);
}

export async function findOrCreateTag(name: string): Promise<StrapiTag> {
    const cleanName = name.trim();
    const slug = slugifyId(cleanName);
    const existing = await findBySlug<StrapiTag>("tags", slug);
    return existing ?? createTag(cleanName, slug);
}

export async function getExistingIdeas(): Promise<Array<{ title: string; slug: string }>> {
    const buildPath = (status: "published" | "draft") => {
        const params = new URLSearchParams();
        params.set("status", status);
        params.set("fields[0]", "title");
        params.set("fields[1]", "slug");
        params.set("sort", "updatedAt:desc");
        params.set("pagination[pageSize]", "100");
        return `/api/tutorials?${params.toString()}`;
    };

    const [published, draft] = await Promise.all([
        strapiRequest<StrapiListResponse<Pick<StrapiTutorial, "title" | "slug">>>(buildPath("published")),
        strapiRequest<StrapiListResponse<Pick<StrapiTutorial, "title" | "slug">>>(buildPath("draft")),
    ]);

    const ideas = [...(published.data ?? []), ...(draft.data ?? [])];
    const unique = new Map<string, { title: string; slug: string }>();
    for (const idea of ideas) {
        unique.set(`${idea.slug}:${idea.title}`, { title: idea.title, slug: idea.slug });
    }
    return [...unique.values()];
}

export async function getAiTutorials(): Promise<AdminTutorialSummary[]> {
    const buildPath = (status: "draft" | "published") => {
        const params = new URLSearchParams();
        params.set("status", status);
        params.set("populate", "*");
        params.set("filters[tags][slug][$eq]", SYSTEM_AI_TAG_SLUG);
        params.set("sort", "updatedAt:desc");
        params.set("pagination[pageSize]", "25");
        return `/api/tutorials?${params.toString()}`;
    };

    const [draft, published] = await Promise.all([
        strapiRequest<StrapiListResponse<StrapiTutorial>>(buildPath("draft")),
        strapiRequest<StrapiListResponse<StrapiTutorial>>(buildPath("published")),
    ]);

    const byDocumentId = new Map<string, StrapiTutorial>();
    for (const tutorial of [...(draft.data ?? []), ...(published.data ?? [])]) {
        const current = byDocumentId.get(tutorial.documentId);
        if (!current || (!current.publishedAt && tutorial.publishedAt)) {
            byDocumentId.set(tutorial.documentId, tutorial);
        }
    }

    return [...byDocumentId.values()]
        .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
        .map(toAdminSummary);
}

export async function createTutorialDraft(input: CreateTutorialInput): Promise<AdminTutorialSummary> {
    const category = await findOrCreateCategory(input.category);
    const tags = await Promise.all([
        ...input.tags.map((tag) => findOrCreateTag(tag)),
        findOrCreateTag(SYSTEM_AI_TAG_NAME),
    ]);

    const data = await strapiRequest<StrapiSingleResponse<StrapiTutorial>>("/api/tutorials?status=draft", {
        method: "POST",
        body: JSON.stringify({
            data: {
                title: input.title,
                slug: input.slug,
                content: input.content,
                seo: input.seo,
                category: category.documentId,
                tags: {
                    connect: tags.map((tag) => tag.documentId),
                },
            },
        }),
    });

    return toAdminSummary(data.data);
}

export async function publishTutorialDraft(documentId: string): Promise<AdminTutorialSummary> {
    const params = new URLSearchParams();
    params.set("status", "draft");
    params.set("populate", "*");

    const current = await strapiRequest<StrapiSingleResponse<StrapiTutorial>>(`/api/tutorials/${documentId}?${params.toString()}`);
    const tutorial = current.data;
    const tagDocumentIds = (tutorial.tags ?? []).map((tag) => tag.documentId);

    const publishParams = new URLSearchParams();
    publishParams.set("status", "published");
    publishParams.set("populate", "*");

    const data = await strapiRequest<StrapiSingleResponse<StrapiTutorial>>(`/api/tutorials/${documentId}?${publishParams.toString()}`, {
        method: "PUT",
        body: JSON.stringify({
            data: {
                title: tutorial.title,
                slug: tutorial.slug,
                content: tutorial.content,
                seo: tutorial.seo,
                category: tutorial.category?.documentId ?? null,
                tags: {
                    set: tagDocumentIds,
                },
            },
        }),
    });

    if (!data.data.publishedAt) {
        throw new StrapiAdminError("Strapi tidak mengembalikan status published.", 422, "REST publish tidak tersedia atau tidak didukung oleh versi Strapi ini.");
    }

    return toAdminSummary(data.data);
}
