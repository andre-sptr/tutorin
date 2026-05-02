import { fetchAPI } from "./client";
import { StrapiTag, StrapiListResponse } from "./types";

export async function getTags(): Promise<StrapiListResponse<StrapiTag>> {
    try {
        return await fetchAPI<StrapiListResponse<StrapiTag>>("/api/tags?sort=name:asc", {
            next: { revalidate: 300 },
        });
    } catch {
        return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } };
    }
}

export async function getTagBySlug(slug: string): Promise<StrapiTag | null> {
    try {
        const data = await fetchAPI<StrapiListResponse<StrapiTag>>(
            `/api/tags?filters[slug][$eq]=${slug}`,
            { next: { revalidate: 300 } }
        );
        return data.data?.[0] ?? null;
    } catch {
        return null;
    }
}
