import test from "node:test";
import assert from "node:assert/strict";

import contentPolicy from "../lib/admin/content-policy.js";
import featuredImagePolicy from "../lib/admin/featured-image-policy.js";

const {
  buildStrapiBlocks,
  buildCanonicalUrl,
  buildFeaturedImagePrompt,
  buildTutorialDraftData,
  isDuplicateIdea,
  normalizeIdeaText,
  slugifyId,
  validateGeneratedTutorial,
} = contentPolicy;

const { findGeminiInlineImage, getImageGenerationConfig, resolveFeaturedImageForDraft } = featuredImagePolicy;

test("slugifyId creates stable Indonesian URL slugs", () => {
  assert.equal(
    slugifyId("Cara Mengatasi Printer Error 0x00000709 di Windows 11!"),
    "cara-mengatasi-printer-error-0x00000709-di-windows-11",
  );
  assert.equal(slugifyId("  Rumus VLOOKUP & XLOOKUP untuk Pemula  "), "rumus-vlookup-xlookup-untuk-pemula");
});

test("normalizeIdeaText removes filler words and punctuation for duplicate checks", () => {
  assert.equal(
    normalizeIdeaText("Cara Mudah Mengatasi Laptop Lemot di Windows 11"),
    "laptop lemot windows 11",
  );
});

test("isDuplicateIdea catches exact slug matches and high-similarity titles", () => {
  const existing = [
    { title: "Cara Mengatasi Printer Tidak Bisa Print di Windows", slug: "cara-mengatasi-printer-tidak-bisa-print-di-windows" },
    { title: "Rumus Excel VLOOKUP untuk Pemula", slug: "rumus-excel-vlookup-untuk-pemula" },
  ];

  assert.equal(isDuplicateIdea({ title: "Solusi Printer Tidak Bisa Print Windows", slug: "solusi-printer-tidak-bisa-print-windows" }, existing), true);
  assert.equal(isDuplicateIdea({ title: "Cara Mengatasi Printer Tidak Bisa Print di Windows", slug: "cara-mengatasi-printer-tidak-bisa-print-di-windows" }, existing), true);
  assert.equal(isDuplicateIdea({ title: "Cara Membuat Daftar Isi Otomatis di Word", slug: "cara-membuat-daftar-isi-otomatis-di-word" }, existing), false);
});

test("validateGeneratedTutorial rejects incomplete AI payloads", () => {
  const result = validateGeneratedTutorial({
    title: "Pendek",
    slug: "pendek",
    category: "Word",
    tags: ["word"],
    seo: { metaTitle: "Pendek", metaDescription: "Terlalu pendek" },
    sections: [],
  });

  assert.equal(result.ok, false);
  assert.match(result.error, /title/i);
});

test("validateGeneratedTutorial builds canonicalUrl from the site URL and generated slug", () => {
  const result = validateGeneratedTutorial(
    {
      title: "Cara Mengatasi Printer Tidak Terdeteksi di Windows 11",
      slug: "cara-mengatasi-printer-tidak-terdeteksi-di-windows-11",
      category: "Printer",
      tags: ["printer", "windows"],
      seo: {
        metaTitle: "Cara Mengatasi Printer Tidak Terdeteksi di Windows 11",
        metaDescription: "Panduan praktis untuk mengecek koneksi, driver, dan pengaturan Windows saat printer tidak terdeteksi.",
      },
      sections: [
        { heading: "Cek koneksi printer", paragraphs: ["Pastikan kabel, Wi-Fi, dan daya printer sudah aktif."], steps: ["Nyalakan printer.", "Cek kabel USB atau jaringan."] },
        { heading: "Periksa driver", paragraphs: ["Driver yang rusak sering membuat printer tidak muncul di Windows."], steps: ["Buka Device Manager.", "Update driver printer."] },
        { heading: "Atur default printer", paragraphs: ["Windows bisa memilih printer lain sebagai default."], steps: ["Buka Settings.", "Pilih printer utama."] },
        { heading: "Restart layanan print spooler", paragraphs: ["Layanan print spooler perlu direstart jika antrean macet."], steps: ["Buka Services.", "Restart Print Spooler."] },
        { heading: "Coba test print", paragraphs: ["Lakukan test print setelah semua pengaturan diperbaiki."], steps: ["Buka printer properties.", "Klik Print Test Page."] },
      ],
    },
    { siteUrl: "https://tutorinbang.my.id/" },
  );

  assert.equal(result.ok, true);
  assert.equal(result.value.seo.canonicalUrl, "https://tutorinbang.my.id/tutorial/cara-mengatasi-printer-tidak-terdeteksi-di-windows-11");
  assert.equal(
    buildCanonicalUrl("https://tutorinbang.my.id/", "cara-mengatasi-printer-tidak-terdeteksi-di-windows-11"),
    "https://tutorinbang.my.id/tutorial/cara-mengatasi-printer-tidak-terdeteksi-di-windows-11",
  );
});

