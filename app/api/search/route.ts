import { NextRequest, NextResponse } from "next/server";
import { getSearchSuggestions } from "@/lib/api";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";

    if (q.length < 2) {
        return NextResponse.json([]);
    }

    const suggestions = await getSearchSuggestions(q);
    return NextResponse.json(suggestions, {
        headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
    });
}
