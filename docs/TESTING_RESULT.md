# Hasil Pengujian SANDISCAN

Dokumen ini mencatat hasil verifikasi terhadap source code SANDISCAN yang digunakan dalam laporan magang. Pengujian mencakup backend, frontend, serta verifikasi deployment production setelah proses cleanup proyek dan perbaikan konfigurasi CORS.

## Status Verifikasi Terakhir

| Komponen                   | Status | Keterangan                                             |
| -------------------------- | ------ | ------------------------------------------------------ |
| Backend test               | Lulus  | 32 pengujian backend berhasil                          |
| Frontend lint              | Lulus  | Pemeriksaan lint frontend berhasil                     |
| Frontend build             | Lulus  | Build produksi berhasil dibuat                         |
| Backend production         | Aktif  | Endpoint `/` dan `/health` dapat diakses               |
| Frontend production        | Aktif  | Aplikasi dapat dibuka melalui Vercel                   |
| Integrasi frontend-backend | Lulus  | Frontend berhasil mengakses endpoint backend           |
| CORS production            | Lulus  | Domain frontend telah diizinkan melalui `CORS_ORIGINS` |
| Database production        | Aktif  | Menggunakan Neon PostgreSQL 16                         |

**Tanggal verifikasi ulang:** 16 Juni 2026
**Deployment awal:** 10 Juni 2026

## Ringkasan Backend

| Komponen                               | Hasil                                                |
| -------------------------------------- | ---------------------------------------------------- |
| Framework pengujian                    | pytest                                               |
| Coverage tool                          | pytest-cov                                           |
| Jumlah pengujian                       | 32 test                                              |
| Status pengujian                       | 32 passed                                            |
| Warning                                | Terdapat warning dependency pada verifikasi terakhir |
| Total coverage terakhir terdokumentasi | 83%                                                  |

## Komponen Backend yang Diuji

| No. | Komponen                    | Fokus Pengujian                                                          |
| --- | --------------------------- | ------------------------------------------------------------------------ |
| 1   | `BlocklistChecker`          | Kata sandi umum dan substitusi karakter                                  |
| 2   | `RuleChecker`               | Panjang, variasi karakter, pengulangan, urutan, tahun, dan tanggal       |
| 3   | `HibpChecker`               | Status bocor, tidak bocor, dan kegagalan koneksi                         |
| 4   | `PasswordAnalyzer`          | Skor, kategori, status HIBP, pola kelemahan, dan rekomendasi             |
| 5   | `/api/analyze`              | Respons analisis dan penyimpanan metadata anonim                         |
| 6   | `/api/auth/login`           | Login admin dan penerbitan JWT                                           |
| 7   | `/api/auth/me`              | Profil admin dan validasi token                                          |
| 8   | `/api/dashboard/statistics` | Statistik agregat dashboard                                              |
| 9   | `/api/dashboard/analyses`   | Riwayat analisis anonim                                                  |
| 10  | Security hardening          | Header keamanan, rate limiting, admin nonaktif, dan non-retensi password |

## Ringkasan Coverage Terakhir

| File                                | Coverage |
| ----------------------------------- | -------- |
| `app/core/security.py`              | 100%     |
| `app/models/analysis_log.py`        | 100%     |
| `app/models/user.py`                | 100%     |
| `app/routers/analyzer_router.py`    | 100%     |
| `app/routers/auth_router.py`        | 100%     |
| `app/schemas/analyzer_schema.py`    | 100%     |
| `app/schemas/auth_schema.py`        | 100%     |
| `app/services/blocklist_checker.py` | 100%     |
| `app/services/hibp_checker.py`      | 93%      |
| `app/services/password_analyzer.py` | 92%      |
| `app/core/rate_limiter.py`          | 94%      |
| `app/core/security_headers.py`      | 88%      |
| `app/core/dependencies.py`          | 82%      |
| `app/core/config.py`                | 79%      |
| `app/services/rule_checker.py`      | 79%      |
| `app/database.py`                   | 71%      |
| `app/utils/timezone.py`             | 71%      |
| `app/routers/dashboard_router.py`   | 69%      |
| Total                               | 83%      |

