# Status Proyek SANDIKU

## Status Terakhir

SANDIKU telah mencapai tahap purwarupa fullstack yang dapat dijalankan secara lokal. Backend, frontend, database lokal, autentikasi admin, dashboard, dan pengujian otomatis backend telah tersedia.

## Fitur yang Sudah Tersedia

- Halaman beranda.
- Halaman analisis kata sandi.
- Analisis kata sandi menggunakan metode hibrida.
- Pemeriksaan zxcvbn.
- Rule-based checking.
- Blocklist lokal.
- Pemeriksaan HIBP.
- Response rekomendasi dalam bahasa Indonesia.
- Penyimpanan metadata anonim.
- Login admin.
- Token JWT.
- Dashboard statistik.
- Riwayat analisis anonim.
- Format waktu Indonesia dan WIB.
- Testing backend dengan pytest.
- Coverage backend 85%.

## Fitur yang Belum Diterapkan

- Deployment online produksi.
- PostgreSQL produksi.
- Multi-factor authentication admin.
- Rate limiting.
- Export laporan PDF/Excel.
- Grafik dashboard yang lebih kompleks.
- User Acceptance Testing.

## Catatan Sinkronisasi Laporan

Laporan harus menuliskan bahwa implementasi saat ini menggunakan SQLite sebagai database lokal. PostgreSQL dapat ditulis sebagai rencana deployment atau pengembangan produksi.

Laporan juga dapat mencantumkan hasil pengujian otomatis backend: 30 test berhasil dengan coverage 85%.

Jika deployment online belum dilakukan, laporan tidak boleh menyatakan bahwa sistem sudah berhasil dideploy. Bagian deployment cukup ditulis sebagai rencana deployment.

## Security Hardening

Penguatan keamanan dasar telah ditambahkan pada backend SANDIKU. Perubahan meliputi rate limiting pada endpoint login dan analisis, middleware security headers, pembatasan CORS yang lebih ketat, konfigurasi production mode, serta opsi menonaktifkan Swagger UI melalui environment variable.

Security hardening ini mendukung klaim bahwa sistem telah menerapkan perlindungan dasar pada aspek autentikasi, privasi data, pembatasan akses, dan pengendalian request.