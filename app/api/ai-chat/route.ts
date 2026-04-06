import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const SUMOPOD_API_URL = "https://ai.sumopod.com/v1/chat/completions";
const SUMOPOD_API_KEY = process.env.SUMOPOD_API_KEY ?? "";

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
- Selalu berikan langkah-langkah yang JELAS dan BERURUTAN (Langkah 1, Langkah 2, dst)
- Gunakan emoji secukupnya agar lebih mudah dibaca 📋
- Jika ada beberapa solusi, urutkan dari yang paling mudah
- Tutup jawaban dengan tawaran bantuan lanjutan
- Jika pertanyaan di luar topik teknologi, arahkan kembali dengan sopan

Contoh gaya bahasa:
"Tenang Bro, masalah ini sering banget terjadi! Coba ikuti langkah-langkah berikut ya..."`;

export async function POST(request: NextRequest) {
    if (!SUMOPOD_API_KEY) {
        return NextResponse.json({ error: "API key tidak dikonfigurasi" }, { status: 500 });
    }

    let body: { messages?: { role: string; content: string }[] };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Request tidak valid" }, { status: 400 });
    }

    const userMessages = body.messages ?? [];

    const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...userMessages,
    ];

    try {
        console.log("Sending to sumopod:", JSON.stringify(messages, null, 2));

        const res = await fetch(SUMOPOD_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUMOPOD_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-5.1",
                messages,
                max_tokens: 3000,
                temperature: 0.7,
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("Sumopod API error:", err);
            return NextResponse.json({ error: "Gagal menghubungi AI" }, { status: 502 });
        }

        const data = await res.json();
        console.log("Sumopod response data:", JSON.stringify(data, null, 2));
        const reply = data.choices?.[0]?.message?.content ?? "Maaf, saya tidak bisa merespons saat ini.";

        return NextResponse.json({ reply });
    } catch (err) {
        console.error("AI chat error:", err);
        return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 });
    }
}

// Just touching to force rebuild
