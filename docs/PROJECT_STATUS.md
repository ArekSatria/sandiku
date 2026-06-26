# Status Proyek SANDISCAN

## Status Terakhir

**Tanggal status:** 16 Juni 2026
**Tanggal deployment awal:** 10 Juni 2026

SANDISCAN telah mencapai tahap purwarupa full-stack yang dapat digunakan melalui lingkungan produksi. Frontend dan backend telah ditempatkan pada Vercel secara terpisah, sedangkan basis data produksi menggunakan Neon PostgreSQL 16.

Setelah proses cleanup proyek, konfigurasi backend, frontend, lint, pengujian backend, dan koneksi produksi telah diverifikasi ulang. Frontend produksi telah berhasil mengakses backend produksi setelah konfigurasi CORS disesuaikan dengan domain frontend.

SANDISCAN dikembangkan secara mandiri dan bukan sistem resmi atau perangkat operasional instansi tempat magang.

## Akses Produksi

| Komponen     | Status | Alamat                                      |
| ------------ | ------ | ------------------------------------------- |
| Frontend     | Aktif  | https://SANDISCAN-frontend.vercel.app       |
| Backend      | Aktif  | https://SANDISCAN-backend.vercel.app        |
| Status API   | Aktif  | https://SANDISCAN-backend.vercel.app/       |
| Health Check | Aktif  | https://SANDISCAN-backend.vercel.app/health |
| Swagger UI   | Aktif  | https://SANDISCAN-backend.vercel.app/docs   |
| Basis Data   | Aktif  | Neon PostgreSQL 16                          |

> Swagger UI masih aktif untuk kebutuhan dokumentasi dan demonstrasi. Untuk penggunaan produksi final, endpoint dokumentasi dapat dinonaktifkan melalui konfigurasi `ENABLE_DOCS=false`.

## Konfigurasi Produksi

| Komponen                       | Keterangan                                         |
| ------------------------------ | -------------------------------------------------- |
| Platform frontend              | Vercel                                             |
| Platform backend               | Vercel                                             |
| Proyek Neon                    | `SANDISCAN`                                        |
| Database                       | `neondb`                                           |
| Wilayah                        | Asia Pacific/Singapore (`aws-ap-southeast-1`)      |
| Tabel produksi                 | `users` dan `analysis_logs`                        |
| Tanggal deployment awal        | 10 Juni 2026                                       |
| Tanggal verifikasi ulang       | 16 Juni 2026                                       |
| Data uji saat dokumentasi awal | 2 rekaman, dapat berubah sesuai aktivitas analisis |
| Akun deployment                | Akun pribadi pengembang                            |

## Fitur yang Sudah Tersedia

- Halaman beranda dan informasi privasi.
- Halaman analisis kata sandi.
- Skor keamanan dalam rentang 0 sampai 100.
- Lima kategori kekuatan kata sandi: Sangat Lemah, Lemah, Sedang, Kuat, dan Sangat Kuat.
- Pemeriksaan kekuatan kata sandi menggunakan zxcvbn.
- Pemeriksaan pola lemah melalui rule-based checking.
- Pemeriksaan kata sandi umum melalui blocklist lokal.
- Pemeriksaan indikasi kebocoran publik melalui Have I Been Pwned dengan pendekatan k-Anonymity.
- Rekomendasi perbaikan kata sandi dalam bahasa Indonesia.
- Penyimpanan metadata analisis secara anonim.
- Login administrator.
- Token JWT.
- Pemeriksaan status aktif administrator.
- Dashboard statistik.
- Riwayat maksimal 50 analisis terbaru.
- Ekspor riwayat analisis dalam format CSV.
- Format waktu Indonesia dengan zona WIB.
- Rate limiting dasar pada endpoint tertentu.
- Security headers pada backend.
- Dokumentasi OpenAPI/Swagger.
- Pengujian otomatis backend.
- Deployment frontend dan backend secara terpisah.
- Koneksi Neon PostgreSQL untuk basis data produksi.
- Konfigurasi CORS production yang membatasi akses ke domain frontend yang diizinkan.

