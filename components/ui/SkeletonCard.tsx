export default function SkeletonCard({ isFeatured = false }: { isFeatured?: boolean }) {
    return (
        <div className={`flex flex-col bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/80 animate-pulse overflow-hidden ${isFeatured ? 'lg:col-span-2 lg:flex-row' : ''}`}>
            <div className={`bg-slate-200 dark:bg-slate-700 ${isFeatured ? 'w-full lg:w-1/2 aspect-video lg:aspect-auto h-full shrink-0' : 'aspect-video w-full'}`} />
            <div className={`flex flex-col flex-1 p-4 md:p-8 lg:p-10 ${isFeatured ? 'lg:w-1/2 justify-center' : ''}`}>
                <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full mb-3 md:mb-6" />
                <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2 md:mb-4" />
                <div className="h-8 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 md:mb-8" />
                <div className="space-y-2 mb-4 md:mb-8 flex-1">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
                <div className="mt-auto h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
        </div>
    );
}

export function FeaturedTutorialsSkeleton() {
    return (
        <section className="container mx-auto px-4 max-w-7xl py-6 md:py-10 relative z-10">
             <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-12 gap-4 md:gap-6">
                <div className="max-w-2xl w-full">
                    <div className="h-10 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2 md:mb-4 animate-pulse" />
                    <div className="h-5 w-full max-w-md bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                <SkeletonCard isFeatured={true} />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </section>
    );
}

export function TutorialGridSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
    );
}
