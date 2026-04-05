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