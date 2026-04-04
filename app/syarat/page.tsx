import { FileText } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Syarat & Ketentuan - TutorinBang",
  description: "Syarat dan ketentuan umum dalam menggunakan panduan dan konten di platform TutorinBang.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pb-24 pt-16 bg-slate-50 dark:bg-slate-950">
      
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-400/5 dark:bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/5 dark:bg-blue-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <article className="container mx-auto px-4 max-w-4xl relative z-10 pt-10">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6 shadow-sm border border-emerald-200/50 dark:border-emerald-800/50">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Syarat & Ketentuan</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-200/80 dark:border-slate-800/90 backdrop-blur-xl">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-a:text-emerald-600 dark:prose-a:text-emerald-400">
            
            <p className="lead text-xl">
              Ketentuan berikut ini menjadi landasan saat Anda mengakses setiap artikel, panduan, dan fitur yang ada di platform TutorinBang.
            </p>

            <h2>1. Penggunaan Konten</h2>
            <p>
              Semua panduan, artikel, dan kode yang disediakan oleh TutorinBang bersifat informatif. Anda diperkenankan menggunakan informasi ini untuk menyelesaikan kendala terkait sistem komputasi Anda secara personal maupun komersial. Namun, Anda <strong>dilarang menyalin, menduplikasi, atau mendistribusikan ulang (re-publish)</strong> artikel murni kami di website atau platform lain tanpa memberikan credit dan tautan aktif kembali ke halaman asli di TutorinBang.
            </p>

            <h2>2. Risiko Pelaksanaan Panduan</h2>
            <p>
              TutorinBang berusaha memberikan panduan troubleshoot yang akurat. Namun, penerapan panduan pada perangkat keras dan lunak Anda memiliki risiko karena lingkungan operasional yang dapat berbeda. Kegagalan sistem, kehilangan data, atau kerusakan perangkat adalah sepenuhnya menjadi <strong>tanggung jawab pengguna</strong>.
            </p>

            <h2>3. Tautan ke Situs Lain</h2>
            <p>
              Situs ini mungkin berisi link menuju ke situs atau sumber eksternal lain di luar kendali kami. Kami tidak bertanggung jawab atas isi konten, kebijakan akses, atau keamanan dari situs pihak ketiga tersebut.
            </p>

            <h2>4. Komentar dan Diskusi</h2>
            <p>
              Pengguna sangat dipersilakan untuk memberikan komentar atau bertanya di kolom yang disediakan, selama komentar yang disampaikan relevan dengan topik, tidak mengandung unsur SARA (Suku, Agama, Ras, dan Antargolongan), pelecehan, judi online, dan pornografi. Kami berhak menghapus komentar yang melanggar.
            </p>

            <h2>5. Perubahan Ketentuan</h2>
            <p>
              TutorinBang berhak memperbarui, memodifikasi, dan mengubah syarat dan ketentuan ini di masa mendatang tanpa peringatan terlebih dahulu. Kebijakan ini segera berlaku begitu dipublikasikan di halaman ini.
            </p>

            <hr className="my-10 border-slate-200 dark:border-slate-800" />

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 text-center">
              <p className="m-0 text-sm md:text-base">
                Dengan melanjutkan navigasi di website ini, berarti Anda <strong>telah membaca dan menyetujui</strong> Syarat dan Ketentuan penggunaan kami.
              </p>
            </div>

          </div>
        </div>
      </article>

    </main>
  );
}
