import { fetchAPI } from "./client";
import { StrapiTutorial, StrapiListResponse, TutorialFilters } from "./types";

export async function getTutorials(): Promise<StrapiListResponse<StrapiTutorial>> {
    try {
        return await fetchAPI<StrapiListResponse<StrapiTutorial>>("/api/tutorials?populate=*&sort=publishedAt:desc", {
            next: { revalidate: 120 },
        });
    } catch {
        return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } };
    }
}

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

        return await fetchAPI<StrapiListResponse<StrapiTutorial>>(`/api/tutorials?${params.toString()}`, {
            next: { revalidate: 60 },
        });
    } catch {
        return { data: [], meta: { pagination: { page: 1, pageSize: 12, pageCount: 0, total: 0 } } };
    }
}

export async function getTutorialBySlug(slug: string): Promise<StrapiListResponse<StrapiTutorial>> {
    try {
        return await fetchAPI<StrapiListResponse<StrapiTutorial>>(
            `/api/tutorials?filters[slug][$eq]=${slug}&populate=*`,
            { next: { revalidate: 3600 } }
        );
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

        const data = await fetchAPI<StrapiListResponse<StrapiTutorial>>(`/api/tutorials?${params.toString()}`, {
            next: { revalidate: 3600 },
        });
        return data.data ?? [];
    } catch {
        return [];
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

        const data = await fetchAPI<StrapiListResponse<StrapiTutorial>>(`/api/tutorials?${params.toString()}`, {
            next: { revalidate: 0 },
        });
        return data.data.map((t) => ({ title: t.title, slug: t.slug }));
    } catch {
        return [];
    }
}

export async function getTutorialsByTag(
    tagSlug: string,
    page = 1,
    pageSize = 12
): Promise<StrapiListResponse<StrapiTutorial>> {
    try {
        const params = new URLSearchParams();
        params.set("populate", "*");
        params.set("filters[tags][slug][$eq]", tagSlug);
        params.set("pagination[page]", String(page));
        params.set("pagination[pageSize]", String(pageSize));
        params.set("sort", "publishedAt:desc");

        return await fetchAPI<StrapiListResponse<StrapiTutorial>>(`/api/tutorials?${params.toString()}`, {
            next: { revalidate: 60 },
        });
    } catch {
        return { data: [], meta: { pagination: { page: 1, pageSize: 12, pageCount: 0, total: 0 } } };
    }
}
