# Hasil Pengujian Backend SANDIKU

Pengujian backend SANDIKU dilakukan menggunakan pytest dan pytest-cov. Pengujian dilakukan untuk memvalidasi fungsi utama sistem, meliputi layanan analisis kata sandi, pemeriksaan blocklist, rule-based checking, pemeriksaan HIBP, autentikasi admin, proteksi token JWT, endpoint dashboard, serta validasi penyimpanan metadata anonim.

## Ringkasan Hasil

| Komponen            | Hasil      |
| ------------------- | ---------- |
| Framework pengujian | pytest     |
| Coverage tool       | pytest-cov |
| Jumlah pengujian    | 30 test    |
| Status              | 30 passed  |
| Warning             | 5 warnings |
| Durasi              | 3.00 detik |
| Total coverage      | 85%        |

## Komponen yang Diuji

| No | Komponen                    | Fokus Pengujian                                                        |
| -- | --------------------------- | ---------------------------------------------------------------------- |
| 1  | `BlocklistChecker`          | Deteksi kata sandi umum dan variasi substitusi karakter                |
| 2  | `RuleChecker`               | Deteksi panjang, variasi karakter, pengulangan, urutan, dan pola tahun |
| 3  | `HibpChecker`               | Status bocor, tidak bocor, dan gagal koneksi                           |
| 4  | `PasswordAnalyzer`          | Skor, kategori, status HIBP, pola kelemahan, dan rekomendasi           |
| 5  | `/api/analyze`              | Response analisis dan penyimpanan metadata anonim                      |
| 6  | `/api/auth/login`           | Autentikasi admin dan penerbitan token JWT                             |
| 7  | `/api/auth/me`              | Validasi token dan profil admin                                        |
| 8  | `/api/dashboard/statistics` | Statistik hasil analisis                                               |
| 9  | `/api/dashboard/analyses`   | Riwayat analisis anonim                                                |
| 10 | Security checking           | Validasi bahwa response tidak memuat kata sandi asli                   |

## Ringkasan Coverage

| File                                | Coverage |
| ----------------------------------- | -------: |
| `app/core/security.py`              |     100% |
| `app/models/analysis_log.py`        |     100% |
| `app/models/user.py`                |     100% |
| `app/routers/analyzer_router.py`    |     100% |
| `app/routers/auth_router.py`        |     100% |
| `app/routers/dashboard_router.py`   |      85% |
| `app/schemas/analyzer_schema.py`    |     100% |
| `app/schemas/auth_schema.py`        |     100% |
| `app/services/blocklist_checker.py` |     100% |
| `app/services/hibp_checker.py`      |      93% |
| `app/services/password_analyzer.py` |      92% |
| `app/services/rule_checker.py`      |      79% |
| Total                               |      85% |

## Kesimpulan Pengujian

Hasil pengujian menunjukkan bahwa backend SANDIKU telah berjalan sesuai kebutuhan utama sistem. Seluruh 30 pengujian berhasil dijalankan tanpa kegagalan. Cakupan pengujian sebesar 85% menunjukkan bahwa sebagian besar komponen utama backend telah tervalidasi, khususnya modul analisis kata sandi, autentikasi admin, proteksi token JWT, dashboard statistik, dan penyimpanan metadata analisis anonim.

Warning yang muncul tidak menyebabkan kegagalan sistem. Sebagian warning berasal dari pustaka eksternal, sedangkan warning terkait waktu token JWT dapat diperbaiki dengan penggunaan objek waktu yang timezone-aware.
