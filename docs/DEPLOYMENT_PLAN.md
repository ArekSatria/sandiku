# Realisasi Deployment SANDIKU

Dokumen ini mencatat realisasi deployment SANDIKU sekaligus menjadi panduan untuk melakukan deployment ulang. Sistem memisahkan frontend, backend, dan basis data ke layanan yang berbeda.

Deployment awal dilakukan pada 10 Juni 2026. Setelah proses cleanup proyek, konfigurasi frontend, backend, CORS, serta koneksi produksi telah diverifikasi ulang pada 16 Juni 2026.

SANDIKU dikembangkan sebagai purwarupa akademik dan demonstratif. Sistem ini bukan perangkat operasional resmi instansi tempat magang.

## Status Deployment

Deployment produksi telah dilakukan menggunakan akun pribadi pengembang.

| Komponen        | Lingkungan Lokal                      | Lingkungan Produksi |
| --------------- | ------------------------------------- | ------------------- |
| Frontend        | React.js + Vite pada `localhost:5173` | Vercel              |
| Backend         | FastAPI pada `127.0.0.1:8000`         | Vercel Functions    |
| Basis data      | SQLite                                | Neon PostgreSQL 16  |
| Repositori      | Git lokal                             | GitHub              |
| Version control | Branch `main`                         | GitHub repository   |

## Alamat Produksi

| Layanan      | URL                                       |
| ------------ | ----------------------------------------- |
| Frontend     | https://sandiku-frontend.vercel.app       |
| Backend      | https://sandiku-backend.vercel.app        |
| Status API   | https://sandiku-backend.vercel.app/       |
| Health Check | https://sandiku-backend.vercel.app/health |
| Swagger UI   | https://sandiku-backend.vercel.app/docs   |

> Swagger UI masih dapat digunakan untuk dokumentasi dan demonstrasi. Untuk lingkungan produksi final, dokumentasi API dapat dinonaktifkan melalui `ENABLE_DOCS=false`.

## Basis Data Produksi

| Parameter                          | Nilai                                              |
| ---------------------------------- | -------------------------------------------------- |
| Penyedia                           | Neon                                               |
| Proyek                             | `sandiku`                                          |
| Database                           | `neondb`                                           |
| Versi                              | PostgreSQL 16                                      |
| Wilayah                            | Asia Pacific/Singapore (`aws-ap-southeast-1`)      |
| Tabel                              | `users`, `analysis_logs`                           |
| Tanggal pembuatan/dokumentasi awal | 10 Juni 2026                                       |
| Tanggal verifikasi ulang           | 16 Juni 2026                                       |
| Data uji saat dokumentasi awal     | 2 rekaman, dapat berubah sesuai aktivitas analisis |

## Arsitektur Produksi

```txt
Pengguna
   │
   ▼
Frontend React.js pada Vercel
https://sandiku-frontend.vercel.app
   │
   │ HTTPS / JSON
   │
   ▼
Backend FastAPI pada Vercel
https://sandiku-backend.vercel.app
   │
   ├──► Neon PostgreSQL 16
   │
   └──► Have I Been Pwned Pwned Passwords Range API
```

## Deployment Frontend ke Vercel

### Konfigurasi Frontend

| Parameter         | Nilai           |
| ----------------- | --------------- |
| Root Directory    | `frontend`      |
| Framework Preset  | Vite            |
| Build Command     | `npm run build` |
| Output Directory  | `dist`          |
| Production Branch | `main`          |

Environment variable frontend:

```env
VITE_API_BASE_URL=https://sandiku-backend.vercel.app
```

## Deployment Backend ke Vercel

### Konfigurasi Backend

| Parameter          | Nilai         |
| ------------------ | ------------- |
| Root Directory     | `backend`     |
| Runtime            | Python        |
| Framework          | FastAPI       |
| Entry Point        | `index.py`    |
| Konfigurasi deploy | `vercel.json` |
| Production Branch  | `main`        |

Environment variable backend yang diperlukan:

```env
APP_ENV=production
DEBUG=false
DATABASE_URL=<connection-string-neon>
SECRET_KEY=<secret-key-kuat>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ENABLE_DOCS=true
CORS_ORIGINS=https://sandiku-frontend.vercel.app
SECURITY_HEADERS_ENABLED=true
HSTS_ENABLED=true
HSTS_MAX_AGE=31536000
RATE_LIMIT_ENABLED=true
LOGIN_RATE_LIMIT_PER_MINUTE=5
ANALYZE_RATE_LIMIT_PER_MINUTE=30
ADMIN_NAME=<nama-admin>
ADMIN_EMAIL=<email-admin>
ADMIN_PASSWORD=<password-admin-kuat>
```

## Konfigurasi CORS Produksi

Frontend dan backend dideploy pada domain yang berbeda, sehingga backend harus mengizinkan origin frontend production.

Konfigurasi backend yang digunakan:

```env
CORS_ORIGINS=https://sandiku-frontend.vercel.app
```

## Pemeriksaan Setelah Deployment