test("buildFeaturedImagePrompt creates a safe editorial tech image brief", () => {
  const prompt = buildFeaturedImagePrompt({
    title: "Cara Mengatasi Excel Hang Saat Membuka File Besar",
    category: "Excel",
    metaDescription: "Langkah praktis untuk mengurangi file berat, menonaktifkan add-in, dan membuat Excel kembali responsif.",
  });

  assert.match(prompt, /editorial tech illustration/i);
  assert.match(prompt, /16:9/i);
  assert.match(prompt, /no readable text/i);
  assert.match(prompt, /logos/i);
  assert.match(prompt, /brand marks/i);
});

test("buildTutorialDraftData connects uploaded media as featuredImage", () => {
  const data = buildTutorialDraftData(
    {
      title: "Cara Mengatasi Excel Hang Saat Membuka File Besar",
      slug: "cara-mengatasi-excel-hang-saat-membuka-file-besar",
      content: [],
      seo: {
        metaTitle: "Cara Mengatasi Excel Hang Saat Membuka File Besar",
        metaDescription: "Langkah praktis untuk mengurangi file berat, menonaktifkan add-in, dan membuat Excel kembali responsif.",
        canonicalUrl: "https://tutorinbang.my.id/tutorial/cara-mengatasi-excel-hang-saat-membuka-file-besar",
      },
      featuredImageId: 42,
    },
    "category-doc-id",
    ["tag-doc-id", "system-tag-doc-id"],
  );

  assert.equal(data.featuredImage, 42);
  assert.deepEqual(data.tags, { connect: ["tag-doc-id", "system-tag-doc-id"] });
});

test("resolveFeaturedImageForDraft skips disabled image generation with a warning", async () => {
  const result = await resolveFeaturedImageForDraft(
    {
      title: "Cara Mengatasi Excel Hang Saat Membuka File Besar",
      slug: "cara-mengatasi-excel-hang-saat-membuka-file-besar",
      category: "Excel",
      metaDescription: "Langkah praktis untuk mengurangi file berat, menonaktifkan add-in, dan membuat Excel kembali responsif.",
    },
    {
      generateImageAsset: async () => {
        throw new Error("should not run");
      },
      uploadImageAsset: async () => {
        throw new Error("should not run");
      },
    },
    { AI_IMAGE_ENABLED: "false" },
  );

  assert.equal(result.featuredImageId, null);
  assert.match(result.warnings[0], /AI_IMAGE_ENABLED/i);
});

test("getImageGenerationConfig enables Vertex Express from GEMINI_API_KEY", () => {
  const config = getImageGenerationConfig({
    AI_IMAGE_ENABLED: "true",
    AI_IMAGE_PROVIDER: "vertex",
    GEMINI_API_KEY: "test-gemini-key",
    AI_IMAGE_MODEL: "gemini-3-pro-image-preview",
  });

  assert.equal(config.enabled, true);
  assert.equal(config.provider, "vertex");
  assert.equal(config.apiKey, "test-gemini-key");
  assert.equal(config.model, "gemini-3-pro-image-preview");
});

