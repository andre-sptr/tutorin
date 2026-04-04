import { ImageResponse } from "next/og";
import { getTutorialBySlug } from "@/lib/api";

export const runtime = "edge";
export const alt = "Tutorial Image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
    const { slug } = await params;
    const dataTutorial = await getTutorialBySlug(slug);
    const tutorial = dataTutorial?.data?.[0];

    const title = tutorial?.title ?? "Tutorial TutorinBang";
    const category = tutorial?.category?.name ?? "Tutorial";

    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    padding: "64px",
                    fontFamily: "sans-serif",
                    position: "relative",
                }}
            >
                {/* Background pattern */}
                <div
                    style={{
                        position: "absolute",
                        top: 0, right: 0,
                        width: "400px",
                        height: "400px",
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "50%",
                        transform: "translate(100px, -100px)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: 0, left: 0,
                        width: "300px",
                        height: "300px",
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "50%",
                        transform: "translate(-80px, 80px)",
                    }}
                />
                {/* Category badge */}
                <div
                    style={{
                        display: "flex",
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: "999px",
                        padding: "8px 20px",
                        marginBottom: "24px",
                        color: "white",
                        fontSize: "18px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                    }}
                >
                    {category}
                </div>
                {/* Title */}
                <div
                    style={{
                        color: "white",
                        fontSize: title.length > 60 ? "42px" : "52px",
                        fontWeight: 900,
                        lineHeight: 1.15,
                        marginBottom: "32px",
                        maxWidth: "900px",
                    }}
                >
                    {title}
                </div>
                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            color: "white",
                            fontSize: "28px",
                            fontWeight: 800,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Tutorin<span style={{ color: "#93c5fd" }}>Bang</span>
                    </div>
                    <div
                        style={{
                            background: "rgba(255,255,255,0.3)",
                            height: "24px",
                            width: "2px",
                            borderRadius: "2px",
                        }}
                    />
                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "20px" }}>
                        tutorinbang.my.id
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
