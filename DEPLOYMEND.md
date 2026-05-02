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
- PostgreSQL untuk database Strapi.
- Node.js LTS, rekomendasi Node.js 22.
- PM2 untuk menjalankan Strapi dan Next.js sebagai service.

Catatan versi Strapi: dokumentasi Strapi 5 saat ini mendukung Node.js LTS `v20`, `v22`, dan `v24`, serta PostgreSQL minimal `14.0`. PostgreSQL dipilih karena lebih cocok untuk production dibanding SQLite.

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
3. Install `PostgreSQL` jika tersedia di App Store.
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

## 4. Setup PostgreSQL untuk Strapi

### Opsi A: Lewat aaPanel

Jika aaPanel Anda punya PostgreSQL manager:

1. Buka `Database` atau plugin PostgreSQL.
2. Buat database: `tutorinbang_strapi`
3. Buat user: `strapi_user`
4. Buat password kuat.
5. Pastikan host database lokal: `127.0.0.1`
6. Port default PostgreSQL: `5432`

### Opsi B: Lewat SSH

Jika PostgreSQL tidak tersedia di aaPanel:

```bash
apt install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql
```

Buat database dan user:

```bash
sudo -u postgres psql
```

Di prompt PostgreSQL:

```sql
CREATE DATABASE tutorinbang_strapi;
CREATE USER strapi_user WITH ENCRYPTED PASSWORD 'GANTI_PASSWORD_DATABASE_YANG_KUAT';
GRANT ALL PRIVILEGES ON DATABASE tutorinbang_strapi TO strapi_user;
\q
```

Untuk PostgreSQL 15 ke atas, masuk ke database dan beri hak schema:

```bash
sudo -u postgres psql -d tutorinbang_strapi
```

```sql
GRANT ALL ON SCHEMA public TO strapi_user;
ALTER SCHEMA public OWNER TO strapi_user;
\q
```

## 5. Install Strapi Backend

Tempatkan backend di `/www/wwwroot/api.tutorinbang.my.id`.

```bash
mkdir -p /www/wwwroot/api.tutorinbang.my.id
cd /www/wwwroot/api.tutorinbang.my.id
```

Buat project Strapi:

```bash
npx create-strapi@latest backend --use-npm --dbclient postgres --dbhost 127.0.0.1 --dbport 5432 --dbname tutorinbang_strapi --dbusername strapi_user --dbpassword 'GANTI_PASSWORD_DATABASE_YANG_KUAT'
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
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

APP_KEYS=GANTI_KEY_1,GANTI_KEY_2,GANTI_KEY_3,GANTI_KEY_4
API_TOKEN_SALT=GANTI_API_TOKEN_SALT
ADMIN_JWT_SECRET=GANTI_ADMIN_JWT_SECRET
TRANSFER_TOKEN_SALT=GANTI_TRANSFER_TOKEN_SALT
JWT_SECRET=GANTI_JWT_SECRET
ENCRYPTION_KEY=GANTI_ENCRYPTION_KEY

DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
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
  host: env('HOST', '0.0.0.0'),
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

Build admin panel Strapi:

```bash
npm run build
```

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

Buat content type berikut di Strapi admin.

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
```

Catatan:

- Jangan commit `.env`.
- Jika tidak memakai fitur AI chat, isi `SUMOPOD_API_KEY` hanya jika route `/api/ai-chat` memang digunakan.
- Jika domain backend bukan `api.tutorinbang.my.id`, ubah juga `next.config.ts` bagian `images.remotePatterns` agar hostname backend yang baru diizinkan untuk gambar Strapi.

Build frontend:

```bash
npm run build
```

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

## 12. Reverse Proxy Frontend di aaPanel

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

## 13. Alur Update Setelah Deploy

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

## 14. Backup

Backup yang wajib:

- Database PostgreSQL.
- Folder upload Strapi: `/www/wwwroot/api.tutorinbang.my.id/backend/public/uploads`
- File `.env` backend.
- File `.env` frontend.

Backup PostgreSQL manual:

```bash
mkdir -p /www/backup/postgresql
pg_dump -U strapi_user -h 127.0.0.1 tutorinbang_strapi > /www/backup/postgresql/tutorinbang_strapi_$(date +%F).sql
```

Backup upload:

```bash
tar -czf /www/backup/postgresql/strapi_uploads_$(date +%F).tar.gz /www/wwwroot/api.tutorinbang.my.id/backend/public/uploads
```

Anda juga bisa memakai fitur backup aaPanel untuk site dan database jika tersedia.

## 15. Troubleshooting

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

## 16. Checklist Final

- [ ] DNS frontend mengarah ke IP VPS.
- [ ] DNS backend mengarah ke IP VPS.
- [ ] aaPanel, Nginx, Node.js, PM2, dan PostgreSQL terinstall.
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
