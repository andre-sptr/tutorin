import { TutorialGridSkeleton } from "@/components/ui/SkeletonCard";

export default function Loading() {
    return (
        <main className="min-h-screen py-8 md:py-16 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Premium Hero Header Skeleton */}
                <div className="relative bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 lg:p-14 mb-6 md:mb-14 border border-slate-200/60 dark:border-slate-800/80 shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-10">
                        <div className="flex-1 text-center lg:text-left w-full">
                            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-full mb-3 md:mb-6 animate-pulse mx-auto lg:mx-0" />
                            <div className="h-10 md:h-14 lg:h-16 w-3/4 max-w-md bg-slate-200 dark:bg-slate-800 rounded-lg mb-2 md:mb-6 animate-pulse mx-auto lg:mx-0" />
                            <div className="space-y-2 max-w-xl mx-auto lg:mx-0">
                                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                            </div>
                        </div>
                        
                        <div className="hidden lg:flex relative w-64 h-64 items-center justify-center shrink-0">
                            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Filter Skeleton */}
                <div className="h-16 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl mb-10 w-full max-w-xs" />

                {/* Grid Skeleton */}
                <TutorialGridSkeleton />
            </div>
        </main>
    );
}
