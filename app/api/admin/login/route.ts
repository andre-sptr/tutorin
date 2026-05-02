import { NextRequest, NextResponse } from "next/server";
import {
    ADMIN_SESSION_COOKIE,
    ADMIN_SESSION_MAX_AGE,
    createSessionValue,
    getAdminUsername,
    isValidAdminCredential,
} from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as { username?: unknown; password?: unknown };
        if (!isValidAdminCredential(body.username, body.password)) {
            return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
        }

        const username = getAdminUsername();
        const response = NextResponse.json({ authenticated: true, username });
        response.cookies.set(ADMIN_SESSION_COOKIE, createSessionValue(username), {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: ADMIN_SESSION_MAX_AGE,
        });
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Login gagal.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
