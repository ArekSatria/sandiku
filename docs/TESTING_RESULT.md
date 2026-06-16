# Hasil Pengujian SANDIKU

Dokumen ini mencatat hasil verifikasi terhadap source code SANDIKU yang digunakan dalam laporan magang.

## Ringkasan Backend

| Komponen            | Hasil                              |
|---------------------|------------------------------------|
| Framework pengujian | pytest                             |  
| Coverage tool       | pytest-cov                         |
| Jumlah pengujian    | 32 test                            |
| Status              | 32 passed                          |
| Warning             | 1 warning pada verifikasi terakhir |
| Durasi              | sekitar 3,16 detik                 |
| Total coverage      | 83%                                |

## Komponen yang Diuji

| No. | Komponen                    | Fokus Pengujian                                                          |
|-----|-----------------------------|--------------------------------------------------------------------------|
| 1   | `BlocklistChecker`          | Kata sandi umum dan substitusi karakter                                  |
| 2   | `RuleChecker`               | Panjang, variasi, pengulangan, urutan, tahun, dan tanggal                |
| 3   | `HibpChecker`               | Status bocor, tidak bocor, dan kegagalan koneksi                         |
| 4   | `PasswordAnalyzer`          | Skor, kategori, status HIBP, pola, dan rekomendasi                       |
| 5   | `/api/analyze`              | Respons analisis dan penyimpanan metadata anonim                         |
| 6   | `/api/auth/login`           | Login admin dan penerbitan JWT                                           |
| 7   | `/api/auth/me`              | Profil admin dan validasi token                                          |
| 8   | `/api/dashboard/statistics` | Statistik agregat                                                        |
| 9   | `/api/dashboard/analyses`   | Riwayat analisis anonim                                                  |
| 10  | Security hardening          | Header keamanan, rate limiting, admin nonaktif, dan non-retensi password |

## Ringkasan Coverage

| File                                 | Coverage |
|--------------------------------------|----------|
| `app/core/security.py`               | 100%     |
| `app/models/analysis_log.py`         | 100%     |
| `app/models/user.py`                 | 100%     |
| `app/routers/analyzer_router.py`     | 100%     |
| `app/routers/auth_router.py`         | 100%     |
| `app/schemas/analyzer_schema.py`     | 100%     |
| `app/schemas/auth_schema.py`         | 100%     |
| `app/services/blocklist_checker.py`  | 100%     |
| `app/services/hibp_checker.py`       | 93%      |
| `app/services/password_analyzer.py`  | 92%      |
| `app/core/rate_limiter.py`           | 94%      |
| `app/core/security_headers.py`       | 88%      |
| `app/core/dependencies.py`           | 82%      |
| `app/core/config.py`                 | 79%      |
| `app/services/rule_checker.py`       | 79%      |
| `app/database.py`                    | 71%      |
| `app/utils/timezone.py`              | 71%      | 
| `app/routers/dashboard_router.py`    | 69%      |
| Total                                | 83%      |

## Hasil Frontend

- Build produksi berhasil.
- Rute utama tersedia.
- Integrasi Axios dan Bearer token tersedia.
- Pemeriksaan lint masih menemukan dua error dan satu warning pada versi yang diverifikasi.

## Catatan Reproduksi

Konfigurasi `pytest.ini` memuat filter berikut:

```ini
ignore::starlette.exceptions.StarletteDeprecationWarning
```

Pada versi Starlette tertentu, kelas warning tersebut tidak tersedia dan pytest dapat berhenti saat membaca konfigurasi. Jika hal itu terjadi, perbarui filter warning atau jalankan pengujian dengan konfigurasi warning yang sesuai dengan versi pustaka yang digunakan.

## Kesimpulan

Seluruh 32 pengujian backend berhasil. Coverage 83% menunjukkan bahwa fungsi inti telah diuji, tetapi hasil tersebut tidak membuktikan sistem bebas kerentanan. UAT, pengujian beban, pengujian frontend otomatis, dan audit keamanan independen masih diperlukan.