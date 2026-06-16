# Realisasi dan Panduan Deployment SANDIKU

Dokumen ini mencatat realisasi deployment SANDIKU pada 10 Juni 2026 sekaligus menjadi panduan untuk melakukan deployment ulang. Sistem memisahkan frontend, backend, dan basis data ke layanan yang berbeda.

## Status Deployment

Deployment produksi telah dilakukan menggunakan akun pribadi pengembang.

| Komponen   | Lingkungan Lokal                      | Lingkungan Produksi |
|------------|---------------------------------------|---------------------|
| Frontend   | React.js + Vite pada `localhost:5173` | Vercel              |
| Backend    | FastAPI pada `127.0.0.1:8000`         | Vercel Functions    |
| Basis data | SQLite                                | Neon PostgreSQL 16  |
| Repositori | Git lokal                             | GitHub              |

## Alamat Produksi

| Layanan      | URL                                       |
|--------------|-------------------------------------------|
| Frontend     | https://sandiku-frontend.vercel.app       |
| Backend      | https://sandiku-backend.vercel.app        |
| Status API   | https://sandiku-backend.vercel.app/       |
| Health check | https://sandiku-backend.vercel.app/health |
| Swagger UI   | https://sandiku-backend.vercel.app/docs   |

## Basis Data Produksi

| Parameter                     | Nilai                                         |
|-------------------------------|-----------------------------------------------|
| Penyedia                      | Neon                                          |
| Proyek                        | `sandiku`                                     |
| Database                      | `neondb`                                      |
| Versi                         | PostgreSQL 16                                 |
| Wilayah                       | Asia Pacific/Singapore (`aws-ap-southeast-1`) |
| Tabel                         | `users`, `analysis_logs`                      |
| Tanggal pembuatan/dokumentasi | 10 Juni 2026                                  |
| Data uji saat dokumentasi     | 2 rekaman                                     |

Connection string, kata sandi, token, dan secret tidak boleh dicantumkan pada dokumentasi, tangkapan layar, atau repositori.

## Arsitektur Produksi

```txt
Pengguna
   │
   ▼
Frontend React.js pada Vercel
https://sandiku-frontend.vercel.app
   │ HTTPS / JSON
   ▼
Backend FastAPI pada Vercel
https://sandiku-backend.vercel.app
   ├──► Neon PostgreSQL 16
   └──► HIBP Pwned Passwords Range API
```

## Deployment Frontend ke Vercel

### Konfigurasi

- Root Directory: `frontend`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Environment variable:

```env
VITE_API_BASE_URL=https://sandiku-backend.vercel.app
```

## Pemeriksaan Setelah Deployment

| No. | Pemeriksaan              | Hasil yang Diharapkan |
|---  |--------------------------|---------------------------------------------|
| 1   | Buka frontend            | Halaman beranda tampil                      |
| 2   | Buka backend `/`         | Respons status `success`                    |
| 3   | Buka `/health`           | Respons status `healthy`                    |
| 4   | Buka `/docs`             | Swagger UI tampil jika docs diaktifkan      |
| 5   | Uji `/api/analyze`       | Status 200 dan hasil analisis lengkap       |
| 6   | Uji login admin          | Token JWT diterbitkan                       |
| 7   | Uji endpoint tanpa token | Akses ditolak 401/403                       |
| 8   | Buka dashboard           | Statistik dan riwayat anonim tampil         |
| 9   | Periksa Neon             | Metadata masuk ke `analysis_logs`           |
| 10  | Periksa HIBP             | Status checked/breached tampil sesuai hasil |


## Keterbatasan Deployment Saat Ini

1. `app/main.py` masih menggunakan `allow_origins=["*"]`, sehingga nilai `CORS_ORIGINS` belum benar-benar diterapkan oleh middleware.
2. Rate limiter masih menggunakan memori proses dan belum konsisten untuk serverless multi-instance.
3. Proyek belum menggunakan Alembic untuk migrasi basis data.
4. Swagger UI masih aktif untuk kebutuhan dokumentasi.
5. UAT, load testing, penetration testing, dan audit keamanan independen belum dilakukan.

## Riwayat Deployment

| Tanggal      | Kegiatan                                                                                        |
|--------------|-------------------------------------------------------------------------------------------------|
| 9 Juni 2026  | Pengembangan fungsional dan deployment dalam tahap akhir magang selesai.                        |
| 10 Juni 2026 | Pembaruan deployment frontend, backend, dokumentasi API, dan koneksi Neon PostgreSQL dilakukan. |

## Kesimpulan

SANDIKU telah berhasil ditempatkan pada Vercel dan terhubung dengan Neon PostgreSQL. Deployment ini sesuai untuk purwarupa akademik dan demonstrasi. Sebelum digunakan secara lebih luas, konfigurasi CORS, rate limiting terdistribusi, migrasi basis data, pengujian pengguna, dan audit keamanan perlu diselesaikan.
