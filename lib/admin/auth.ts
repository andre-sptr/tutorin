import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "tutorinbang_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

type SessionPayload = {
    username: string;
    exp: number;
};

function base64Url(input: string | Buffer): string {
    return Buffer.from(input).toString("base64url");
}

function getSessionSecret(): string {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (secret) return secret;
    if (process.env.NODE_ENV !== "production") return "dev-only-tutorinbang-admin-session-secret";
    return "";
}

export function getAdminUsername(): string {
    return process.env.ADMIN_USERNAME || "admin";
}

export function getAdminPassword(): string {
    return process.env.ADMIN_PASSWORD || "uciha361";
}

function sign(payload: string): string {
    const secret = getSessionSecret();
    if (!secret) throw new Error("ADMIN_SESSION_SECRET belum dikonfigurasi.");
    return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string): boolean {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function isValidAdminCredential(username: unknown, password: unknown): boolean {
    return username === getAdminUsername() && password === getAdminPassword();
}

export function createSessionValue(username: string, now = Date.now()): string {
    const payload: SessionPayload = {
        username,
        exp: now + ADMIN_SESSION_MAX_AGE * 1000,
    };
    const encodedPayload = base64Url(JSON.stringify(payload));
    return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifySessionValue(value: string | undefined, now = Date.now()): SessionPayload | null {
    if (!value) return null;

    const [encodedPayload, signature] = value.split(".");
    if (!encodedPayload || !signature) return null;

    try {
        if (!safeEqual(sign(encodedPayload), signature)) return null;
        const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as SessionPayload;
        if (payload.username !== getAdminUsername() || payload.exp < now) return null;
        return payload;
    } catch {
        return null;
    }
}

export function getAdminSession(request: NextRequest): SessionPayload | null {
    return verifySessionValue(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export function requireAdminSession(request: NextRequest): SessionPayload {
    const session = getAdminSession(request);
    if (!session) {
        throw new Error("UNAUTHORIZED");
    }
    return session;
}

export function verifyBearerToken(request: NextRequest, expected: string | undefined): boolean {
    if (!expected) return false;
    const header = request.headers.get("authorization") ?? "";
    const token = header.match(/^Bearer\s+(.+)$/i)?.[1] ?? "";
    return safeEqual(token, expected);
}
