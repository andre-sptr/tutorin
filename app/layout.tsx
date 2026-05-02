import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ReadingProgress from "@/components/article/ReadingProgress";
import ScrollToTop from "@/components/ui/ScrollToTop";
import AIChat from "@/components/ui/AIChat";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL("https://tutorinbang.my.id"),
    title: "TutorinBang - Portal Tutorial Teknologi",
    description: "Belajar tips & trik teknologi, tutorial laptop, dan panduan komputer sehari-hari di TutorinBang.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
            <head>
                <meta name="google-adsense-account" content="ca-pub-9170878168905515" />
                {/* Anti-FOUC: apply dark class before paint */}
                <script
                    id="theme-script"
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
                    }}
                />
            </head>

            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9170878168905515"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
                <ReadingProgress />
                <Header />

                <div className="flex-1">
                    {children}
                </div>

                <Footer />
                <AIChat />
                <ScrollToTop />
            </body>
        </html>
    );
}