## Hasil Verifikasi Teknis

### Backend

- 32 pengujian backend lulus.
- Pengujian mencakup analisis kata sandi, blocklist, rule checker, HIBP, autentikasi, JWT, dashboard, rate limiting, dan security headers.
- Endpoint produksi `/` aktif.
- Endpoint produksi `/health` aktif.
- Backend berhasil merespons permintaan dari frontend setelah konfigurasi CORS production diperbaiki.
- Total coverage terakhir yang terdokumentasi adalah 83%. Nilai coverage perlu diverifikasi ulang jika struktur test atau source code berubah.

### Frontend

- Proses build produksi berhasil.
- Pemeriksaan lint frontend berhasil.
- Rute utama tersedia: `/`, `/analyzer`, `/login`, dan `/dashboard`.
- Frontend terhubung dengan backend melalui `VITE_API_BASE_URL`.
- Halaman analisis berhasil mengirim permintaan ke endpoint backend `/api/analyze`.
- Error CORS production telah diperbaiki melalui penyesuaian `CORS_ORIGINS` pada backend Vercel.

## Verifikasi Deployment Terakhir

| Area              | Status  | Catatan                                                    |
| ----------------- | ------- | ---------------------------------------------------------- |
| Git lokal         | Bersih  | Branch `main` sinkron dengan `origin/main`                 |
| Cleanup proyek    | Selesai | File template/generated yang tidak digunakan telah dihapus |
| Backend test      | Lulus   | 32 pengujian lulus                                         |
| Frontend lint     | Lulus   | Tidak ada error lint setelah perbaikan `Dashboard.jsx`     |
| Frontend build    | Lulus   | Build produksi berhasil                                    |
| Backend Vercel    | Aktif   | Endpoint API dapat diakses                                 |
| Frontend Vercel   | Aktif   | Halaman produksi dapat dibuka                              |
| CORS production   | Selesai | Domain frontend telah diizinkan oleh backend               |
| Database produksi | Aktif   | Menggunakan Neon PostgreSQL 16                             |

## Fitur atau Pekerjaan yang Belum Selesai

- Multi-factor authentication untuk administrator.
- Refresh token dan mekanisme pencabutan token.
- Rate limiting terdistribusi untuk lingkungan serverless atau multi-instance.
- Migrasi basis data menggunakan Alembic.
- Ekspor laporan dalam format PDF atau Excel.
- Pengujian frontend otomatis.
- End-to-end testing.
- User Acceptance Testing.
- Pengujian beban.
- Pengujian penetrasi dan audit keamanan independen.
- Pengujian aksesibilitas formal.
- Pengujian lintas peramban secara lengkap.
- Monitoring error production secara terpusat.
- Logging production yang lebih terstruktur.

## Temuan yang Sudah Ditindaklanjuti

### 1. Cleanup File Tidak Terpakai

Beberapa file generated, asset template, dan komponen frontend yang tidak digunakan telah dihapus dari repositori. Pembersihan ini dilakukan untuk mengurangi noise pada struktur proyek dan menjaga source code tetap relevan.

File yang telah dibersihkan meliputi file coverage, asset bawaan template, dan komponen React yang tidak lagi dipanggil oleh aplikasi.

### 2. Konfigurasi CORS

Konfigurasi CORS sebelumnya perlu diselaraskan dengan environment variable production. Saat ini `app/main.py` telah menggunakan `CORS_ORIGINS`, dan environment variable backend pada Vercel telah disesuaikan agar mengizinkan domain frontend produksi:

```env
CORS_ORIGINS=https://SANDISCAN-frontend.vercel.app
```

Setelah redeploy backend, frontend produksi berhasil mengakses endpoint backend tanpa error CORS.

### 3. Perbaikan Lint Frontend

Temuan lint pada `Dashboard.jsx` telah diperbaiki. Perbaikan mencakup struktur hook, pemanggilan data dashboard, dan pola update state agar sesuai dengan pemeriksaan ESLint React.

