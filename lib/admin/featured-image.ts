import { createOpenAI } from "@ai-sdk/openai";
import { GoogleGenAI } from "@google/genai";
import { generateImage } from "ai";
import {
    findGeminiInlineImage,
    resolveFeaturedImageForDraft,
    type FeaturedImageDraftInput,
    type GeneratedImageAsset,
    type ImageGenerationConfig,
    type UploadImageAssetInput,
} from "@/lib/admin/featured-image-policy";
import { uploadFeaturedImageAsset } from "@/lib/admin/strapi";

type EnabledImageConfig = Extract<ImageGenerationConfig, { enabled: true }>;
type ImageSize = `${number}x${number}`;

function getImageAspectRatio(): string {
    return process.env.AI_IMAGE_ASPECT_RATIO || "16:9";
}

function getImageMimeType(): string {
    return process.env.AI_IMAGE_MIME_TYPE || "image/png";
}

function getImageSize(): ImageSize {
    const size = process.env.AI_IMAGE_SIZE;
    if (size && /^\d+x\d+$/.test(size)) return size as ImageSize;
    return "1536x1024";
}

async function generateVertexImageAsset({
    prompt,
    config,
    abortSignal,
}: {
    prompt: string;
    config: Extract<EnabledImageConfig, { provider: "vertex" }>;
    abortSignal?: AbortSignal;
}): Promise<GeneratedImageAsset> {
    const ai = new GoogleGenAI({
        vertexai: true,
        apiKey: config.apiKey,
    });

    const response = await ai.models.generateContent({
        model: config.model,
        contents: prompt,
        config: {
            abortSignal,
            responseModalities: ["TEXT", "IMAGE"],
            imageConfig: {
                aspectRatio: getImageAspectRatio(),
            },
        },
    });

    return findGeminiInlineImage(response, getImageMimeType());
}

async function generateOpenAiCompatibleImageAsset({
    prompt,
    config,
    abortSignal,
}: {
    prompt: string;
    config: Extract<EnabledImageConfig, { provider: "openai-compatible" }>;
    abortSignal?: AbortSignal;
}): Promise<GeneratedImageAsset> {
    const provider = createOpenAI({
        ...(config.baseURL ? { baseURL: config.baseURL } : {}),
        apiKey: config.apiKey,
    });

    const result = await generateImage({
        model: provider.image(config.model),
        prompt,
        n: 1,
        size: getImageSize(),
        abortSignal,
        providerOptions: {
            openai: {
                quality: process.env.AI_IMAGE_QUALITY || "auto",
                outputFormat: "png",
            },
        },
    });

    return {
        data: result.image.uint8Array,
        mediaType: result.image.mediaType || "image/png",
    };
}

async function generateImageAsset(input: { prompt: string; config: EnabledImageConfig; abortSignal?: AbortSignal }): Promise<GeneratedImageAsset> {
    if (input.config.provider === "vertex") return generateVertexImageAsset(input as { prompt: string; config: Extract<EnabledImageConfig, { provider: "vertex" }>; abortSignal?: AbortSignal });
    return generateOpenAiCompatibleImageAsset(input as { prompt: string; config: Extract<EnabledImageConfig, { provider: "openai-compatible" }>; abortSignal?: AbortSignal });
}

async function uploadImageAsset(input: UploadImageAssetInput): Promise<{ id: number | null }> {
    const uploaded = await uploadFeaturedImageAsset({
        data: input.data,
        mediaType: input.mediaType,
        fileName: input.fileName,
        alternativeText: input.alternativeText,
        caption: input.caption,
    });

    return { id: uploaded.id };
}

export async function resolveGeneratedFeaturedImage(input: FeaturedImageDraftInput): Promise<{ featuredImageId: number | null; warnings: string[] }> {
    return resolveFeaturedImageForDraft(input, {
        generateImageAsset,
        uploadImageAsset,
    });
}
