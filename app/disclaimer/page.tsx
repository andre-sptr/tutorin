import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Penafian (Disclaimer) - TutorinBang",
  description: "Penafian (Disclaimer) dan batasan tanggung jawab untuk konten di TutorinBang.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen pb-12 md:pb-24 pt-8 md:pt-16 bg-slate-50 dark:bg-slate-950">

      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-amber-400/5 dark:bg-amber-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-orange-400/5 dark:bg-orange-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <article className="container mx-auto px-4 max-w-4xl relative z-10 pt-4 md:pt-10">

        <div className="text-center mb-6 md:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-4 md:mb-6 shadow-sm border border-amber-200/50 dark:border-amber-800/50">
            <AlertTriangle className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 md:mb-4">Penafian (Disclaimer)</h1>
          <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 lg:p-12 shadow-xl border border-slate-200/80 dark:border-slate-800/90 backdrop-blur-xl">
          <div className="prose prose-sm md:prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-a:text-amber-600 dark:prose-a:text-amber-400 group-hover:prose-a:text-amber-500">

            <p className="lead text-base md:text-xl">
              Seluruh informasi di situs web TutorinBang (<a href="/" className="font-semibold">https://tutorinbang.my.id</a>) diterbitkan dengan itikad baik dan untuk tujuan informasi umum saja.
            </p>

            <h2>1. Tidak Ada Jaminan Khusus</h2>
            <p>
              Kami berusaha menyajikan konten secara komprehensif menurut pengalaman tim dan literatur teruji. Meski demikian, TutorinBang tidak membuat pernyataan atau jaminan mengenai kelengkapan, keandalan, dan keakuratan informasi ini. Setiap tindakan yang Anda ambil terkait informasi yang Anda temukan di situs web ini mutlak menjadi <strong>risiko Anda sendiri</strong>.
            </p>

            <h2>2. Pengecualian Tanggung Jawab</h2>
            <p>
              TutorinBang tidak akan bertanggung jawab atas segala kerugian dan/atau kerusakan material maupun immaterial (seperti kehilangan data, perangkat yang terkunci, atau kerusakan fisik pada hardware keras) sehubungan dengan penggunaan situs web kami secara langsung maupun tidak langsung.
            </p>
            <p>
              Harap diyakini bahwa semua proses *Command Line*, manipulasi sistem direktori OS (seperti *Registry Editor*, mode BIOS), dan perbaikan Hardware memerlukan ketelitian. Kami selalu menyarankan agar Anda melakukan proses back-up secara mandiri sebelum melangkah lebih jauh.
            </p>

            <h2>3. Konten Eksternal dan Iklan</h2>
            <p>
              Dari situs web kami, Anda mungkin dapat terhubung ke situs web lain melalui "hyperlink". Meskipun kami berupaya menyediakan tautan berkualitas, konten dari situs eksternal ini di luar kontrol dari tim TutorinBang. Tautan ini tidak selalu menyiratkan bahwa kami merekomendasikan segala sesuatu yang ada di situs tersebut secara keseluruhan.
            </p>
            <p>
              Beberapa bagian dari situs website kami dapat menampilkan platform periklanan seperti iklan jaringan atau link afiliasi, kompensasi dari layanan iklan yang tertera akan digunakan untuk membantu pembiayaan dan pemeliharaan platform.
            </p>

            <h2>4. Persetujuan</h2>
            <p>
              Dengan menggunakan situs web kami, Anda dengan ini menyetujui keberadaan halaman penafian *(disclaimer)* kami dan menyetujui ketentuan-ketentuannya.
            </p>

            <hr className="my-10 border-slate-200 dark:border-slate-800" />

            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/50">
              <p className="m-0 text-sm md:text-base">
                Bila kami memperbarui, mengubah atau membuat perubahan apa pun pada dokumen ini, perubahan tersebut akan diposting dengan jelas di halaman ini. Jika ada pertanyaan, silakan <Link href="/author" className="font-semibold text-amber-600 dark:text-amber-400 hover:underline">menghubungi kami di sini</Link>.
              </p>
            </div>

          </div>
        </div>
      </article>

    </main>
  );
}