### 4. Perbaikan Dependency dan Asset Frontend

Dependency frontend yang tidak digunakan telah dibersihkan. Bootstrap npm tidak lagi diperlukan karena proyek menggunakan Bootstrap Icons melalui CDN. Referensi favicon juga telah disesuaikan agar tidak lagi mengarah ke asset bawaan Vite.

### 5. Konfigurasi Backend

Konfigurasi backend telah dirapikan agar middleware CORS membaca daftar origin dari environment variable, bukan konfigurasi statis yang tidak sesuai dengan deployment production.

## Temuan yang Masih Perlu Ditindaklanjuti

### 1. Rate Limiting

Rate limiter telah diterapkan pada endpoint login dan analisis, tetapi penyimpanannya masih berada di memori proses. Pada Vercel atau lingkungan multi-instance, batas permintaan dapat berbeda antar-instance.

Untuk penggunaan produksi yang lebih serius, state rate limiting perlu dipindahkan ke Redis, KV, atau layanan terdistribusi lain.

### 2. Dokumentasi API

Swagger UI masih aktif pada lingkungan produksi untuk kebutuhan demonstrasi dan dokumentasi. Pada penggunaan yang lebih sensitif, dokumentasi sebaiknya dibatasi atau dinonaktifkan melalui:

```env
ENABLE_DOCS=false
```

### 3. Migrasi Basis Data

Tabel saat ini dibuat menggunakan metadata SQLAlchemy. Proyek belum memakai Alembic, sehingga perubahan skema produksi belum memiliki mekanisme migrasi versi yang terstruktur.

### 4. Pengujian Frontend

Frontend telah lolos lint dan build, tetapi belum memiliki pengujian otomatis seperti unit test, integration test, atau end-to-end test. Untuk pengembangan lanjutan, pengujian frontend perlu ditambahkan.

### 5. Audit Keamanan Independen

SANDISCAN telah menerapkan beberapa kontrol dasar, seperti JWT, security headers, rate limiting, dan prinsip tidak menyimpan kata sandi asli. Namun, audit keamanan independen dan pengujian penetrasi belum dilakukan.

## Catatan Keamanan

SANDISCAN tidak menyimpan kata sandi asli pengguna maupun hash lengkap kata sandi publik. Sistem hanya menyimpan metadata anonim hasil analisis. Pemeriksaan Have I Been Pwned dilakukan menggunakan pendekatan k-Anonymity dengan mengirimkan lima karakter awal hash SHA-1.

Meskipun demikian, sistem tetap melakukan pemrosesan kata sandi secara sementara di backend. Oleh karena itu, SANDISCAN sebaiknya diposisikan sebagai purwarupa edukatif dan demonstratif, bukan sebagai sistem keamanan produksi berskala besar.

Untuk penggunaan lebih lanjut, beberapa hal yang perlu diperhatikan adalah:

- jangan menyimpan `DATABASE_URL`, `SECRET_KEY`, atau `ADMIN_PASSWORD` di repositori;
- gunakan password admin yang kuat;
- lakukan rotasi secret jika token atau kredensial pernah terekspos;
- batasi Swagger UI pada production final jika tidak diperlukan;
- gunakan rate limiter terdistribusi untuk deployment skala lebih besar;
- lakukan audit keamanan independen sebelum digunakan secara luas.

## Kesimpulan Status

SANDISCAN berada pada tahap purwarupa full-stack yang telah berhasil dideploy ke lingkungan produksi. Fitur utama telah tersedia dan dapat digunakan, pengujian backend telah lulus, frontend telah lolos lint dan build, serta koneksi frontend-backend production telah berhasil setelah konfigurasi CORS diperbaiki.

Pengembangan berikutnya sebaiknya difokuskan pada penguatan keamanan production, penambahan pengujian frontend, penerapan migrasi database, rate limiting terdistribusi, serta pengujian formal seperti UAT, pengujian beban, dan audit keamanan independen.
