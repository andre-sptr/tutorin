function isTruthy(value) {
  return /^(1|true|yes|on)$/i.test(String(value ?? "").trim());
}

function stripDiacritics(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

function slugifyId(value) {
  return stripDiacritics(String(value ?? ""))
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function buildFeaturedImagePrompt(input) {
  const title = String(input?.title ?? "").trim();
  const category = String(input?.category ?? "").trim();
  const metaDescription = String(input?.metaDescription ?? "").trim();

  return [
    "Create a clean editorial tech illustration for an Indonesian tutorial article.",
    `Topic: ${title}.`,
    `Category: ${category}.`,
    metaDescription ? `Context: ${metaDescription}.` : "",
    "Use a 16:9 landscape composition with modern everyday computer, office, printer, network, or laptop troubleshooting elements that fit the topic.",
    "Style: polished editorial tech illustration, practical, bright, human-friendly, not stock-photo generic.",
    "Constraints: no readable text, no letters, no numbers, no logos, no brand marks, no watermarks, no UI screenshots.",
  ]
    .filter(Boolean)
    .join("\n");
}

function extensionFromMediaType(mediaType) {
  const clean = String(mediaType ?? "").toLowerCase();
  if (clean.includes("jpeg") || clean.includes("jpg")) return "jpg";
  if (clean.includes("webp")) return "webp";
  return "png";
}

function buildFeaturedImageFileName(slug, mediaType) {
  const cleanSlug = slugifyId(slug) || "ai-featured-image";
  return `${cleanSlug}.${extensionFromMediaType(mediaType)}`;
}

function getImageGenerationConfig(env = process.env) {
  if (!isTruthy(env.AI_IMAGE_ENABLED)) {
    return {
      enabled: false,
      warning: "AI_IMAGE_ENABLED tidak aktif; featuredImage belum dibuat.",
    };
  }

  const provider = String(env.AI_IMAGE_PROVIDER || "vertex").trim().toLowerCase();
  if (provider === "vertex") {
    if (!env.GEMINI_API_KEY) {
      return {
        enabled: false,
        warning: "GEMINI_API_KEY belum dikonfigurasi untuk Vertex AI Express; featuredImage belum dibuat.",
      };
    }

    return {
      enabled: true,
      provider: "vertex",
      apiKey: env.GEMINI_API_KEY,
      model: env.AI_IMAGE_MODEL || "gemini-3-pro-image-preview",
    };
  }

  if (!env.AI_IMAGE_API_KEY) {
    return {
      enabled: false,
      warning: "AI_IMAGE_API_KEY belum dikonfigurasi; featuredImage belum dibuat.",
    };
  }

  return {
    enabled: true,
    provider: "openai-compatible",
    apiKey: env.AI_IMAGE_API_KEY,
    baseURL: env.AI_IMAGE_BASE_URL || undefined,
    model: env.AI_IMAGE_MODEL || "gpt-image-1",
  };
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error || "unknown error");
}

function getImageTimeoutMs(env = process.env) {
  const parsed = Number.parseInt(String(env.AI_IMAGE_TIMEOUT_MS ?? ""), 10);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return 20000;
}

function imageTimeoutError(ms) {
  return new Error(`Image generation timeout setelah ${ms} ms.`);
}

async function runWithTimeout(operation, ms, controller) {
  let timeoutId;
  try {
    return await Promise.race([
      operation(),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          controller?.abort();
          reject(imageTimeoutError(ms));
        }, ms);
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

async function resolveFeaturedImageForDraft(input, dependencies, env = process.env) {
  const config = getImageGenerationConfig(env);
  if (!config.enabled) {
    return { featuredImageId: null, warnings: [config.warning] };
  }

  try {
    const timeoutMs = getImageTimeoutMs(env);
    const controller = typeof AbortController === "undefined" ? null : new AbortController();
    const prompt = buildFeaturedImagePrompt({
      title: input.title,
      category: input.category,
      metaDescription: input.metaDescription,
    });
    const generated = await runWithTimeout(
      () => dependencies.generateImageAsset({ prompt, config, abortSignal: controller?.signal }),
      timeoutMs,
      controller,
    );
    const mediaType = generated.mediaType || "image/png";
    const uploaded = await dependencies.uploadImageAsset({
      data: generated.data,
      mediaType,
      fileName: buildFeaturedImageFileName(input.slug || input.title, mediaType),
      alternativeText: input.title,
      caption: `Featured image AI untuk ${input.title}`,
      prompt,
    });

    return { featuredImageId: uploaded.id ?? null, warnings: [] };
  } catch (error) {
    return {
      featuredImageId: null,
      warnings: [`Featured image gagal dibuat: ${errorMessage(error)}`],
    };
  }
}

function getGeminiResponseParts(response) {
  if (Array.isArray(response?.candidates?.[0]?.content?.parts)) {
    return response.candidates[0].content.parts;
  }
  if (Array.isArray(response?.parts)) return response.parts;
  return [];
}

function findGeminiInlineImage(response, fallbackMediaType = "image/png") {
  for (const part of getGeminiResponseParts(response)) {
    const inlineData = part?.inlineData || part?.inline_data;
    if (inlineData?.data) {
      return {
        data: Uint8Array.from(Buffer.from(String(inlineData.data), "base64")),
        mediaType: inlineData.mimeType || inlineData.mime_type || fallbackMediaType,
      };
    }
  }

  throw new Error("Vertex AI tidak mengembalikan inlineData gambar.");
}

exports.buildFeaturedImageFileName = buildFeaturedImageFileName;
exports.extensionFromMediaType = extensionFromMediaType;
exports.findGeminiInlineImage = findGeminiInlineImage;
exports.getImageGenerationConfig = getImageGenerationConfig;
exports.getImageTimeoutMs = getImageTimeoutMs;
exports.resolveFeaturedImageForDraft = resolveFeaturedImageForDraft;
