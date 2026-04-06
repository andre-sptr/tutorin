"use client";

import { useEffect, useRef } from "react";

declare global {
    interface Window {
        adsbygoogle: any;
    }
}

interface AdSenseProps {
    client?: string;
    slot: string;
}

export default function AdSenseSlot({ client = "ca-pub-9170878168905515", slot }: AdSenseProps) {
    const isLoaded = useRef(false);

    useEffect(() => {
        if (!isLoaded.current) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                isLoaded.current = true;
            } catch (error: any) {
                if (!error?.message?.includes("already have ads")) {
                    console.error("AdSense error:", error);
                }
            }
        }
    }, []);

    return (
        <div className="w-full min-w-[250px] my-8 overflow-hidden bg-gray-50 border border-gray-100 p-2 text-center flex flex-col items-center justify-center min-h-[100px]">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">
                Advertisement
            </span>
            <ins
                className="adsbygoogle"
                style={{ display: "block", textAlign: "center", width: "100%" }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
}