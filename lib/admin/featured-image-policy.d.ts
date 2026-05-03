export type ImageGenerationConfig =
  | {
      enabled: false;
      warning: string;
    }
  | {
      enabled: true;
      provider: "vertex";
      apiKey: string;
      model: string;
    }
  | {
      enabled: true;
      provider: "openai-compatible";
      apiKey: string;
      baseURL?: string;
      model: string;
    };

export type FeaturedImageDraftInput = {
  title: string;
  slug: string;
  category?: string | null;
  metaDescription?: string | null;
};

export type GeneratedImageAsset = {
  data: Uint8Array;
  mediaType: string;
};

export type UploadImageAssetInput = {
  data: Uint8Array;
  mediaType: string;
  fileName: string;
  alternativeText: string;
  caption: string;
  prompt: string;
};

export type FeaturedImageDependencies = {
  generateImageAsset(input: { prompt: string; config: Extract<ImageGenerationConfig, { enabled: true }>; abortSignal?: AbortSignal }): Promise<GeneratedImageAsset>;
  uploadImageAsset(input: UploadImageAssetInput): Promise<{ id: number | null }>;
};

export function extensionFromMediaType(mediaType: unknown): string;
export function buildFeaturedImageFileName(slug: unknown, mediaType: unknown): string;
export function findGeminiInlineImage(response: unknown, fallbackMediaType?: string): GeneratedImageAsset;
export function getImageGenerationConfig(env?: NodeJS.ProcessEnv): ImageGenerationConfig;
export function getImageTimeoutMs(env?: NodeJS.ProcessEnv): number;
export function resolveFeaturedImageForDraft(
  input: FeaturedImageDraftInput,
  dependencies: FeaturedImageDependencies,
  env?: NodeJS.ProcessEnv,
): Promise<{ featuredImageId: number | null; warnings: string[] }>;
