import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/auth";
import { publishTutorialDraft, StrapiAdminError } from "@/lib/admin/strapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{ documentId: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
    try {
        requireAdminSession(request);
        const { documentId } = await context.params;
        const tutorial = await publishTutorialDraft(documentId);
        return NextResponse.json({ tutorial });
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Sesi admin tidak valid." }, { status: 401 });
        }
        if (error instanceof StrapiAdminError) {
            return NextResponse.json({ error: error.message, detail: error.detail }, { status: error.status });
        }
        const message = error instanceof Error ? error.message : "Gagal publish tutorial.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
