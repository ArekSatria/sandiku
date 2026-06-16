# Security Checklist SANDIKU

## Status Keamanan Dasar

**Tanggal status:** 16 Juni 2026

Dokumen ini mencatat status kontrol keamanan dasar pada purwarupa SANDIKU. Checklist ini digunakan untuk menilai aspek keamanan yang sudah diterapkan, aspek yang masih terbatas, dan pekerjaan lanjutan yang perlu dilakukan sebelum sistem digunakan pada skala yang lebih luas.

SANDIKU merupakan aplikasi edukatif untuk analisis kekuatan kata sandi. Sistem tidak ditujukan sebagai layanan keamanan produksi berskala besar dan belum melalui audit keamanan independen.

## Ringkasan Checklist

| No. | Aspek                                       | Status              | Keterangan                                                                    |
| --- | ------------------------------------------- | ------------------- | ----------------------------------------------------------------------------- |
| 1   | Password admin di-hash                      | Sudah               | Menggunakan bcrypt melalui passlib                                            |
| 2   | JWT authentication                          | Sudah               | Endpoint admin memerlukan Bearer token                                        |
| 3   | Pemeriksaan admin aktif                     | Sudah               | Admin nonaktif ditolak oleh backend                                           |
| 4   | Password publik tidak disimpan              | Sudah               | Sistem hanya menyimpan metadata anonim                                        |
| 5   | Hash lengkap password publik tidak disimpan | Sudah               | Hash lengkap tidak disimpan di database                                       |
| 6   | HIBP k-Anonymity                            | Sudah               | Hanya prefix lima karakter hash SHA-1 yang dikirim                            |
| 7   | Input validation                            | Sudah               | Input analisis dibatasi 1 sampai 128 karakter                                 |
| 8   | CORS terbatas                               | Sudah               | Backend menggunakan `CORS_ORIGINS` dan mengizinkan domain frontend production |
| 9   | Rate limiting login                         | Sudah, terbatas     | Masih berbasis memori proses                                                  |
| 10  | Rate limiting analisis                      | Sudah, terbatas     | Masih berbasis memori proses                                                  |
| 11  | Security headers                            | Sudah               | Middleware menambahkan header keamanan dasar                                  |
| 12  | Environment variable                        | Sudah               | Konfigurasi rahasia dipisahkan dari source code                               |
| 13  | Swagger production toggle                   | Sudah               | Dapat dikendalikan melalui `ENABLE_DOCS`                                      |
| 14  | HTTPS produksi                              | Sudah               | Disediakan melalui deployment Vercel                                          |
| 15  | Database production terpisah                | Sudah               | Menggunakan Neon PostgreSQL 16                                                |
| 16  | Penyimpanan token frontend                  | Ada, perlu evaluasi | Token admin disimpan pada `localStorage`                                      |
| 17  | MFA administrator                           | Belum               | Multi-factor authentication belum diterapkan                                  |
| 18  | Refresh token dan token revocation          | Belum               | Mekanisme pencabutan token belum tersedia                                     |
| 19  | Migrasi skema database                      | Belum               | Alembic belum digunakan                                                       |
| 20  | Audit keamanan independen                   | Belum               | Penetration testing formal belum dilakukan                                    |
| 21  | Dependency scanning                         | Belum formal        | Belum ada pipeline scanning dependency terstruktur                            |
| 22  | Monitoring error production                 | Belum formal        | Belum menggunakan layanan monitoring terpusat                                 |
| 23  | Logging production terstruktur              | Terbatas            | Logging masih bersifat dasar                                                  |
| 24  | Pengujian aksesibilitas formal              | Belum               | Belum dilakukan pengujian WCAG formal                                         |
| 25  | End-to-end security testing                 | Belum               | Belum tersedia skenario E2E otomatis                                          |

## Konfigurasi CORS

Frontend dan backend SANDIKU berada pada domain Vercel yang berbeda, sehingga backend harus membatasi origin yang diizinkan.

Konfigurasi production yang digunakan:

