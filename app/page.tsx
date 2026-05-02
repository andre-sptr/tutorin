import { Suspense } from "react";
import HeroSection from "@/components/features/home/HeroSection";
import FeaturedTutorialsContainer from "@/components/features/home/FeaturedTutorialsContainer";
import { FeaturedTutorialsSkeleton } from "@/components/ui/SkeletonCard";
import StatsRibbon from "@/components/features/home/StatsRibbon";
import BottomCTA from "@/components/features/home/BottomCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden relative">

      {/* Dynamic Background Glow */}
      <div className="absolute top-0 inset-x-0 h-[800px] w-full bg-gradient-to-b from-blue-50/80 via-slate-50 to-slate-50 dark:from-blue-950/20 dark:via-slate-950 dark:to-slate-950 pointer-events-none -z-10" />
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/4" />
      <div className="absolute top-40 left-0 w-[600px] h-[600px] bg-indigo-400/10 dark:bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -z-10 -translate-x-1/3" />

      {/* Editor's Pick Grid with Suspense */}
      <Suspense fallback={<FeaturedTutorialsSkeleton />}>
        <FeaturedTutorialsContainer />
      </Suspense>

      {/* Hero Section */}
      <HeroSection />

      {/* Stats/Feature Ribbon */}
      <StatsRibbon />

      {/* Massive CTA Bottom */}
      <BottomCTA />

    </main>
  );
}