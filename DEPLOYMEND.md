# Tutorial Deploy VPS Ubuntu + aaPanel

Panduan ini menjelaskan alur deploy project TutorinBang ke VPS Ubuntu yang dikelola lewat aaPanel. Urutannya dimulai dari setup aaPanel, install dan deploy Strapi sebagai backend, membuat struktur konten yang dibutuhkan frontend ini, lalu deploy Next.js frontend.

Contoh domain yang dipakai:

- Frontend: `https://tutorinbang.my.id`
- Backend Strapi: `https://api.tutorinbang.my.id`
- Port Strapi lokal: `1337`
- Port Next.js lokal: `3001`

Ganti domain sesuai domain asli jika berbeda.

## 1. Prasyarat

Minimal server yang disarankan:

- Ubuntu LTS, idealnya Ubuntu 22.04 atau 24.04.
- RAM 2 GB minimal, 4 GB lebih aman untuk build Strapi dan Next.js.
- CPU 1 core minimal, 2 core lebih aman.
- Storage 20-30 GB minimal.
- Akses SSH root atau user sudo.
- Domain sudah diarahkan ke IP VPS:
  - `tutorinbang.my.id` -> IP VPS
  - `api.tutorinbang.my.id` -> IP VPS

Stack yang dipakai:

- aaPanel sebagai panel server.
- Nginx dari aaPanel sebagai reverse proxy.
- MySQL untuk database Strapi.
- Node.js LTS, rekomendasi Node.js 22.
- PM2 untuk menjalankan Strapi dan Next.js sebagai service.

Catatan versi Strapi: dokumentasi Strapi 5 saat ini mendukung Node.js LTS `v20`, `v22`, dan `v24`, serta MySQL minimal `8.0`. MySQL dipakai di panduan ini karena umum tersedia di aaPanel.

## 2. Install aaPanel di Ubuntu

Login ke VPS:

```bash
ssh root@IP_VPS_ANDA
```

Update server:

```bash
apt update && apt upgrade -y
apt install -y curl wget git build-essential
```

Install aaPanel Free edition:

```bash
URL=https://www.aapanel.com/script/install_panel_en.sh && if [ -f /usr/bin/curl ]; then curl -ksSO $URL; else wget --no-check-certificate -O install_panel_en.sh $URL; fi; bash install_panel_en.sh
```

Setelah selesai, aaPanel akan menampilkan URL panel, username, dan password. Simpan informasi tersebut.

Setelah login aaPanel:

1. Buka `App Store`.
2. Install `Nginx`.
3. Install `MySQL` dari App Store.
4. Install `PM2 Manager` jika tersedia.
5. Aktifkan firewall aaPanel untuk port:
   - `80`
   - `443`
   - port aaPanel Anda
   - `22` untuk SSH

Jangan expose port `1337` dan `3001` ke publik. Kedua port cukup diakses lokal oleh Nginx.

## 3. Install Node.js dan PM2

Jika aaPanel memiliki `Node.js Manager`, install Node.js 22 dari sana. Jika tidak ada, gunakan NodeSource lewat SSH:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v
npm -v
```

Install PM2 global:

```bash
npm install -g pm2
pm2 -v
```

Aktifkan PM2 startup agar service hidup lagi setelah VPS reboot:

```bash
pm2 startup systemd
```

Jalankan command yang diberikan oleh output `pm2 startup`, lalu nanti setelah semua app berjalan jalankan:

```bash
pm2 save
```

## 4. Setup MySQL untuk Strapi

### Opsi A: Lewat aaPanel

Jika aaPanel Anda punya MySQL manager:

1. Buka `Database`.
2. Buat database: `tutorinbang_strapi`
3. Buat user: `strapi_user`
4. Buat password kuat.
5. Pastikan host database lokal: `127.0.0.1`
6. Port default MySQL: `3306`

### Opsi B: Lewat SSH

Jika MySQL belum tersedia di aaPanel:

```bash
apt install -y mysql-server
systemctl enable mysql
systemctl start mysql
```

Buat database dan user:

```bash
mysql -u root -p
```

Di prompt MySQL:

```sql
CREATE DATABASE tutorinbang_strapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'strapi_user'@'localhost' IDENTIFIED BY 'GANTI_PASSWORD_DATABASE_YANG_KUAT';
GRANT ALL PRIVILEGES ON tutorinbang_strapi.* TO 'strapi_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 5. Install Strapi Backend

