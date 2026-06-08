# Security Checklist SANDIKU

Dokumen ini berisi daftar penguatan keamanan dasar yang telah diterapkan pada proyek SANDIKU.

## Keamanan yang Telah Diterapkan

| No | Aspek Keamanan | Status | Keterangan |
|---|---|---|---|
| 1 | Password admin di-hash | Sudah | Password admin disimpan menggunakan hash bcrypt melalui passlib |
| 2 | JWT authentication | Sudah | Dashboard admin dilindungi token JWT |
| 3 | Admin aktif | Sudah | Admin nonaktif tidak dapat login |
| 4 | Password pengguna tidak disimpan | Sudah | Sistem hanya menyimpan metadata anonim |
| 5 | HIBP k-Anonymity | Sudah | Sistem hanya mengirim prefix hash SHA-1 ke HIBP |
| 6 | Input validation | Sudah | Password analisis dibatasi minimal 1 dan maksimal 128 karakter |
| 7 | CORS terbatas | Sudah | CORS origin dibaca dari environment variable |
| 8 | Rate limiting login | Sudah | Endpoint login dibatasi jumlah request per menit |
| 9 | Rate limiting analisis | Sudah | Endpoint analisis dibatasi jumlah request per menit |
| 10 | Security headers | Sudah | Middleware menambahkan header keamanan dasar |
| 11 | Environment variable | Sudah | Konfigurasi rahasia tidak ditulis langsung pada source code |
| 12 | Swagger production toggle | Sudah | Dokumentasi API dapat dinonaktifkan melalui `ENABLE_DOCS=false` |

## Catatan

Rate limiting yang diterapkan masih berbasis memori sehingga cocok untuk pengembangan lokal, purwarupa, dan demonstrasi. Untuk produksi multi-instance, rate limiting sebaiknya dipindahkan ke Redis atau layanan API gateway.

## Rencana Penguatan Lanjutan

- Menggunakan PostgreSQL untuk produksi.
- Menambahkan HTTPS penuh pada server produksi.
- Menambahkan Redis-based rate limiting.
- Menambahkan audit logging admin.
- Menambahkan mekanisme reset password admin.
- Menonaktifkan Swagger UI pada production.
- Menambahkan pemindaian dependency vulnerability.