test("getImageGenerationConfig requires GEMINI_API_KEY for Vertex Express", () => {
  const config = getImageGenerationConfig({
    AI_IMAGE_ENABLED: "true",
    AI_IMAGE_PROVIDER: "vertex",
  });

  assert.equal(config.enabled, false);
  assert.match(config.warning, /GEMINI_API_KEY/i);
});

test("findGeminiInlineImage extracts the first generated inline image", () => {
  const image = findGeminiInlineImage(
    {
      candidates: [
        {
          content: {
            parts: [
              { text: "Here is the image." },
              {
                inlineData: {
                  mimeType: "image/png",
                  data: Buffer.from([1, 2, 3]).toString("base64"),
                },
              },
            ],
          },
        },
      ],
    },
    "image/png",
  );

  assert.equal(image.mediaType, "image/png");
  assert.deepEqual(Array.from(image.data), [1, 2, 3]);
});

test("resolveFeaturedImageForDraft returns uploaded media id when image generation succeeds", async () => {
  const calls = [];
  const result = await resolveFeaturedImageForDraft(
    {
      title: "Cara Mengatasi Excel Hang Saat Membuka File Besar",
      slug: "cara-mengatasi-excel-hang-saat-membuka-file-besar",
      category: "Excel",
      metaDescription: "Langkah praktis untuk mengurangi file berat, menonaktifkan add-in, dan membuat Excel kembali responsif.",
    },
    {
      generateImageAsset: async (input) => {
        calls.push(["generate", input.prompt]);
        return { data: new Uint8Array([1, 2, 3]), mediaType: "image/png" };
      },
      uploadImageAsset: async (input) => {
        calls.push(["upload", input.fileName, input.alternativeText]);
        return { id: 99 };
      },
    },
    { AI_IMAGE_ENABLED: "true", AI_IMAGE_PROVIDER: "vertex", GEMINI_API_KEY: "test-key", AI_IMAGE_MODEL: "test-model" },
  );

  assert.equal(result.featuredImageId, 99);
  assert.deepEqual(result.warnings, []);
  assert.equal(calls[0][0], "generate");
  assert.match(calls[0][1], /editorial tech illustration/i);
  assert.deepEqual(calls[1], ["upload", "cara-mengatasi-excel-hang-saat-membuka-file-besar.png", "Cara Mengatasi Excel Hang Saat Membuka File Besar"]);
});

test("resolveFeaturedImageForDraft keeps draft flow alive when image generation fails", async () => {
  const result = await resolveFeaturedImageForDraft(
    {
      title: "Cara Mengatasi Excel Hang Saat Membuka File Besar",
      slug: "cara-mengatasi-excel-hang-saat-membuka-file-besar",
      category: "Excel",
      metaDescription: "Langkah praktis untuk mengurangi file berat, menonaktifkan add-in, dan membuat Excel kembali responsif.",
    },
    {
      generateImageAsset: async () => {
        throw new Error("provider timeout");
      },
      uploadImageAsset: async () => {
        throw new Error("should not run");
      },
    },
    { AI_IMAGE_ENABLED: "true", AI_IMAGE_PROVIDER: "vertex", GEMINI_API_KEY: "test-key", AI_IMAGE_MODEL: "test-model" },
  );

  assert.equal(result.featuredImageId, null);
  assert.match(result.warnings[0], /provider timeout/i);
});

test("buildStrapiBlocks converts sections into Strapi block content", () => {
  const blocks = buildStrapiBlocks([
    {
      heading: "Cek kabel dan koneksi",
      paragraphs: ["Pastikan kabel printer terpasang dan printer menyala."],
      steps: ["Cabut kabel USB.", "Pasang kembali kabel USB."],
    },
  ]);

  assert.deepEqual(blocks[0], {
    type: "heading",
    level: 2,
    children: [{ type: "text", text: "Cek kabel dan koneksi" }],
  });
  assert.equal(blocks[1].type, "paragraph");
  assert.equal(blocks[2].type, "list");
  assert.equal(blocks[2].format, "ordered");
});
