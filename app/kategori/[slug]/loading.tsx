import { TutorialGridSkeleton } from "@/components/ui/SkeletonCard";

export default function Loading() {
    return (
        <main className="min-h-screen py-8 md:py-16 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Skeleton */}
                <div className="mb-8 md:mb-16 text-center lg:text-left animate-pulse">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded mx-auto lg:mx-0 mb-4" />
                    <div className="h-10 md:h-14 w-64 bg-slate-200 dark:bg-slate-800 rounded mx-auto lg:mx-0 mb-4" />
                </div>
                {/* Grid Skeleton */}
                <TutorialGridSkeleton />
            </div>
        </main>
    );
}
