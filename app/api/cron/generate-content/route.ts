import { NextRequest, NextResponse } from "next/server";
import { verifyBearerToken } from "@/lib/admin/auth";
import { generateAiTutorialDraft } from "@/lib/admin/ai-content";
import { StrapiAdminError } from "@/lib/admin/strapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
    if (!process.env.CRON_SECRET) {
        return NextResponse.json({ error: "CRON_SECRET belum dikonfigurasi." }, { status: 500 });
    }
    if (!verifyBearerToken(request, process.env.CRON_SECRET)) {
        return NextResponse.json({ error: "Cron token tidak valid." }, { status: 401 });
    }

    try {
        const result = await generateAiTutorialDraft();
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        if (error instanceof StrapiAdminError) {
            return NextResponse.json({ error: error.message, detail: error.detail }, { status: error.status });
        }
        const message = error instanceof Error ? error.message : "Gagal menjalankan cron generate konten.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
