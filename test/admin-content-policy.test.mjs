import test from "node:test";
import assert from "node:assert/strict";

import {
  buildStrapiBlocks,
  isDuplicateIdea,
  normalizeIdeaText,
  slugifyId,
  validateGeneratedTutorial,
} from "../lib/admin/content-policy.js";

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
