# Panduan Dokumentasi Screenshot SANDIKU

Dokumen ini berisi daftar tangkapan layar yang perlu disiapkan untuk melengkapi laporan akhir proyek SANDIKU.

## Screenshot Wajib

| No | Bagian | Objek Screenshot | Lokasi Laporan |
|---|---|---|---|
| 1 | Struktur Proyek | Struktur folder backend dan frontend pada VS Code | BAB IV |
| 2 | Backend | Terminal saat `uvicorn app.main:app --reload` berhasil berjalan | BAB IV |
| 3 | Frontend | Terminal saat `npm run dev` berhasil berjalan | BAB IV |
| 4 | API | Swagger UI pada `/docs` | BAB IV |
| 5 | API | Endpoint `POST /api/analyze` | BAB IV |
| 6 | API | Response analisis `password123` | BAB IV |
| 7 | API | Response analisis password kuat | BAB IV |
| 8 | Autentikasi | Endpoint `POST /api/auth/login` menghasilkan token JWT | BAB IV |
| 9 | Autentikasi | Endpoint `GET /api/auth/me` berhasil dengan token | BAB IV |
| 10 | Keamanan | Dashboard ditolak jika tanpa token | BAB IV |
| 11 | Dashboard | Endpoint `GET /api/dashboard/statistics` | BAB IV |
| 12 | Dashboard | Endpoint `GET /api/dashboard/analyses` | BAB IV |
| 13 | Frontend | Halaman Beranda | BAB IV |
| 14 | Frontend | Halaman Analisis sebelum input | BAB IV |
| 15 | Frontend | Hasil analisis kata sandi sangat lemah | BAB IV |
| 16 | Frontend | Hasil analisis kata sandi kuat | BAB IV |
| 17 | Frontend | Halaman Login Admin | BAB IV |
| 18 | Frontend | Dashboard Admin | BAB IV |
| 19 | Database | Struktur tabel `users` | BAB IV |
| 20 | Database | Struktur tabel `analysis_logs` | BAB IV |
| 21 | Database | Bukti tidak ada kolom password asli pada log analisis | BAB IV |
| 22 | Testing | Hasil `pytest --cov=app` | BAB IV |
| 23 | Testing | Folder `backend/tests` | BAB IV |

## Contoh Caption Gambar

- Gambar 4.x Struktur Folder Proyek SANDIKU
- Gambar 4.x Backend FastAPI Berhasil Berjalan Secara Lokal
- Gambar 4.x Frontend React Berhasil Berjalan Secara Lokal
- Gambar 4.x Dokumentasi API SANDIKU pada Swagger UI
- Gambar 4.x Pengujian Endpoint Analisis Kata Sandi
- Gambar 4.x Tampilan Halaman Utama SANDIKU
- Gambar 4.x Tampilan Dashboard Statistik Admin
- Gambar 4.x Struktur Tabel Analysis Logs
- Gambar 4.x Hasil Pengujian Otomatis Backend Menggunakan Pytest