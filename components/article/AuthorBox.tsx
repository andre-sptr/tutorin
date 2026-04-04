import Link from "next/link";

export default function AuthorBox() {
  return (
    <div className="flex bg-slate-50 dark:bg-slate-900 rounded-xl p-6 mt-12 gap-5 items-start border border-slate-100 dark:border-slate-800">
      <div className="w-16 h-16 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden flex-shrink-0 border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center">
        {/* Placeholder for Author Avatar - using default icon if no image */}
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xl">
          T
        </div>
      </div>

      <div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Tim TutorinBang</h4>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-3">
          Kami adalah pegiat teknologi yang berdedikasi untuk membagikan tutorial troubleshoot, tips, dan trik untuk mengatasi berbagai kendala hardware dan software sehari-hari dengan bahasa yang santai dan mudah dipahami.
        </p>
        <Link href="/author" className="text-blue-600 dark:text-blue-400 text-sm hover:underline font-medium">
          Kenali kami lebih dekat &rarr;
        </Link>
      </div>
    </div>
  );
}
