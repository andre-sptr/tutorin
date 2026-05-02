import { fetchAPI } from "./client";
import { StrapiTag, StrapiListResponse } from "./types";

function isPublicTag(tag: StrapiTag): boolean {
    return !tag.slug.startsWith("system-");
}

export async function getTags(): Promise<StrapiListResponse<StrapiTag>> {
    try {
        const data = await fetchAPI<StrapiListResponse<StrapiTag>>("/api/tags?sort=name:asc", {
            next: { revalidate: 300 },
        });
        return { ...data, data: data.data.filter(isPublicTag) };
    } catch {
        return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } };
    }
}

export async function getTagBySlug(slug: string): Promise<StrapiTag | null> {
    if (slug.startsWith("system-")) return null;

    try {
        const data = await fetchAPI<StrapiListResponse<StrapiTag>>(
            `/api/tags?filters[slug][$eq]=${slug}`,
            { next: { revalidate: 300 } }
        );
        const tag = data.data?.[0] ?? null;
        return tag && isPublicTag(tag) ? tag : null;
    } catch {
        return null;
    }
}
