# Security Checklist SANDIKU

## Status Keamanan Dasar

| No. | Aspek                           | Status          | Keterangan                                         |
|-----|---------------------------------|-----------------|----------------------------------------------------|
| 1   | Password admin di-hash          | Sudah           | bcrypt melalui passlib                             |
| 2   | JWT authentication              | Sudah           | Endpoint admin memerlukan Bearer token             |
| 3   | Pemeriksaan admin aktif         | Sudah           | Admin nonaktif ditolak                             |
| 4   | Password publik tidak disimpan  | Sudah           | Hanya metadata anonim yang dicatat                 |
| 5   | HIBP k-Anonymity                | Sudah           | Hanya prefix lima karakter hash SHA-1 yang dikirim |
| 6   | Input validation                | Sudah           | Input analisis dibatasi 1–128 karakter             |
| 7   | CORS terbatas                   | Belum           | `main.py` masih memakai `allow_origins=["*"]`      |
| 8   | Rate limiting login             | Sudah, terbatas | Masih berbasis memori                              |
| 9   | Rate limiting analisis          | Sudah, terbatas | Masih berbasis memori                              |
| 10  | Security headers                | Sudah           | Middleware menambahkan header dasar                |
| 11  | Environment variable            | Sudah           | Konfigurasi rahasia dipisahkan dari kode           |
| 12  | Swagger production toggle       | Sudah           | Dapat diatur melalui `ENABLE_DOCS`                 |
| 13  | HTTPS produksi                  | Sudah           | Disediakan oleh Vercel                             |
| 14  | MFA administrator               | Belum           | Belum diterapkan                                   |
| 15  | Migrasi skema                   | Belum           | Alembic belum digunakan                            |

## Prioritas Perbaikan

1. Terapkan `CORS_ORIGINS` pada middleware FastAPI.
2. Pindahkan rate limiter ke Redis/KV atau layanan terdistribusi.
3. Rotasi secret dan kredensial yang pernah terekspos.
4. Tambahkan MFA dan mekanisme reset password admin.
5. Evaluasi penyimpanan token pada localStorage.
6. Tambahkan Alembic untuk migrasi basis data.
7. Lakukan dependency scanning, UAT, load testing, dan penetration testing.