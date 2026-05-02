"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { getStrapiMediaUrl, StrapiTutorial } from "@/lib/api";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

export default function FeaturedTutorials({ recentTutorials }: { recentTutorials: StrapiTutorial[] }) {
    return (
        <section className="container mx-auto px-4 max-w-7xl py-6 md:py-10 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-12 gap-4 md:gap-6">
                <div className="max-w-2xl">
                    <h2 className="text-2xl md:text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 md:mb-4">
                        Publikasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Terbaru</span>
                    </h2>
                    <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        Jelajahi tutorial troubleshoot yang disusun khusus agar mudah dipraktikkan langsung oleh Anda.
                    </p>
                </div>
                <Link href="/tutorial" className="shrink-0 flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group shadow-sm hover:shadow-md text-sm md:text-base">
                    Lihat Semua
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
            >
                {recentTutorials.length === 0 ? (
                    <motion.div variants={itemVariants} className="col-span-full bg-white dark:bg-slate-900/50 rounded-[3rem] p-16 text-center border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
                        <BookOpen className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-6" />
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Belum Ada Publikasi</h3>
                        <p className="text-lg text-slate-500 dark:text-slate-400">Konten edukatif sedang dipersiapkan oleh tim editor kami.</p>
                    </motion.div>
                ) : (
                    recentTutorials.map((tutorial, index) => {
                        const imgUrl = getStrapiMediaUrl(
                            tutorial.featuredImage?.formats?.medium?.url ?? tutorial.featuredImage?.url
                        );

                        const isFeatured = index === 0;

                        return (
                            <motion.div variants={itemVariants} key={tutorial.documentId || tutorial.id} className={isFeatured ? 'lg:col-span-2' : ''}>
                                <Link
                                    href={`/tutorial/${tutorial.slug}`}
                                    className={`group flex flex-col bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-[2rem] border border-slate-200/60 dark:border-slate-800/80 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-2 transition-all duration-300 overflow-hidden h-full ${isFeatured ? 'lg:flex-row' : ''}`}
                                >
                                    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 ${isFeatured ? 'w-full lg:w-1/2 aspect-video lg:aspect-auto h-full shrink-0' : 'aspect-video w-full'}`}>
                                        {imgUrl ? (
                                            <Image
                                                src={imgUrl}
                                                alt={tutorial.featuredImage?.alternativeText || tutorial.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                                                priority={isFeatured}
                                                placeholder="blur"
                                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                                            />
                                        ) : (
                                            <BookOpen className={`opacity-40 block transform group-hover:scale-110 transition-transform duration-500 ${isFeatured ? 'w-24 h-24' : 'w-12 h-12'}`} />
                                        )}
                                        {/* Subtle gradient overlay to give depth */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>

                                    <div className={`flex flex-col flex-1 p-4 md:p-8 lg:p-10 ${isFeatured ? 'lg:w-1/2 justify-center' : ''}`}>
                                        {tutorial.category && (
                                            <span className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-widest rounded-full mb-3 md:mb-6 w-fit border border-blue-100 dark:border-blue-800/50 shadow-sm">
                                                {tutorial.category.name}
                                            </span>
                                        )}

                                        <h2 className={`font-extrabold text-slate-900 dark:text-white mb-2 md:mb-4 line-clamp-2 leading-[1.25] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${isFeatured ? 'text-xl md:text-3xl lg:text-4xl' : 'text-lg md:text-2xl'}`}>
                                            {tutorial.title}
                                        </h2>

                                        <p className={`text-slate-600 dark:text-slate-400 leading-relaxed mb-4 md:mb-8 flex-1 ${isFeatured ? 'line-clamp-3 text-sm md:line-clamp-4 md:text-lg' : 'line-clamp-3 text-sm md:text-base'}`}>
                                            {tutorial.seo?.metaDescription || `Pelajari selengkapnya tentang ${tutorial.title} dalam panduan teknis yang ringkas dan padat ini.`}
                                        </p>

                                        <div className="mt-auto flex items-center text-blue-600 dark:text-blue-400 font-extrabold text-sm gap-2 group-hover:gap-3 transition-all">
                                            Baca Tutorial <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })
                )}
            </motion.div>
        </section>
    );
}
