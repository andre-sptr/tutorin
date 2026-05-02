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

export type TutorialFilters = {
    q?: string;
    category?: string;
    page?: number;
    pageSize?: number;
};