Tempatkan backend di `/www/wwwroot/api.tutorinbang.my.id`.

```bash
mkdir -p /www/wwwroot/api.tutorinbang.my.id
cd /www/wwwroot/api.tutorinbang.my.id
```

Buat project Strapi:

```bash
npx create-strapi@latest backend --use-npm --dbclient mysql --dbhost 127.0.0.1 --dbport 3306 --dbname tutorinbang_strapi --dbusername strapi_user --dbpassword 'GANTI_PASSWORD_DATABASE_YANG_KUAT'
```

Saat prompt Strapi muncul:

- Pilih `Skip` untuk login/signup Strapi Cloud jika ingin self-hosted penuh.
- Gunakan TypeScript default.
- Jangan gunakan example data untuk production.

Masuk folder backend:

```bash
cd /www/wwwroot/api.tutorinbang.my.id/backend
```

Generate secret:

```bash
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32
```

Edit file `.env`:

```bash
nano .env
```

Contoh konfigurasi:

```env
HOST=127.0.0.1
PORT=1337
NODE_ENV=production

APP_KEYS=GANTI_KEY_1,GANTI_KEY_2,GANTI_KEY_3,GANTI_KEY_4
API_TOKEN_SALT=GANTI_API_TOKEN_SALT
ADMIN_JWT_SECRET=GANTI_ADMIN_JWT_SECRET
TRANSFER_TOKEN_SALT=GANTI_TRANSFER_TOKEN_SALT
JWT_SECRET=GANTI_JWT_SECRET
ENCRYPTION_KEY=GANTI_ENCRYPTION_KEY

DATABASE_CLIENT=mysql
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=tutorinbang_strapi
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=GANTI_PASSWORD_DATABASE_YANG_KUAT
DATABASE_SSL=false

PUBLIC_URL=https://api.tutorinbang.my.id
```

Pastikan `config/server.ts` membaca URL public dan proxy. Buka file:

```bash
nano config/server.ts
```

Gunakan konfigurasi seperti ini:

```ts
export default ({ env }) => ({
  host: env('HOST', '127.0.0.1'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  proxy: {
    koa: true,
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
});
```

Pastikan plugin `users-permissions` membaca `JWT_SECRET`. Jika file belum ada, buat:

```bash
nano config/plugins.ts
```

Isi:

```ts
export default ({ env }) => ({
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
      jwt: {
        expiresIn: '7d',
      },
    },
  },
});
```

Jika `config/plugins.ts` sudah ada, jangan overwrite isi lama. Tambahkan blok `'users-permissions'` ke object export yang sudah ada.

Build admin panel Strapi:

```bash
npm run build
```

