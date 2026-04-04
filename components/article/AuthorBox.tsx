export default function AuthorBox() {
  return (
    <div className="flex bg-slate-50 rounded-xl p-6 mt-12 gap-5 items-start">
      <div className="w-16 h-16 rounded-full bg-slate-300 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm flex-center">
        {/* Placeholder for Author Avatar - using default icon if no image */}
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-blue-600 font-bold text-xl">
          T
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-bold text-slate-900 mb-1">Tim TutorinBang</h4>
        <p className="text-slate-600 text-sm leading-relaxed mb-3">
          Kami adalah tim developer yang berdedikasi untuk membagikan wawasan, trik, dan tutorial seputar pengembangan web modern, JavaScript, dan ekosistem terkait.
        </p>
        <a href="/tentang" className="text-blue-600 text-sm hover:underline font-medium">
          Kenali kami lebih dekat &rarr;
        </a>
      </div>
    </div>
  );
}
