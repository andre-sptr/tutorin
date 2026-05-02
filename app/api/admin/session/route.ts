import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const session = getAdminSession(request);
    return NextResponse.json({
        authenticated: Boolean(session),
        username: session?.username ?? null,
    });
}
