# Modern Content & Tutorial Platform

Proyek ini adalah aplikasi web berbasis **Next.js (App Router)** yang dirancang untuk menyajikan artikel atau tutorial secara dinamis. Data dikelola secara terpisah menggunakan **Strapi CMS**, memungkinkan pengelolaan konten yang fleksibel dan efisien.

## 🚀 Teknologi Utama

* **Frontend:** Next.js 15 (App Router)
* **Bahasa:** TypeScript
* **Styling:** Tailwind CSS
* **Animasi:** Framer Motion
* **Ikon:** Lucide React
* **Backend:** Strapi CMS

## ✨ Fitur Utama

* **Dynamic Content Rendering:** Merender konten dari Strapi Blocks secara dinamis termasuk teks kaya, gambar, dan blok kode.
* **Search System:** Fitur pencarian artikel secara real-time melalui API internal.
* **Dark Mode:** Dukungan tema terang dan gelap yang terintegrasi dengan `next-themes`.
* **SEO Optimized:** Dilengkapi dengan pembuatan `sitemap.xml` dan `robots.txt` secara otomatis, serta dukungan OpenGraph.
* **Reading Experience:** Dilengkapi dengan bilah progres membaca (reading progress bar) dan daftar isi otomatis (table of contents).
* **Responsive Design:** Tampilan yang optimal di berbagai ukuran perangkat menggunakan Tailwind CSS.

## 🛠️ Persiapan Lingkungan

Buat file `.env` di direktori utama dan tambahkan variabel berikut:

```env
# URL ke Backend Strapi Anda
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# URL Utama Website Anda
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# AI chat dan AI content generator
SUMOPOD_API_KEY=isi_api_key_ai

# Optional: featuredImage generator untuk draft AI via Vertex AI Express
AI_IMAGE_ENABLED=false
AI_IMAGE_PROVIDER=vertex
AI_IMAGE_MODEL=gemini-3-pro-image-preview
GEMINI_API_KEY=isi_vertex_ai_express_api_key
AI_IMAGE_ASPECT_RATIO=16:9
AI_IMAGE_MIME_TYPE=image/png
AI_IMAGE_TIMEOUT_MS=20000

# Admin panel /admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=uciha361
ADMIN_SESSION_SECRET=isi_secret_panjang_random

# Token tulis Strapi untuk membuat draft tutorial/kategori/tag
STRAPI_WRITE_TOKEN=isi_api_token_strapi

# Secret untuk endpoint cron /api/cron/generate-content
CRON_SECRET=isi_secret_cron
```

Admin panel tersedia di `/admin`. Untuk menjalankan generator otomatis harian, panggil endpoint cron dengan header:

```bash
curl -fsS -X POST http://localhost:3000/api/cron/generate-content -H "Authorization: Bearer $CRON_SECRET"
```

Draft AI otomatis mengisi `seo.canonicalUrl` dari `NEXT_PUBLIC_SITE_URL` dan slug artikel. Jika `AI_IMAGE_ENABLED=true`, generator juga mencoba membuat gambar featured image lewat Vertex AI Express (`@google/genai` dengan `GEMINI_API_KEY`), upload ke Strapi Media Library, lalu memasangnya ke field `featuredImage`. Jika image provider belum dikonfigurasi, gagal, atau melewati `AI_IMAGE_TIMEOUT_MS`, draft tetap dibuat dan admin panel menampilkan warning.