```env
CORS_ORIGINS=https://sandiku-frontend.vercel.app
```

Middleware backend telah disesuaikan agar membaca nilai dari `CORS_ORIGINS`, bukan menggunakan wildcard statis.

## Privasi dan Pemrosesan Kata Sandi

SANDIKU tidak menyimpan kata sandi asli pengguna. Sistem hanya menyimpan metadata anonim hasil analisis, seperti panjang kata sandi, skor, kategori, status kebocoran, jumlah kemunculan pada data kebocoran, status pemeriksaan HIBP, pola kelemahan, dan waktu analisis.

Pemeriksaan Have I Been Pwned dilakukan menggunakan pendekatan k-Anonymity. Backend menghitung hash SHA-1 dari kata sandi untuk kebutuhan pencocokan, tetapi hanya lima karakter awal hash yang dikirim ke layanan HIBP. Hash lengkap tidak disimpan di database.

SHA-1 pada konteks ini tidak digunakan untuk menyimpan kredensial, melainkan hanya untuk mekanisme pencocokan range API HIBP.

## Autentikasi Administrator

Autentikasi administrator menggunakan JWT. Endpoint admin memerlukan Bearer token dan backend melakukan pemeriksaan terhadap status aktif administrator.

Kontrol yang sudah tersedia:

* password admin di-hash menggunakan bcrypt melalui passlib;
* login admin menghasilkan JWT;
* endpoint dashboard membutuhkan token;
* admin nonaktif ditolak oleh backend;
* masa berlaku token dikendalikan melalui `ACCESS_TOKEN_EXPIRE_MINUTES`.

Keterbatasan yang masih ada:

* belum tersedia MFA administrator;
* belum tersedia refresh token;
* belum tersedia mekanisme pencabutan token;
* token frontend masih disimpan pada `localStorage`, sehingga perlu evaluasi lanjutan terhadap risiko XSS.

## Rate Limiting

Rate limiting dasar telah diterapkan pada endpoint login dan analisis. Namun, mekanisme penyimpanan rate limit masih berada di memori proses.

Keterbatasan:

* kurang ideal untuk deployment serverless;
* kurang konsisten pada lingkungan multi-instance;
* state rate limit dapat berbeda antar-instance;
* data rate limit dapat hilang ketika instance berganti.

## Security Headers

Backend telah menambahkan security headers dasar melalui middleware. Kontrol ini membantu mengurangi beberapa risiko umum pada aplikasi web.

Aspek yang perlu dipertahankan:

* header keamanan tetap aktif pada production;
* konfigurasi HSTS hanya digunakan saat aplikasi benar-benar berjalan melalui HTTPS;
* pengujian header dilakukan ulang setelah perubahan middleware atau deployment.

Environment variable yang relevan:

```env
SECURITY_HEADERS_ENABLED=true
HSTS_ENABLED=true
HSTS_MAX_AGE=31536000
```

## Swagger UI dan Dokumentasi API

Swagger UI masih aktif untuk kebutuhan dokumentasi dan demonstrasi. Hal ini masih dapat diterima pada tahap purwarupa akademik, tetapi perlu ditinjau ulang untuk production final.

Jika dokumentasi API tidak perlu ditampilkan secara publik, gunakan:

```env
ENABLE_DOCS=false
```

Rekomendasi:

* matikan Swagger UI pada production final jika tidak dibutuhkan;
* aktifkan hanya pada development atau demo terbatas;
* hindari menampilkan informasi sensitif pada deskripsi endpoint.

## Environment Variable dan Secret

Nilai rahasia tidak boleh ditulis ke repositori, dokumentasi publik, atau tangkapan layar.

Nilai yang harus disimpan hanya pada environment variable Vercel:

* `DATABASE_URL`;
* `SECRET_KEY`;
* `ADMIN_PASSWORD`;
* kredensial database;
* token atau secret lain yang digunakan pada production.

## Prioritas Perbaikan

