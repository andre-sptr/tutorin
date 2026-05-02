import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const SUMOPOD_API_URL = "https://ai.sumopod.com/v1";
const SUMOPOD_API_KEY = process.env.SUMOPOD_API_KEY ?? "";

const sumopod = createOpenAI({
    baseURL: SUMOPOD_API_URL,
    apiKey: SUMOPOD_API_KEY,
});

const SYSTEM_PROMPT = `Kamu adalah "Bang Tutor" 🤖, asisten AI resmi dari TutorinBang - portal tutorial teknologi terpercaya untuk masyarakat Indonesia.

Kepribadianmu:
- Ramah, santai, dan humoris tapi tetap informatif
- Menggunakan bahasa Indonesia yang mudah dipahami semua kalangan
- Sering menyapa dengan "Bro", "Sis", atau "Sobat" untuk kesan dekat
- Selalu semangat membantu dan tidak pernah meremehkan pertanyaan

Keahlianmu (fokus utama):
- Troubleshoot masalah device (Windows, MacOS, driver, BSOD, dll)
- Microsoft Office: Word, Excel, PowerPoint (tips, rumus, format)
- Masalah hardware: tidak bisa print, ink, paper jam, dll
- Tips produktivitas komputer sehari-hari
- Tips untuk mahasiswa, pekerja, dan umum
- Masalah internet dan jaringan dasar

Cara menjawab:
- Jawab dengan SINGKAT, PADAT, dan JELAS.
- Selalu berikan langkah-langkah yang JELAS dan BERURUTAN (Langkah 1, Langkah 2, dst)
- Gunakan emoji secukupnya agar lebih mudah dibaca 📋
- Jika ada beberapa solusi, berikan 1-2 solusi yang paling ampuh saja
- Tutup jawaban dengan tawaran bantuan lanjutan
- Jika pertanyaan di luar topik teknologi, arahkan kembali dengan sopan

Contoh gaya bahasa:
"Tenang Bro, masalah ini sering banget terjadi! Coba ikuti langkah-langkah berikut ya..."`;

export async function POST(request: NextRequest) {
    if (!SUMOPOD_API_KEY) {
        return NextResponse.json({ error: "API key tidak dikonfigurasi" }, { status: 500 });
    }

    try {
        const { messages } = await request.json();

        const cleanMessages = messages
            .filter((m: any) => m.role === 'user' || m.role === 'assistant')
            .map((m: any) => ({
                role: m.role,
                content: typeof m.content === 'string' ? m.content : (Array.isArray(m.parts) ? m.parts.map((p: any) => p.text || "").join("") : "")
            }))
            .filter((m: any) => m.content.trim() !== "");

        const modelMessages = cleanMessages.length > 0 && cleanMessages[0].role === 'assistant'
            ? cleanMessages.slice(1)
            : cleanMessages;

        let finalMessages = cleanMessages.length > 0 && cleanMessages[0].role === 'assistant'
            ? cleanMessages.slice(1)
            : cleanMessages;

        if (finalMessages.length > 0 && finalMessages[0].role === 'user') {
            finalMessages[0].content = `${SYSTEM_PROMPT}\n\nPERTANYAAN USER:\n${finalMessages[0].content}`;
        }

        const result = streamText({
            model: sumopod("gpt-5.1"),
            messages: finalMessages as any,
        });

        return result.toTextStreamResponse();
    } catch (err) {
        console.error("AI chat error:", err);
        return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 });
    }
}
