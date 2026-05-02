export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tutorinbang.my.id";

export function getStrapiMediaUrl(url: string | null | undefined): string {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${STRAPI_URL}${url}`;
}

export async function fetchAPI<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const defaultOptions = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    const requestUrl = `${STRAPI_URL}${path}`;

    try {
        const response = await fetch(requestUrl, mergedOptions);
        
        if (!response.ok) {
            console.error(`Fetch API Error: ${response.status} ${response.statusText} - ${requestUrl}`);
            throw new Error(`Failed to fetch from API: ${response.statusText}`);
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        console.error(`Fetch API Error for path ${path}:`, error);
        throw error;
    }
}