1. Pindahkan rate limiter ke Redis, Vercel KV, Upstash, atau layanan terdistribusi lain.
2. Tambahkan MFA untuk administrator.
3. Tambahkan refresh token dan mekanisme pencabutan token.
4. Evaluasi penyimpanan token pada `localStorage` dan pertimbangkan strategi yang lebih aman.
5. Tambahkan Alembic untuk migrasi basis data.
6. Matikan Swagger UI pada production final jika tidak diperlukan.
7. Tambahkan dependency scanning untuk frontend dan backend.
8. Tambahkan pengujian frontend otomatis.
9. Tambahkan end-to-end testing untuk alur analisis, login, dashboard, dan logout.
10. Lakukan User Acceptance Testing.
11. Lakukan load testing untuk endpoint analisis.
12. Lakukan penetration testing dan audit keamanan independen.
13. Tambahkan monitoring error production.
14. Tambahkan logging production yang lebih terstruktur.
15. Lakukan rotasi secret jika ada token atau kredensial yang pernah terekspos.

## Temuan yang Telah Ditindaklanjuti

| Temuan                                              | Status  | Tindak Lanjut                                                         |
| --------------------------------------------------- | ------- | --------------------------------------------------------------------- |
| CORS production menolak domain frontend             | Selesai | `CORS_ORIGINS` pada backend Vercel disesuaikan dengan domain frontend |
| Middleware CORS belum memakai environment variable  | Selesai | `app/main.py` telah menggunakan konfigurasi `CORS_ORIGINS`            |
| Lint frontend bermasalah pada `Dashboard.jsx`       | Selesai | Struktur hook dan proses pemuatan data dashboard diperbaiki           |
| File generated dan asset template tersimpan di repo | Selesai | File tidak terpakai telah dihapus                                     |
| Dependency frontend tidak digunakan                 | Selesai | Dependency yang tidak diperlukan telah dibersihkan                    |
| Referensi favicon masih memakai asset template      | Selesai | Referensi favicon diperbarui ke `favicon.svg`                         |

## Risiko yang Masih Tersisa

| Risiko                              | Dampak                                                       | Mitigasi yang Disarankan                                      |
| ----------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| Rate limiter berbasis memori        | Proteksi tidak konsisten pada serverless atau multi-instance | Gunakan Redis/KV                                              |
| Token tersimpan di `localStorage`   | Berisiko jika terjadi XSS                                    | Evaluasi strategi penyimpanan token dan perketat proteksi XSS |
| Tidak ada MFA admin                 | Akun admin bergantung pada password saja                     | Tambahkan MFA                                                 |
| Tidak ada token revocation          | Token valid sampai masa berlaku habis                        | Tambahkan blacklist atau mekanisme revocation                 |
| Belum ada migrasi database          | Perubahan skema sulit dilacak                                | Gunakan Alembic                                               |
| Swagger UI aktif                    | Endpoint lebih mudah dieksplorasi publik                     | Nonaktifkan dengan `ENABLE_DOCS=false` pada production final  |
| Belum ada audit keamanan independen | Risiko celah keamanan belum teridentifikasi secara formal    | Lakukan penetration testing                                   |
| Belum ada dependency scanning       | Risiko package rentan tidak terpantau                        | Tambahkan scanning dependency                                 |

## Kesimpulan Keamanan

SANDIKU telah memiliki kontrol keamanan dasar yang memadai untuk purwarupa edukatif, termasuk hashing password admin, autentikasi JWT, pembatasan CORS production, rate limiting dasar, security headers, validasi input, serta prinsip tidak menyimpan kata sandi asli pengguna.

Namun, sistem belum dapat diklaim sebagai production-grade security system. Beberapa aspek penting masih perlu diperkuat, terutama rate limiting terdistribusi, MFA administrator, mekanisme pencabutan token, migrasi database, dependency scanning, pengujian beban, penetration testing, dan audit keamanan independen.

Dengan demikian, SANDIKU layak digunakan sebagai purwarupa akademik dan demonstrasi, tetapi belum disarankan sebagai layanan keamanan publik berskala besar tanpa penguatan dan audit lanjutan.