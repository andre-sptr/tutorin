import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/auth";
import { generateAiTutorialDraft } from "@/lib/admin/ai-content";
import { StrapiAdminError } from "@/lib/admin/strapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        requireAdminSession(request);
        const result = await generateAiTutorialDraft();
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Sesi admin tidak valid." }, { status: 401 });
        }
        if (error instanceof StrapiAdminError) {
            return NextResponse.json({ error: error.message, detail: error.detail }, { status: error.status });
        }
        const message = error instanceof Error ? error.message : "Gagal generate konten AI.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
