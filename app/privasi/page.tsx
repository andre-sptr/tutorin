import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Kebijakan Privasi - TutorinBang",
  description: "Kebijakan Privasi terkait penggunaan data di halaman TutorinBang.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pb-12 md:pb-24 pt-8 md:pt-16 bg-slate-50 dark:bg-slate-950">

      {/* Background Glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-400/5 dark:bg-blue-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/5 dark:bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <article className="container mx-auto px-4 max-w-4xl relative z-10 pt-4 md:pt-10">

        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4 md:mb-6 shadow-sm border border-blue-200/50 dark:border-blue-800/50">
            <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 md:mb-4">Kebijakan Privasi</h1>
          <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Content Box */}
        <div className="bg-white dark:bg-slate-900/90 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 lg:p-12 shadow-xl border border-slate-200/80 dark:border-slate-800/90 backdrop-blur-xl">
          <div className="prose prose-sm md:prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-a:text-blue-600 dark:prose-a:text-blue-400">

            <p className="lead text-base md:text-xl">
              TutorinBang senantiasa menghargai dan melindungi privasi setiap pengunjung. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat Anda mengakses situs kami.
            </p>

            <h2>1. Informasi yang Kami Kumpulkan</h2>
            <p>
              Situs ini menggunakan <strong>cookies</strong> dan teknologi pelacakan serupa untuk meningkatkan pengalaman pengunjung. Informasi log perangkat (seperti IP Address, jenis browser, ISP, tanggal dan waktu kunjungan, dsb.) digunakan murni untuk keperluan analitik dan tidak terhubung dengan informasi identitas personal secara langsung.
            </p>

            <h2>2. Penggunaan Data</h2>
            <p>
              Informasi yang dikumpulkan digunakan untuk:
            </p>
            <ul>
              <li>Memperbaiki kualitas konten dan navigasi situs.</li>
              <li>Menganalisis statistik kunjungan dan preferensi pengguna.</li>
              <li>Menampilkan iklan yang relevan melalui jaringan pihak ketiga (Google AdSense).</li>
            </ul>

            <h2>3. Pihak Ketiga & Periklanan</h2>
            <p>
              TutorinBang bekerjasama dengan pihak ketiga (Google AdSense) untuk menampilkan iklan. Pihak ketiga ini dapat menggunakan <em>cookies</em> untuk menampilkan iklan berdasarkan kunjungan Anda ke situs ini dan situs lain di internet. Anda dapat memilih untuk menonaktifkan cookie DART dengan mengunjungi kebijakan privasi jaringan iklan dan konten Google.
            </p>

            <h2>4. Persetujuan</h2>
            <p>
              Dengan menggunakan situs web kami, Anda secara otomatis menyetujui Kebijakan Privasi kami beserta syarat-syaratnya.
            </p>

            <hr className="my-10 border-slate-200 dark:border-slate-800" />

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50">
              <p className="m-0 text-sm md:text-base">
                Jika Anda membutuhkan informasi lebih lanjut mengenai kebijakan privasi kami, silakan <Link href="/author" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">menghubungi kami di sini</Link>.
              </p>
            </div>

          </div>
        </div>
      </article>

    </main>
  );
}