| No. | Pemeriksaan                      | Hasil yang Diharapkan                       | Status Terakhir                                |
| --- | -------------------------------- | ------------------------------------------- | ---------------------------------------------- |
| 1   | Buka frontend                    | Halaman beranda tampil                      | Terverifikasi                                  |
| 2   | Buka backend `/`                 | Respons status API tampil                   | Terverifikasi                                  |
| 3   | Buka `/health`                   | Respons status `healthy`                    | Terverifikasi                                  |
| 4   | Buka `/docs`                     | Swagger UI tampil jika docs diaktifkan      | Terverifikasi                                  |
| 5   | Uji `/api/analyze` dari frontend | Status 200 dan hasil analisis tampil        | Terverifikasi                                  |
| 6   | Uji login admin                  | Token JWT diterbitkan                       | Terverifikasi                                  |
| 7   | Uji endpoint tanpa token         | Akses ditolak 401/403                       | Terverifikasi pada endpoint terproteksi        |
| 8   | Buka dashboard                   | Statistik dan riwayat anonim tampil         | Terverifikasi                                  |
| 9   | Periksa Neon                     | Metadata masuk ke `analysis_logs`           | Terverifikasi secara fungsional                |
| 10  | Periksa HIBP                     | Status checked/breached tampil sesuai hasil | Terverifikasi secara fungsional                |
| 11  | Periksa CORS browser             | Tidak ada error CORS pada console           | Terverifikasi setelah perbaikan `CORS_ORIGINS` |
| 12  | Ekspor CSV                       | File CSV berhasil diunduh                   | Terverifikasi                                  |

## Perintah Verifikasi Lokal

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

Hasil terakhir:

```txt
Lint frontend berhasil.
Build frontend berhasil.
```

### Backend

```bash
cd backend
python -m pytest
```

Hasil terakhir:

```txt
32 passed
```

Jika ingin memeriksa coverage:

```bash
python -m pytest --cov=app --cov-report=term-missing
```

Coverage terakhir yang terdokumentasi adalah 83%.

## Verifikasi CORS Produksi

CORS dapat diuji melalui terminal dengan perintah berikut:

```bash
curl.exe -i -X OPTIONS "https://sandiku-backend.vercel.app/api/analyze" -H "Origin: https://sandiku-frontend.vercel.app" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: content-type,authorization"
```

## Keterbatasan Deployment Saat Ini

1. Rate limiter masih menggunakan memori proses dan belum konsisten untuk serverless multi-instance.
2. Proyek belum menggunakan Alembic untuk migrasi basis data.
3. Swagger UI masih aktif untuk kebutuhan dokumentasi dan demonstrasi.
4. Pengujian frontend otomatis belum tersedia.
5. End-to-end testing belum dilakukan.
6. UAT, load testing, penetration testing, dan audit keamanan independen belum dilakukan.
7. Monitoring error production belum menggunakan layanan terpusat.
8. Logging production masih bersifat dasar.

## Temuan yang Telah Ditindaklanjuti

| Temuan                                                  | Status  | Tindak Lanjut                                                          |
| ------------------------------------------------------- | ------- | ---------------------------------------------------------------------- |
| File generated dan asset template masih tersimpan       | Selesai | File tidak terpakai telah dihapus dari repositori                      |
| Dependency frontend tidak terpakai                      | Selesai | Dependency yang tidak digunakan telah dibersihkan                      |
| Referensi favicon masih mengarah ke asset template Vite | Selesai | Referensi favicon disesuaikan ke `favicon.svg`                         |
| Lint frontend bermasalah pada `Dashboard.jsx`           | Selesai | Struktur hook dan pengambilan data dashboard diperbaiki                |
| CORS production menolak frontend                        | Selesai | `CORS_ORIGINS` disesuaikan pada backend Vercel dan backend di-redeploy |
| Middleware CORS belum memakai konfigurasi environment   | Selesai | Middleware backend telah menggunakan `CORS_ORIGINS`                    |

## Riwayat Deployment

| Tanggal      | Kegiatan                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 9 Juni 2026  | Pengembangan fungsional dan deployment dalam tahap akhir magang selesai.                                                   |
| 10 Juni 2026 | Deployment frontend, backend, dokumentasi API, dan koneksi Neon PostgreSQL dilakukan.                                      |
| 16 Juni 2026 | Cleanup proyek, perbaikan lint frontend, pembaruan konfigurasi CORS, dan verifikasi ulang deployment production dilakukan. |

## Kesimpulan

SANDIKU telah berhasil ditempatkan pada Vercel dan terhubung dengan Neon PostgreSQL 16. Frontend dan backend berjalan sebagai dua proyek Vercel yang terpisah. Setelah perbaikan konfigurasi CORS, frontend produksi telah berhasil mengakses backend produksi.

Deployment ini sesuai untuk kebutuhan purwarupa akademik dan demonstrasi. Sebelum digunakan lebih luas, pengembangan lanjutan perlu difokuskan pada rate limiting terdistribusi, migrasi basis data dengan Alembic, pengujian frontend otomatis, end-to-end testing, UAT, load testing, penetration testing, audit keamanan independen, serta monitoring production yang lebih terstruktur.