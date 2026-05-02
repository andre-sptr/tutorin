const SYSTEM_AI_TAG_SLUG = "system-ai-generated";
const SYSTEM_AI_TAG_NAME = "System AI Generated";

const STOP_WORDS = new Set([
  "agar",
  "aman",
  "cara",
  "dalam",
  "dan",
  "dengan",
  "di",
  "ini",
  "lengkap",
  "mudah",
  "mengatasi",
  "panduan",
  "pada",
  "praktis",
  "solusi",
  "terbaru",
  "tutorial",
  "untuk",
  "yang",
]);

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

function normalizeIdeaText(value) {
  return stripDiacritics(String(value ?? ""))
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token))
    .join(" ");
}

function tokenSet(value) {
  return new Set(normalizeIdeaText(value).split(" ").filter(Boolean));
}

function tokenSimilarity(left, right) {
  const leftTokens = tokenSet(left);
  const rightTokens = tokenSet(right);
  if (leftTokens.size === 0 || rightTokens.size === 0) return 0;

  let intersection = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) intersection += 1;
  }

  const union = new Set([...leftTokens, ...rightTokens]).size;
  return intersection / union;
}

function isDuplicateIdea(candidate, existingIdeas, threshold = 0.62) {
  const candidateSlug = slugifyId(candidate?.slug || candidate?.title);
  const candidateTitle = candidate?.title ?? "";

  return existingIdeas.some((idea) => {
    const existingSlug = slugifyId(idea?.slug || idea?.title);
    if (candidateSlug && existingSlug && candidateSlug === existingSlug) return true;

    const titleScore = tokenSimilarity(candidateTitle, idea?.title ?? "");
    const slugScore = tokenSimilarity(candidateSlug, existingSlug);
    return Math.max(titleScore, slugScore) >= threshold;
  });
}

function textNode(text) {
  return { type: "text", text: String(text ?? "").trim() };
}

function paragraphBlock(text) {
  return {
    type: "paragraph",
    children: [textNode(text)],
  };
}

function headingBlock(text, level = 2) {
  return {
    type: "heading",
    level,
    children: [textNode(text)],
  };
}

function listBlock(items, format = "ordered") {
  return {
    type: "list",
    format,
    children: items
      .map((item) => String(item ?? "").trim())
      .filter(Boolean)
      .map((item) => ({
        type: "list-item",
        children: [textNode(item)],
      })),
  };
}

function buildStrapiBlocks(sections) {
  const blocks = [];
  for (const section of Array.isArray(sections) ? sections : []) {
    if (section?.heading) {
      blocks.push(headingBlock(section.heading, section.level === 3 ? 3 : 2));
    }

    for (const paragraph of Array.isArray(section?.paragraphs) ? section.paragraphs : []) {
      const clean = String(paragraph ?? "").trim();
      if (clean) blocks.push(paragraphBlock(clean));
    }

    const steps = Array.isArray(section?.steps) ? section.steps : [];
    if (steps.some((step) => String(step ?? "").trim())) {
      blocks.push(listBlock(steps, "ordered"));
    }
  }

  return blocks;
}

function extractJsonObject(rawText) {
  const text = String(rawText ?? "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) {
    throw new Error("AI tidak mengembalikan JSON object.");
  }
  return JSON.parse(text.slice(start, end + 1));
}

function validateGeneratedTutorial(payload) {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Payload AI harus berupa object." };
  }

  const title = String(payload.title ?? "").trim();
  if (title.length < 20 || title.length > 95) {
    return { ok: false, error: "title harus 20-95 karakter." };
  }

  const slug = slugifyId(payload.slug || title);
  if (slug.length < 12 || slug.length > 110) {
    return { ok: false, error: "slug tidak valid." };
  }

  const category = String(payload.category ?? "").trim();
  if (category.length < 3 || category.length > 40) {
    return { ok: false, error: "category harus 3-40 karakter." };
  }

  const tags = Array.isArray(payload.tags)
    ? payload.tags.map((tag) => String(tag ?? "").trim()).filter(Boolean)
    : [];
  if (tags.length < 2 || tags.length > 8) {
    return { ok: false, error: "tags harus berisi 2-8 item." };
  }

  const sections = Array.isArray(payload.sections) ? payload.sections : [];
  const content = buildStrapiBlocks(sections);
  if (content.length < 8) {
    return { ok: false, error: "sections belum cukup untuk artikel tutorial." };
  }

  const seo = payload.seo && typeof payload.seo === "object" ? payload.seo : {};
  const metaTitle = String(seo.metaTitle || title).trim().slice(0, 70);
  const metaDescription = String(seo.metaDescription ?? "").trim();
  if (metaDescription.length < 80 || metaDescription.length > 170) {
    return { ok: false, error: "seo.metaDescription harus 80-170 karakter." };
  }

  return {
    ok: true,
    value: {
      title,
      slug,
      category,
      tags,
      seo: {
        metaTitle,
        metaDescription,
        canonicalUrl: null,
      },
      content,
    },
  };
}

function visibleTags(tags) {
  return (Array.isArray(tags) ? tags : []).filter((tag) => !String(tag?.slug ?? "").startsWith("system-"));
}

exports.SYSTEM_AI_TAG_NAME = SYSTEM_AI_TAG_NAME;
exports.SYSTEM_AI_TAG_SLUG = SYSTEM_AI_TAG_SLUG;
exports.buildStrapiBlocks = buildStrapiBlocks;
exports.extractJsonObject = extractJsonObject;
exports.isDuplicateIdea = isDuplicateIdea;
exports.normalizeIdeaText = normalizeIdeaText;
exports.slugifyId = slugifyId;
exports.validateGeneratedTutorial = validateGeneratedTutorial;
exports.visibleTags = visibleTags;
