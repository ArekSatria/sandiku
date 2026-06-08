# Rencana Deployment SANDIKU

Dokumen ini menjelaskan rencana deployment sistem SANDIKU. Pada tahap pengembangan saat ini, sistem berjalan secara lokal menggunakan React.js, FastAPI, dan SQLite. Deployment produksi dapat dilakukan dengan memisahkan frontend, backend, dan database ke layanan cloud.

## Arsitektur Deployment

| Komponen   | Teknologi Lokal | Rencana Produksi          |
| ---------- | --------------- | ------------------------- |
| Frontend   | React.js + Vite | Vercel                    |
| Backend    | FastAPI         | Render                    |
| Database   | SQLite          | PostgreSQL, misalnya Neon |
| Repository | Git lokal       | GitHub                    |

## Rencana Deployment Frontend

Frontend dapat dideploy ke Vercel karena proyek menggunakan React.js dan Vite. Environment variable yang harus disiapkan adalah:

```env
VITE_API_BASE_URL=https://alamat-backend-produksi
```

Langkah umum:

1. Push source code ke GitHub.
2. Hubungkan repository ke Vercel.
3. Pilih folder `frontend` sebagai root project.
4. Atur build command `npm run build`.
5. Atur output directory `dist`.
6. Tambahkan environment variable `VITE_API_BASE_URL`.
7. Deploy dan uji halaman aplikasi.

## Rencana Deployment Backend

Backend dapat dideploy ke Render sebagai web service berbasis Python. Environment variable yang perlu disiapkan adalah:

```env
DATABASE_URL=postgresql://username:password@host/database
SECRET_KEY=random-string-produksi
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=https://alamat-frontend-produksi
ADMIN_NAME=Administrator
ADMIN_EMAIL=admin@sandiku.local
ADMIN_PASSWORD=password-admin-produksi
```

Langkah umum:

1. Push source code ke GitHub.
2. Hubungkan repository ke Render.
3. Pilih folder `backend` sebagai root service.
4. Gunakan build command `pip install -r requirements.txt`.
5. Gunakan start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
6. Tambahkan environment variable produksi.
7. Jalankan script inisialisasi database dan pembuatan admin jika diperlukan.
8. Uji endpoint `/` dan `/docs`.

## Rencana Database Produksi

SQLite digunakan untuk pengembangan lokal. Untuk produksi, PostgreSQL lebih disarankan karena lebih stabil untuk akses multi-user, transaksi, dan integrasi cloud.

Rencana penggunaan PostgreSQL:

1. Buat database PostgreSQL pada layanan cloud.
2. Salin connection string ke `DATABASE_URL`.
3. Pastikan backend membaca `DATABASE_URL` dari environment variable.
4. Jalankan inisialisasi tabel.
5. Buat akun admin.
6. Uji endpoint analisis dan dashboard.

## Catatan Penting

* Jangan deploy file `.env`.
* Jangan upload database lokal `sandiku.db`.
* Jangan gunakan `SECRET_KEY` contoh pada produksi.
* Pastikan `CORS_ORIGINS` hanya berisi domain frontend produksi.
* Pastikan akun admin menggunakan password kuat.
* Swagger UI dapat tetap digunakan untuk demonstrasi, tetapi pada produksi final dapat dibatasi atau dinonaktifkan.

## Status Saat Ini

Sistem belum dideploy secara online. Deployment masih berada pada tahap perencanaan dan kesiapan struktur proyek. Sistem telah siap untuk dijalankan secara lokal dan sudah memiliki dokumentasi environment, panduan instalasi, dan pengujian otomatis backend.
