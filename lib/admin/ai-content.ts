import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { createTutorialDraft, getExistingIdeas, type AdminTutorialSummary } from "@/lib/admin/strapi";
import { extractJsonObject, isDuplicateIdea, validateGeneratedTutorial } from "@/lib/admin/content-policy";

const SUMOPOD_API_URL = "https://ai.sumopod.com/v1";
const MAX_GENERATION_ATTEMPTS = 3;

export type GenerateAiContentResult = {
    tutorial: AdminTutorialSummary;
    attempt: number;
};

function getModelName(): string {
    return process.env.AI_CONTENT_MODEL || "claude-haiku-4-5";
}

function getAiClient() {
    const apiKey = process.env.SUMOPOD_API_KEY;
    if (!apiKey) throw new Error("SUMOPOD_API_KEY belum dikonfigurasi.");
    return createOpenAI({
        baseURL: SUMOPOD_API_URL,
        apiKey,
    });
}

function buildPrompt(existingIdeas: Array<{ title: string; slug: string }>, attempt: number): string {
    const oldIdeas = existingIdeas
        .slice(0, 90)
        .map((idea, index) => `${index + 1}. ${idea.title} (${idea.slug})`)
        .join("\n");

    return `Anda adalah AI content strategist untuk TutorinBang, portal tutorial teknologi praktis berbahasa Indonesia.

Tugas: buat 1 artikel tutorial BARU yang belum mirip dengan daftar konten lama.

Topik yang boleh dipilih:
- Microsoft Word
- Microsoft Excel
- laptop/Windows error
- printer error
- internet/jaringan dasar
- produktivitas komputer sehari-hari

Konten lama yang TIDAK BOLEH diulang atau terlalu mirip:
${oldIdeas || "- Belum ada data lama."}

Aturan artikel:
- Bahasa Indonesia yang praktis, jelas, dan mudah diikuti.
- Judul 20-95 karakter.
- Meta description 80-170 karakter.
- Buat minimal 5 section.
- Setiap section punya heading, 1-2 paragraph, dan bila relevan 2-5 steps.
- Jangan membuat klaim berlebihan, jangan menyebut harga/produk yang mudah berubah.
- Attempt saat ini: ${attempt}. Jika attempt lebih dari 1, pilih sudut pandang/topik yang lebih berbeda.

Balas HANYA JSON valid tanpa markdown:
{
  "title": "string",
  "slug": "string-kebab-case",
  "category": "Word|Excel|Laptop|Printer|Internet|Produktivitas",
  "tags": ["string", "string"],
  "seo": {
    "metaTitle": "string",
    "metaDescription": "string"
  },
  "sections": [
    {
      "heading": "string",
      "paragraphs": ["string"],
      "steps": ["string"]
    }
  ]
}`;
}

export async function generateAiTutorialDraft(): Promise<GenerateAiContentResult> {
    const existingIdeas = await getExistingIdeas();
    const ai = getAiClient();

    for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
        const result = await generateText({
            model: ai(getModelName()),
            prompt: buildPrompt(existingIdeas, attempt),
        });

        const payload = extractJsonObject(result.text);
        const validation = validateGeneratedTutorial(payload);
        if (!validation.ok) {
            if (attempt === MAX_GENERATION_ATTEMPTS) throw new Error(validation.error);
            continue;
        }

        const duplicate = isDuplicateIdea(
            { title: validation.value.title, slug: validation.value.slug },
            existingIdeas,
        );
        if (duplicate) {
            if (attempt === MAX_GENERATION_ATTEMPTS) {
                throw new Error("AI menghasilkan ide yang terlalu mirip dengan konten lama.");
            }
            existingIdeas.unshift({ title: validation.value.title, slug: validation.value.slug });
            continue;
        }

        const tutorial = await createTutorialDraft(validation.value);
        return { tutorial, attempt };
    }

    throw new Error("Gagal membuat konten AI setelah beberapa percobaan.");
}
