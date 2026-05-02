"use client";

import { useEffect, useRef } from "react";

type AdsByGoogleQueue = Array<Record<string, unknown>>;

declare global {
    interface Window {
        adsbygoogle?: AdsByGoogleQueue;
    }
}

interface AdSenseProps {
    client?: string;
    slot: string;
}

export default function AdSenseSlot({ client = "ca-pub-9170878168905515", slot }: AdSenseProps) {
    const isLoaded = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined" || !containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentRect.width > 0 && !isLoaded.current) {
                    try {
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                        isLoaded.current = true;
                        observer.disconnect();
                    } catch (error: unknown) {
                        if (!(error instanceof Error) || !error.message.includes("already have ads")) {
                            console.error("AdSense error:", error);
                        }
                    }
                }
            }
        });

        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ minWidth: "250px" }}
            className="w-full my-8 overflow-hidden bg-gray-50 border border-gray-100 p-2 text-center flex flex-col items-center justify-center min-h-[100px]"
        >
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">
                Advertisement
            </span>
            <ins
                className="adsbygoogle"
                style={{ display: "block", textAlign: "center", width: "100%", minHeight: "90px" }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
}