## Hasil Frontend

| Komponen      | Status    | Keterangan                                                        |
| ------------- | --------- | ----------------------------------------------------------------- |
| Lint          | Lulus     | `npm run lint` berhasil dijalankan                                |
| Build         | Lulus     | `npm run build` berhasil dijalankan                               |
| Routing       | Tersedia  | Rute utama tersedia: `/`, `/analyzer`, `/login`, dan `/dashboard` |
| Integrasi API | Berfungsi | Frontend menggunakan `VITE_API_BASE_URL` untuk mengakses backend  |
| Bearer token  | Tersedia  | Token admin digunakan untuk endpoint dashboard                    |
| Ekspor CSV    | Berfungsi | Riwayat analisis dapat diekspor dalam format CSV                  |

## Verifikasi Deployment Production

| No. | Area                 | Hasil yang Diharapkan                                | Status                  |
| --- | -------------------- | ---------------------------------------------------- | ----------------------- |
| 1   | Frontend production  | Halaman beranda tampil                               | Lulus                   |
| 2   | Backend `/`          | Endpoint status API merespons                        | Lulus                   |
| 3   | Backend `/health`    | Endpoint health check merespons                      | Lulus                   |
| 4   | Backend `/docs`      | Swagger UI tampil jika `ENABLE_DOCS=true`            | Lulus                   |
| 5   | Analyzer             | Frontend berhasil mengirim request ke `/api/analyze` | Lulus                   |
| 6   | CORS                 | Tidak ada error CORS pada browser console            | Lulus                   |
| 7   | Login admin          | Backend menerbitkan JWT                              | Lulus                   |
| 8   | Dashboard            | Statistik dan riwayat anonim tampil                  | Lulus                   |
| 9   | Muat ulang dashboard | Data dashboard dapat dimuat ulang                    | Lulus                   |
| 10  | Ekspor CSV           | File CSV berhasil diunduh                            | Lulus                   |
| 11  | Database production  | Metadata analisis tersimpan pada Neon PostgreSQL     | Lulus secara fungsional |

## Verifikasi CORS Production

Frontend dan backend berada pada domain yang berbeda, sehingga CORS perlu dikonfigurasi secara eksplisit pada backend.

Konfigurasi yang digunakan:

```env
CORS_ORIGINS=https://SANDISCAN-frontend.vercel.app
```

## Perintah Pengujian

### Backend

Jalankan dari direktori `backend`:

```bash
python -m pytest
```

Untuk menjalankan coverage:

```bash
python -m pytest --cov=app --cov-report=term-missing
```

### Frontend

Jalankan dari direktori `frontend`:

```bash
npm run lint
npm run build
```

## Batasan Pengujian

Meskipun seluruh pengujian backend lulus dan frontend berhasil melewati lint serta build, hasil ini belum membuktikan bahwa sistem bebas dari seluruh risiko teknis dan keamanan.

Pengujian yang belum dilakukan secara formal meliputi:

- pengujian frontend otomatis;
- end-to-end testing;
- User Acceptance Testing;
- pengujian aksesibilitas formal;
- pengujian lintas peramban secara lengkap;
- pengujian beban;
- penetration testing;
- audit keamanan independen;
- dependency scanning terstruktur;
- monitoring error production.

## Kesimpulan

Source code SANDISCAN telah melewati verifikasi dasar setelah proses cleanup dan deployment production. Backend berhasil menjalankan 32 pengujian, frontend berhasil melewati lint dan build, serta integrasi frontend-backend production telah berhasil setelah konfigurasi CORS disesuaikan.

Coverage backend terakhir yang terdokumentasi adalah 83%, yang menunjukkan bahwa fungsi inti telah diuji. Namun, hasil tersebut tidak membuktikan sistem bebas dari kerentanan. Pengujian lanjutan seperti frontend automated testing, end-to-end testing, UAT, load testing, penetration testing, dan audit keamanan independen tetap diperlukan sebelum sistem digunakan pada skala yang lebih luas.
