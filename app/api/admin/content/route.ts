import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/auth";
import { getAiTutorials, StrapiAdminError } from "@/lib/admin/strapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        requireAdminSession(request);
        const tutorials = await getAiTutorials();
        return NextResponse.json({ tutorials });
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Sesi admin tidak valid." }, { status: 401 });
        }
        if (error instanceof StrapiAdminError) {
            return NextResponse.json({ error: error.message, detail: error.detail }, { status: error.status });
        }
        const message = error instanceof Error ? error.message : "Gagal mengambil konten admin.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
