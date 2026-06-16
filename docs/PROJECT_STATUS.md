# Status Proyek SANDIKU

## Status Terakhir

**Tanggal status:** 10 Juni 2026

SANDIKU telah mencapai tahap purwarupa full-stack yang dapat digunakan melalui lingkungan produksi. Frontend dan backend telah ditempatkan pada Vercel, sedangkan basis data produksi menggunakan Neon PostgreSQL 16.

SANDIKU dikembangkan secara mandiri dan bukan sistem resmi atau perangkat operasional instansi tempat magang.

## Akses Produksi

| Komponen     |Status | Alamat                                    |
|--------------|-------|-------------------------------------------|
| Frontend     | Aktif | https://sandiku-frontend.vercel.app       |
| Backend      | Aktif | https://sandiku-backend.vercel.app        |
| Status API   | Aktif | https://sandiku-backend.vercel.app/       |
| Health check | Aktif | https://sandiku-backend.vercel.app/health |
| Swagger UI   | Aktif | https://sandiku-backend.vercel.app/docs   |
| Basis data   | Aktif | Neon PostgreSQL 16                        |

## Konfigurasi Produksi

| Komponen                    |  Keterangan                                   |
|-----------------------------|-----------------------------------------------|
| Platform frontend           | Vercel                                        |
| Platform backend            | Vercel                                        |
| Proyek Neon                 | `sandiku`                                     |
| Database                    | `neondb`                                      |
| Wilayah                     | Asia Pacific/Singapore (`aws-ap-southeast-1`) |
| Tabel produksi              | `users` dan `analysis_logs`                   |
| Tanggal database/deployment | 10 Juni 2026                                  |
| Data uji saat dokumentasi   | 2 rekaman                                     |
| Akun deployment             | Akun pribadi pengembang                       |

## Fitur yang Sudah Tersedia

- Halaman beranda dan informasi privasi.
- Halaman analisis kata sandi.
- Skor 0–100 dan lima kategori kekuatan.
- Pemeriksaan zxcvbn.
- Rule-based checking.
- Blocklist lokal.
- Pemeriksaan HIBP dengan k-Anonymity.
- Rekomendasi dalam bahasa Indonesia.
- Penyimpanan metadata anonim.
- Login administrator.
- Token JWT.
- Pemeriksaan status aktif administrator.
- Dashboard statistik.
- Riwayat maksimal 50 analisis terbaru.
- Ekspor riwayat dalam format CSV.
- Format waktu Indonesia dan WIB.
- Rate limiting dasar.
- Security headers.
- Dokumentasi OpenAPI/Swagger.
- Pengujian otomatis backend.
- Deployment frontend dan backend.
- Koneksi Neon PostgreSQL produksi.

## Hasil Verifikasi Teknis

### Backend

- 32 pengujian lulus.
- Total coverage 83%.
- Pengujian mencakup analisis, blocklist, rule checker, HIBP, autentikasi, JWT, dashboard, rate limiting, dan security headers.

### Frontend

- Proses build produksi berhasil.
- Rute utama tersedia: `/`, `/analyzer`, `/login`, dan `/dashboard`.
- Frontend terhubung dengan backend melalui `VITE_API_BASE_URL`.
- Pemeriksaan lint masih menemukan temuan yang perlu diperbaiki pada `Dashboard.jsx`.

## Fitur atau Pekerjaan yang Belum Selesai

- Multi-factor authentication administrator.
- Refresh token dan pencabutan token.
- Rate limiting terdistribusi untuk lingkungan serverless/multi-instance.
- Migrasi basis data menggunakan Alembic.
- Ekspor laporan PDF atau Excel.
- Pengujian frontend otomatis.
- End-to-end testing.
- User Acceptance Testing.
- Pengujian beban.
- Pengujian penetrasi dan audit keamanan independen.
- Pengujian aksesibilitas formal.
- Pengujian lintas peramban secara lengkap.

## Temuan yang Perlu Ditindaklanjuti

### 1. Konfigurasi CORS

`CORS_ORIGINS` telah tersedia pada konfigurasi, tetapi `app/main.py` masih menggunakan:

```python
allow_origins=["*"]
```

Sebelum digunakan lebih luas, middleware CORS perlu membaca daftar origin dari environment variable dan membatasi akses hanya kepada domain frontend yang diperlukan.

### 2. Rate Limiting

Rate limiter telah diterapkan pada endpoint login dan analisis, tetapi penyimpanannya masih berada di memori proses. Pada Vercel atau lingkungan multi-instance, batas permintaan dapat berbeda antar-instance. Untuk penggunaan produksi yang lebih serius, state rate limiting perlu dipindahkan ke Redis, KV, atau layanan terdistribusi.

### 3. Dokumentasi API

Swagger UI aktif pada lingkungan produksi untuk kebutuhan demonstrasi dan dokumentasi. Pada penggunaan yang lebih sensitif, dokumentasi dapat dibatasi atau dinonaktifkan melalui `ENABLE_DOCS=false`.

### 4. Migrasi Basis Data

Tabel dibuat menggunakan metadata SQLAlchemy. Proyek belum memakai Alembic, sehingga perubahan skema produksi belum memiliki mekanisme migrasi versi yang terstruktur.

### 5. Konfigurasi Pengujian

`pytest.ini` memuat filter warning yang dapat tidak kompatibel dengan versi Starlette terbaru. Jika perintah pytest gagal saat membaca warning filter, konfigurasi tersebut perlu diperbarui sebelum pengujian dijalankan ulang.
