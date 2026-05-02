import { fetchAPI } from "./client";
import { StrapiCategory, StrapiListResponse } from "./types";

export async function getCategories(): Promise<StrapiListResponse<StrapiCategory>> {
    try {
        return await fetchAPI<StrapiListResponse<StrapiCategory>>("/api/categories?sort=name:asc", {
            next: { revalidate: 300 },
        });
    } catch {
        return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } };
    }
}

export async function getCategoryBySlug(slug: string): Promise<StrapiCategory | null> {
    try {
        const data = await fetchAPI<StrapiListResponse<StrapiCategory>>(
            `/api/categories?filters[slug][$eq]=${slug}`,
            { next: { revalidate: 300 } }
        );
        return data.data?.[0] ?? null;
    } catch {
        return null;
    }
}