Jika VPS hanya memiliki RAM 1-2 GB dan build gagal karena JavaScript heap out of memory, lihat bagian [JavaScript heap out of memory saat build](#javascript-heap-out-of-memory-saat-build).

Test jalan lokal:

```bash
NODE_ENV=production npm run start
```

Buka dari SSH lain:

```bash
curl -I http://127.0.0.1:1337/_health
```

Jika health check OK, hentikan proses manual dengan `Ctrl+C`.

## 6. Jalankan Strapi dengan PM2

Buat file PM2:

```bash
nano ecosystem.config.cjs
```

Isi:

```js
module.exports = {
  apps: [
    {
      name: "tutorinbang-strapi",
      cwd: "/www/wwwroot/api.tutorinbang.my.id/backend",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
```

Start:

```bash
pm2 start ecosystem.config.cjs
pm2 logs tutorinbang-strapi
```

Simpan proses:

```bash
pm2 save
```

## 7. Reverse Proxy Strapi di aaPanel

Di aaPanel:

1. Buka `Website`.
2. Klik `Add Site`.
3. Domain: `api.tutorinbang.my.id`
4. Root directory bisa diarahkan ke `/www/wwwroot/api.tutorinbang.my.id`.
5. Pilih PHP: `Static` atau `Pure static`, karena Strapi berjalan lewat Node.js.
6. Simpan.

Aktifkan reverse proxy:

1. Klik site `api.tutorinbang.my.id`.
2. Buka `URL Proxy` atau `Reverse proxy`.
3. Tambah proxy:
   - Proxy name: `strapi`
   - Proxy directory: `/`
   - Target URL: `http://127.0.0.1:1337`
   - Sent domain: `api.tutorinbang.my.id`
   - Cache: off

Jika perlu edit konfigurasi Nginx manual, gunakan:

```nginx
location / {
    proxy_pass http://127.0.0.1:1337;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_cache_bypass $http_upgrade;
    client_max_body_size 100M;
}
```

Reload Nginx dari aaPanel atau SSH:

```bash
nginx -t
systemctl reload nginx
```

Aktifkan SSL:

1. Buka site `api.tutorinbang.my.id`.
2. Buka menu `SSL`.
3. Pilih Let's Encrypt.
4. Apply certificate.
5. Aktifkan force HTTPS.

Test:

```bash
curl -I https://api.tutorinbang.my.id/_health
```

Pastikan port Strapi tidak terbuka langsung ke publik. Dari VPS, cek Strapi hanya listen di localhost:

```bash
ss -ltnp | grep 1337
```

Output yang aman terlihat seperti `127.0.0.1:1337`. Jika terlihat `0.0.0.0:1337`, ubah `.env` backend menjadi `HOST=127.0.0.1`, restart Strapi, dan pastikan firewall aaPanel tidak membuka port `1337`.

Strapi admin akan tersedia di:

```text
https://api.tutorinbang.my.id/admin
```

Buat admin user pertama dari halaman tersebut.

## 8. Buat Content Type Strapi untuk Frontend Ini

Frontend membaca endpoint:

- `/api/tutorials`
- `/api/categories`
- `/api/tags`

Content-Type Builder Strapi hanya bisa dipakai di development mode. Jika Strapi berjalan dengan `NODE_ENV=production`, akan muncul pesan:

```text
Strapi is in production mode, editing content types is disabled. Please switch to development mode by starting your server with strapi develop.
```

Untuk setup awal, hentikan proses production lalu jalankan Strapi dalam development mode:

```bash
cd /www/wwwroot/api.tutorinbang.my.id/backend
pm2 stop tutorinbang-strapi
NODE_ENV=development npm run develop
```

Jika saat membuka admin muncul error seperti ini:

```text
Blocked request. This host ("api.tutorinbang.my.id") is not allowed.
To allow this host, add "api.tutorinbang.my.id" to `server.allowedHosts` in vite.config.js.
```

Artinya Vite dev server milik Strapi Admin memblokir domain reverse proxy. Tambahkan allowlist host admin:

```bash
mkdir -p src/admin
nano src/admin/vite.config.ts
```

Isi:

```ts
import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  return mergeConfig(config, {
    server: {
      allowedHosts: ['api.tutorinbang.my.id'],
    },
  });
};
```

Jika project Strapi Anda JavaScript, gunakan `src/admin/vite.config.js`:

```js
const { mergeConfig } = require('vite');

module.exports = (config) => {
  return mergeConfig(config, {
    server: {
      allowedHosts: ['api.tutorinbang.my.id'],
    },
  });
};
```

Jalankan ulang development mode:

```bash
NODE_ENV=development npm run develop
```

Gunakan domain milik sendiri secara eksplisit. Hindari `allowedHosts: true` kecuali hanya untuk percobaan sangat sementara, karena itu mengizinkan host apa pun mengakses dev server.

Setelah Strapi develop berjalan, buka:

```text
https://api.tutorinbang.my.id/admin
```

Buat content type berikut lewat `Content-Type Builder`.

Catatan penting:

- Jika hanya ingin menambah data kategori baru, lakukan dari `Content Manager`, bukan `Content-Type Builder`.
- Jika menu `Category` belum ada di `Content Manager`, berarti collection type `Category` memang belum dibuat.
- Setelah struktur content type selesai dibuat, hentikan `npm run develop` dengan `Ctrl+C`, lalu rebuild dan jalankan lagi mode production.

### Category

Collection Type: `Category`

Fields:

- `name`: Text, short text, required
- `slug`: UID, attached field `name`, required

API ID yang diharapkan Strapi biasanya:

- Singular: `category`
- Plural: `categories`

### Tag

Collection Type: `Tag`

Fields:

- `name`: Text, short text, required
- `slug`: UID, attached field `name`, required

API ID:

- Singular: `tag`
- Plural: `tags`

### Tutorial

Collection Type: `Tutorial`

Fields:

- `title`: Text, short text, required
- `slug`: UID, attached field `title`, required
- `content`: Rich text atau Blocks, required
- `featuredImage`: Media, single media
- `category`: Relation many-to-one ke `Category`
- `tags`: Relation many-to-many ke `Tag`
- `seo`: Component, optional

Component `seo`:

- `metaTitle`: Text
- `metaDescription`: Text, long text
- `canonicalUrl`: Text

Penting:

- Aktifkan `Draft & Publish` untuk `Tutorial`.
- Publish setiap tutorial yang ingin muncul di frontend.
- Upload gambar ke Media Library; frontend membaca path `/uploads/**`.

Setelah semua content type selesai dibuat, kembali ke production mode:

```bash
npm run build
pm2 restart tutorinbang-strapi
pm2 save
```

Untuk production yang sudah live, jangan ubah struktur content type langsung di server tanpa backup. Alur yang lebih aman adalah membuat perubahan content type di environment development, commit file schema Strapi, lalu deploy ke server.

## 9. Set Permission Public API Strapi

Karena frontend ini mengambil data tanpa token API, permission public Strapi harus dibuka untuk read-only.

Di Strapi admin:

1. Buka `Settings`.
2. Buka `Users & Permissions Plugin`.
3. Pilih `Roles`.
4. Pilih `Public`.
5. Aktifkan permission:
   - `category.find`
   - `category.findOne`
   - `tag.find`
   - `tag.findOne`
   - `tutorial.find`
   - `tutorial.findOne`
6. Save.

Jangan aktifkan create, update, delete untuk role public.

Test endpoint:

```bash
curl "https://api.tutorinbang.my.id/api/tutorials?populate=*"
curl "https://api.tutorinbang.my.id/api/categories"
curl "https://api.tutorinbang.my.id/api/tags"
```

## 10. Deploy Frontend Next.js

Folder frontend contoh:

```bash
/www/wwwroot/tutorinbang.my.id/frontend
```

Clone project:

```bash
mkdir -p /www/wwwroot/tutorinbang.my.id
cd /www/wwwroot/tutorinbang.my.id
git clone REPOSITORY_FRONTEND_ANDA frontend
cd frontend
```

Install dependency:

```bash
npm install
```

Buat `.env` frontend:

```bash
nano .env
```

Isi:

```env
NEXT_PUBLIC_STRAPI_URL=https://api.tutorinbang.my.id
NEXT_PUBLIC_SITE_URL=https://tutorinbang.my.id
SUMOPOD_API_KEY=GANTI_API_KEY_ANDA
AI_IMAGE_ENABLED=false
AI_IMAGE_PROVIDER=vertex
AI_IMAGE_MODEL=gemini-3-pro-image-preview
GEMINI_API_KEY=GANTI_VERTEX_AI_EXPRESS_API_KEY
AI_IMAGE_ASPECT_RATIO=16:9
AI_IMAGE_MIME_TYPE=image/png
ADMIN_USERNAME=admin
ADMIN_PASSWORD=uciha361
ADMIN_SESSION_SECRET=GANTI_SECRET_PANJANG_RANDOM
STRAPI_WRITE_TOKEN=GANTI_API_TOKEN_STRAPI
CRON_SECRET=GANTI_SECRET_CRON
```

Catatan:

- Jangan commit `.env`.
- `SUMOPOD_API_KEY` dipakai oleh route `/api/ai-chat` dan generator konten AI di admin panel.
- `AI_IMAGE_ENABLED=true` mengaktifkan generator `featuredImage` untuk draft AI lewat Vertex AI Express (`@google/genai` dengan `GEMINI_API_KEY`). Jika key/model image belum siap atau provider gagal, draft tetap dibuat tanpa gambar dan admin panel menampilkan warning.
- `ADMIN_SESSION_SECRET` dan `CRON_SECRET` gunakan nilai random panjang. Contoh generate: `openssl rand -base64 32`.
- Buat `STRAPI_WRITE_TOKEN` dari Strapi admin dengan permission minimal: read/create/update `tutorials`, read/create `categories`, read/create `tags`, dan upload media.
- Jika domain backend bukan `api.tutorinbang.my.id`, ubah juga `next.config.ts` bagian `images.remotePatterns` agar hostname backend yang baru diizinkan untuk gambar Strapi.

Build frontend:

```bash
npm run build
```

Jika VPS hanya memiliki RAM 1-2 GB dan build gagal karena JavaScript heap out of memory, lihat bagian [JavaScript heap out of memory saat build](#javascript-heap-out-of-memory-saat-build).

Test manual:

```bash
npm run start
```

Script project ini menjalankan Next.js di port `3001`:

```json
"start": "next start -p 3001"
```

Jika sudah OK, hentikan dengan `Ctrl+C`.

## 11. Jalankan Frontend dengan PM2

Buat file PM2 di folder frontend:

```bash
nano ecosystem.config.cjs
```

Isi:

```js
module.exports = {
  apps: [
    {
      name: "tutorinbang-frontend",
      cwd: "/www/wwwroot/tutorinbang.my.id/frontend",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
```

Start:

```bash
pm2 start ecosystem.config.cjs
pm2 logs tutorinbang-frontend
pm2 save
```

## 12. Cron AI Content Generator

Admin panel frontend tersedia di:

```text
https://tutorinbang.my.id/admin
```

Generator otomatis harian tidak berjalan dari browser. Jalankan dari cron VPS agar endpoint Next.js dipanggil setiap jam 09.00 WIB.

Buka crontab:

```bash
crontab -e
```

Tambahkan:

```cron
TZ=Asia/Jakarta
0 9 * * * curl -fsS -X POST https://tutorinbang.my.id/api/cron/generate-content -H "Authorization: Bearer GANTI_SECRET_CRON" >> /var/log/tutorinbang-ai-cron.log 2>&1
```

Endpoint ini membuat satu draft tutorial di Strapi, bukan langsung publish. Review draft bisa dilakukan dari `/admin` atau Strapi admin.

## 13. Reverse Proxy Frontend di aaPanel

Di aaPanel:

1. Buka `Website`.
2. Klik `Add Site`.
3. Domain: `tutorinbang.my.id`
4. Root directory: `/www/wwwroot/tutorinbang.my.id`
5. PHP: `Static` atau `Pure static`.
6. Simpan.

Tambahkan reverse proxy:

- Proxy name: `frontend`
- Proxy directory: `/`
- Target URL: `http://127.0.0.1:3001`
- Sent domain: `tutorinbang.my.id`
- Cache: off

Jika edit Nginx manual:

```nginx
location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_cache_bypass $http_upgrade;
}
```

Aktifkan SSL Let's Encrypt untuk `tutorinbang.my.id` dan force HTTPS.

Test:

```bash
curl -I https://tutorinbang.my.id
curl -I https://tutorinbang.my.id/sitemap.xml
```

## 14. Alur Update Setelah Deploy

### Update Backend Strapi

```bash
cd /www/wwwroot/api.tutorinbang.my.id/backend
git pull
npm install
npm run build
pm2 restart tutorinbang-strapi
pm2 save
```

### Update Frontend

```bash
cd /www/wwwroot/tutorinbang.my.id/frontend
git pull
npm install
npm run build
pm2 restart tutorinbang-frontend
pm2 save
```

## 15. Backup

Backup yang wajib:

- Database MySQL.
- Folder upload Strapi: `/www/wwwroot/api.tutorinbang.my.id/backend/public/uploads`
- File `.env` backend.
- File `.env` frontend.

Backup MySQL manual:

```bash
mkdir -p /www/backup/mysql
mysqldump -u strapi_user -p tutorinbang_strapi > /www/backup/mysql/tutorinbang_strapi_$(date +%F).sql
```

Backup upload:

```bash
tar -czf /www/backup/mysql/strapi_uploads_$(date +%F).tar.gz /www/wwwroot/api.tutorinbang.my.id/backend/public/uploads
```

Anda juga bisa memakai fitur backup aaPanel untuk site dan database jika tersedia.

## 16. Troubleshooting

### JavaScript heap out of memory saat build

Error seperti ini biasanya muncul saat `npm run build` untuk Strapi atau Next.js kehabisan memory di VPS:

```text
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
Aborted (core dumped)
```

Dari log `973.9 (988.6) MB`, Node.js sedang mentok di sekitar 1 GB heap. Penyebab paling umum:

- RAM VPS terlalu kecil untuk proses build.
- Swap belum aktif.
- Node.js heap limit default terlalu rendah untuk build Strapi/Next.js.
- Strapi dan frontend sedang berjalan bersamaan saat build, sehingga RAM tersisa makin kecil.

Cek kondisi RAM dan swap:

```bash
free -h
swapon --show
df -h /
```

Jika swap belum ada, buat swap 2 GB. Untuk VPS 1 GB RAM, gunakan 2-4 GB swap:

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' >> /etc/fstab
free -h
```

Jika `fallocate` gagal, gunakan command ini sebagai pengganti:

```bash
dd if=/dev/zero of=/swapfile bs=1M count=2048 status=progress
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' >> /etc/fstab
free -h
```

Hentikan sementara service yang tidak dibutuhkan saat build:

```bash
pm2 stop tutorinbang-strapi
pm2 stop tutorinbang-frontend
```

Jalankan build dengan heap lebih besar:

```bash
export NODE_OPTIONS="--max-old-space-size=2048"
npm run build
unset NODE_OPTIONS
```

Jika VPS memiliki RAM 4 GB atau lebih, bisa gunakan:

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
unset NODE_OPTIONS
```

Setelah build berhasil, jalankan lagi service:

```bash
pm2 restart tutorinbang-strapi
pm2 restart tutorinbang-frontend
pm2 save
```

Jika error masih muncul:

- Pastikan Node.js memakai versi LTS yang didukung Strapi, misalnya Node.js 22.
- Jalankan build backend dan frontend bergantian, jangan bersamaan.
- Gunakan VPS minimal 2 GB RAM untuk production ringan, 4 GB lebih aman.
- Jika tetap gagal di VPS kecil, build di mesin lokal/CI lalu deploy hasil build ke server.

### 502 Bad Gateway

Cek PM2:

```bash
pm2 list
pm2 logs tutorinbang-strapi
pm2 logs tutorinbang-frontend
```

Cek port lokal:

```bash
curl -I http://127.0.0.1:1337/_health
curl -I http://127.0.0.1:3001
```

Jika lokal tidak jalan, masalah ada di app/PM2. Jika lokal jalan tapi domain 502, masalah ada di reverse proxy Nginx aaPanel.

### Gambar Strapi tidak muncul di frontend

Pastikan:

- `NEXT_PUBLIC_STRAPI_URL` sudah `https://api.tutorinbang.my.id`.
- Domain backend ada di `next.config.ts` bagian `images.remotePatterns`.
- File gambar bisa dibuka langsung, contoh:

```text
https://api.tutorinbang.my.id/uploads/nama_file.jpg
```

Setelah mengubah `next.config.ts`, rebuild frontend:

```bash
npm run build
pm2 restart tutorinbang-frontend
```

### `/api/tutorials` kosong

Pastikan:

- Tutorial sudah dipublish.
- Public role punya permission `find` dan `findOne`.
- Field relation dan media sudah dibuat sesuai struktur di atas.

### Admin Strapi redirect atau URL salah

Pastikan `.env` backend:

```env
PUBLIC_URL=https://api.tutorinbang.my.id
```

Pastikan `config/server.ts` memiliki:

```ts
url: env('PUBLIC_URL', 'http://localhost:1337'),
proxy: { koa: true },
```

Lalu rebuild dan restart:

```bash
npm run build
pm2 restart tutorinbang-strapi
```

### `/admin` Not Found atau `index.html` tidak ditemukan

Error di log PM2:

```text
Error: ENOENT: no such file or directory, open '/www/wwwroot/api.tutorinbang.my.id/backend/node_modules/@strapi/admin/dist/server/server/build/index.html'
```

Artinya Strapi berjalan dalam production mode, tetapi admin panel belum berhasil dibuild. Production mode tidak menjalankan Vite dev server; Strapi harus punya hasil build admin berupa `index.html`.

Masuk ke folder backend:

```bash
cd /www/wwwroot/api.tutorinbang.my.id/backend
```

Pastikan dependency lengkap:

```bash
npm install
```

Build ulang admin:

```bash
npm run build
```

Jika VPS kecil dan build gagal karena memory, gunakan:

```bash
export NODE_OPTIONS="--max-old-space-size=2048"
npm run build
unset NODE_OPTIONS
```

Pastikan file admin build sudah ada:

```bash
find node_modules/@strapi/admin -path '*build/index.html' -print
```

Jika command di atas tidak menghasilkan path apa pun, berarti build belum sukses. Baca ulang output `npm run build` sampai benar-benar selesai tanpa error.

Restart Strapi:

```bash
pm2 restart tutorinbang-strapi
pm2 logs tutorinbang-strapi
```

Lalu test:

```bash
curl -I http://127.0.0.1:1337/admin
curl -I https://api.tutorinbang.my.id/admin
```

Jangan menjalankan production dengan `NODE_ENV=production npm run start` sebelum `npm run build` berhasil.

### Missing jwtSecret saat menjalankan Strapi

Error:

```text
Missing jwtSecret. Please, set configuration variable "jwtSecret" for the users-permissions plugin in config/plugins.js
```

Artinya plugin `users-permissions` tidak menemukan secret untuk menandatangani JWT. Biasanya ini terjadi karena `JWT_SECRET` belum ada di `.env`, atau sudah ada tetapi belum dibaca dari `config/plugins.ts`.

Pastikan `.env` backend memiliki:

```env
JWT_SECRET=GANTI_JWT_SECRET_YANG_KUAT
```

Jika perlu generate nilai baru:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Buat atau edit `config/plugins.ts`:

```bash
nano config/plugins.ts
```

Isi minimal:

```ts
export default ({ env }) => ({
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
      jwt: {
        expiresIn: '7d',
      },
    },
  },
});
```

Jika file tersebut sudah berisi konfigurasi plugin lain, merge blok `'users-permissions'` ke object yang sudah ada.

Rebuild dan jalankan ulang:

```bash
npm run build
NODE_ENV=production npm run start
```

Catatan: warning MySQL seperti ini biasanya muncul saat Strapi menjalankan migration dan bukan penyebab Strapi mati:

```text
Transaction was implicitly committed, do not mix transactions and DDL with MySQL (#805)
```

Penyebab Strapi mati pada kasus ini adalah baris `Missing jwtSecret`.

## 17. Checklist Final

- [ ] DNS frontend mengarah ke IP VPS.
- [ ] DNS backend mengarah ke IP VPS.
- [ ] aaPanel, Nginx, Node.js, PM2, dan MySQL terinstall.
- [ ] Strapi berjalan di PM2 dengan nama `tutorinbang-strapi`.
- [ ] Strapi bisa diakses dari `https://api.tutorinbang.my.id/admin`.
- [ ] Content type `Tutorial`, `Category`, dan `Tag` sudah dibuat.
- [ ] Public permission read-only sudah aktif.
- [ ] Endpoint `/api/tutorials?populate=*` menghasilkan data.
- [ ] Frontend `.env` mengarah ke backend production.
- [ ] Frontend berhasil `npm run build`.
- [ ] Frontend berjalan di PM2 dengan nama `tutorinbang-frontend`.
- [ ] SSL aktif untuk frontend dan backend.
- [ ] `https://tutorinbang.my.id`, `/tutorial`, `/sitemap.xml`, dan `/robots.txt` bisa dibuka.
- [ ] Backup database dan uploads sudah disiapkan.

## Referensi

- Strapi CLI installation: https://docs.strapi.io/cms/installation/cli
- Strapi deployment guide: https://docs.strapi.io/cms/deployment
- Strapi environment variables: https://docs.strapi.io/cms/configurations/environment
- Strapi server configuration: https://docs.strapi.io/cms/configurations/server
- aaPanel install page: https://www.aapanel.com/install.html
- aaPanel reverse proxy docs: https://www.aapanel.com/docs/Function/proxy.html
