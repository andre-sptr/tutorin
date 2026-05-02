export default function Loading() {
    return (
        <main className="container mx-auto px-4 max-w-7xl py-4 md:py-8 bg-white dark:bg-slate-900 min-h-screen">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-2 mb-4 md:mb-8 animate-pulse">
                <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="col-span-1 lg:col-span-8">
                    <article className="animate-pulse">
                        <header className="mb-8">
                            <div className="w-24 h-6 bg-slate-200 dark:bg-slate-800 rounded-full mb-4"></div>
                            <div className="w-3/4 h-10 md:h-12 bg-slate-200 dark:bg-slate-800 rounded-lg mb-6"></div>
                            <div className="flex gap-4 mb-4">
                                <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                            </div>
                        </header>
                        
                        {/* Featured Image Skeleton */}
                        <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl mb-8"></div>
                        
                        {/* Content Skeleton */}
                        <div className="space-y-4">
                            <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                            <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                            <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                            <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                            <div className="w-4/5 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        </div>
                    </article>
                </div>
                <aside className="col-span-1 lg:col-span-4 hidden md:block">
                    <div className="w-full h-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                </aside>
            </div>
        </main>
    );
}
