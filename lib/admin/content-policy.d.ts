import type { StrapiBlockNode, StrapiTag } from "@/lib/api/types";

export const SYSTEM_AI_TAG_NAME: string;
export const SYSTEM_AI_TAG_SLUG: string;

export type ExistingIdea = {
  title?: string | null;
  slug?: string | null;
};

export type GeneratedSection = {
  heading?: string;
  level?: 2 | 3;
  paragraphs?: string[];
  steps?: string[];
};

export type ValidGeneratedTutorial = {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string | null;
  };
  content: StrapiBlockNode[];
  featuredImageId?: number;
  featuredImageDocumentId?: string;
};

export type ValidateGeneratedTutorialOptions = {
  siteUrl?: string;
};

export type FeaturedImagePromptInput = {
  title: string;
  category?: string | null;
  metaDescription?: string | null;
};

export type TutorialDraftDataInput = {
  title: string;
  slug: string;
  content: StrapiBlockNode[];
  seo: ValidGeneratedTutorial["seo"];
  featuredImageId?: number | null;
  featuredImageDocumentId?: string | null;
};

export function slugifyId(value: unknown): string;
export function buildCanonicalUrl(siteUrl: unknown, slug: unknown): string | null;
export function buildFeaturedImagePrompt(input: FeaturedImagePromptInput): string;
export function normalizeIdeaText(value: unknown): string;
export function isDuplicateIdea(candidate: ExistingIdea, existingIdeas: ExistingIdea[], threshold?: number): boolean;
export function buildStrapiBlocks(sections: GeneratedSection[]): StrapiBlockNode[];
export function buildTutorialDraftData(
  input: TutorialDraftDataInput,
  categoryDocumentId: string,
  tagDocumentIds: string[],
): Record<string, unknown>;
export function extractJsonObject(rawText: unknown): unknown;
export function validateGeneratedTutorial(
  payload: unknown,
  options?: ValidateGeneratedTutorialOptions,
): { ok: false; error: string } | { ok: true; value: ValidGeneratedTutorial };
export function visibleTags<T extends Pick<StrapiTag, "slug">>(tags: T[] | undefined | null): T[];
