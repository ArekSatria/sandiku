# SANDIKU

## Sistem Analisis Kekuatan Kata Sandi

SANDIKU adalah aplikasi web edukatif untuk membantu pengguna mengevaluasi kekuatan kata sandi. Sistem menampilkan skor keamanan, kategori kekuatan, pola kelemahan, indikasi kebocoran publik, serta rekomendasi perbaikan dalam bahasa Indonesia.

Proyek ini dikembangkan secara mandiri sebagai purwarupa full-stack. Frontend dibangun menggunakan React.js dan Vite, sedangkan backend dibangun menggunakan Python dan FastAPI. SQLite digunakan untuk pengembangan lokal, sementara lingkungan produksi menggunakan Neon PostgreSQL 16.

> **Status deployment:** aplikasi telah ditempatkan pada lingkungan produksi sejak 10 Juni 2026 dan telah diverifikasi ulang setelah proses cleanup proyek. SANDIKU bukan sistem resmi dan tidak digunakan sebagai perangkat operasional instansi tempat magang.

## Akses Produksi

| Komponen     | URL                                       |
| ------------ | ----------------------------------------- |
| Frontend     | https://sandiku-frontend.vercel.app       |
| Backend      | https://sandiku-backend.vercel.app        |
| Status API   | https://sandiku-backend.vercel.app/       |
| Health Check | https://sandiku-backend.vercel.app/health |
| Swagger UI   | https://sandiku-backend.vercel.app/docs   |

> Swagger UI dapat diaktifkan untuk dokumentasi dan demonstrasi. Untuk lingkungan produksi final, endpoint dokumentasi dapat dinonaktifkan melalui konfigurasi `ENABLE_DOCS=false`.

## Fitur Utama

* Analisis kekuatan kata sandi berbasis web.
* Skor keamanan dalam rentang 0 sampai 100.
* Kategori kekuatan: Sangat Lemah, Lemah, Sedang, Kuat, dan Sangat Kuat.
* Deteksi pola lemah melalui pemeriksaan berbasis aturan.
* Pemeriksaan kata sandi umum melalui blocklist lokal.
* Pemeriksaan indikasi kebocoran publik melalui Have I Been Pwned dengan pendekatan k-Anonymity.
* Rekomendasi perbaikan kata sandi dalam bahasa Indonesia.
* Login administrator menggunakan JWT.
* Dashboard statistik dan riwayat analisis anonim.
* Ekspor riwayat analisis dalam format CSV.
* Penyimpanan metadata analisis tanpa menyimpan kata sandi asli atau hash lengkap.
* Format waktu Indonesia dengan zona WIB.
* Rate limiting dasar pada endpoint tertentu.
* Security headers pada backend.
* Pengujian otomatis backend menggunakan pytest.
* Deployment frontend dan backend secara terpisah melalui Vercel.

## Privasi

Kata sandi yang dimasukkan pengguna dikirim melalui HTTPS ke backend untuk diproses sementara. Sistem tidak menyimpan kata sandi asli maupun hash lengkap kata sandi publik. Data yang disimpan hanya berupa metadata anonim, yaitu:

* panjang kata sandi;
* skor keamanan;
* kategori kekuatan;
* status kebocoran;
* jumlah kemunculan pada data kebocoran;
* status pemeriksaan HIBP;
* pola kelemahan; dan
* waktu analisis.

Pemeriksaan HIBP dilakukan dengan mengirimkan lima karakter awal hash SHA-1 ke layanan eksternal. SHA-1 pada proses ini hanya digunakan untuk kebutuhan pencocokan k-Anonymity dan tidak digunakan untuk menyimpan kredensial pengguna.

## Teknologi

### Frontend

* React.js
* Vite
* Axios
* React Router DOM
* Bootstrap Icons melalui CDN
* CSS khusus

### Backend

* Python 3.12
* FastAPI
* SQLAlchemy
* Pydantic
* SQLite untuk pengembangan lokal
* PostgreSQL 16 pada Neon untuk produksi
* JWT
* bcrypt/passlib
* zxcvbn
* requests
* pytest
* pytest-cov

### Deployment

* Vercel untuk frontend
* Vercel untuk backend FastAPI
* Neon PostgreSQL untuk basis data produksi
* GitHub untuk repositori dan version control

## Struktur Proyek

```txt
sandiku/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── scripts/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── sql/
│   ├── .env.example
│   ├── requirements.txt
│   ├── pytest.ini
│   ├── index.py
│   └── vercel.json
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vercel.json
├── docs/
│   ├── TESTING_RESULT.md
│   ├── DEPLOYMENT_PLAN.md
│   ├── SECURITY_CHECKLIST.md
│   └── PROJECT_STATUS.md
├── .gitignore
└── README.md
```

## Menjalankan Backend Secara Lokal

Masuk ke direktori backend:

```bash
cd backend
```

Buat dan aktifkan virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

Instal dependency:

```bash
pip install -r requirements.txt
```

Salin file konfigurasi environment:

```bash
copy .env.example .env
```

Inisialisasi database lokal:

```bash
python -m app.scripts.init_db
```

Buat akun admin lokal:

```bash
python -m app.scripts.create_admin
```

Jalankan server backend:

```bash
uvicorn app.main:app --reload
```

Backend lokal tersedia pada:

```txt
http://127.0.0.1:8000
```

Swagger UI lokal tersedia pada:

```txt
http://127.0.0.1:8000/docs
```

## Menjalankan Frontend Secara Lokal

Masuk ke direktori frontend:

```bash
cd frontend
```

Instal dependency:

```bash
npm install
```

Salin file konfigurasi environment:

```bash
copy .env.example .env
```

Jalankan server pengembangan:

```bash
npm run dev
```

Frontend lokal tersedia pada:

```txt
http://localhost:5173
```

## Pengujian

Jalankan pengujian backend:

```bash
cd backend
venv\Scripts\activate
python -m pytest
```

Jalankan pengujian backend dengan coverage:

```bash
python -m pytest --cov=app --cov-report=term-missing
```

Jalankan pemeriksaan frontend:

```bash
cd frontend
npm run lint
npm run build
```

Hasil verifikasi terakhir terhadap source code:

* 32 pengujian backend lulus;
* build frontend berhasil;
* pemeriksaan lint frontend berhasil;
* endpoint backend produksi aktif;
* frontend produksi berhasil mengakses backend setelah konfigurasi CORS disesuaikan.

Rincian pengujian tersedia pada [`docs/TESTING_RESULT.md`](docs/TESTING_RESULT.md).

## Konfigurasi Produksi

Frontend memerlukan environment variable berikut:

```env
VITE_API_BASE_URL=https://sandiku-backend.vercel.app
```

Backend memerlukan environment variable berikut. Nilai asli tidak boleh dituliskan ke repositori.

```env
APP_ENV=production
DEBUG=false
DATABASE_URL=<connection-string-neon>
SECRET_KEY=<secret-key-kuat>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ENABLE_DOCS=true
CORS_ORIGINS=https://sandiku-frontend.vercel.app
SECURITY_HEADERS_ENABLED=true
HSTS_ENABLED=true
HSTS_MAX_AGE=31536000
RATE_LIMIT_ENABLED=true
LOGIN_RATE_LIMIT_PER_MINUTE=5
ANALYZE_RATE_LIMIT_PER_MINUTE=30
ADMIN_NAME=<nama-admin>
ADMIN_EMAIL=<email-admin>
ADMIN_PASSWORD=<password-admin-kuat>
```

Jika dokumentasi API tidak perlu ditampilkan pada production final, gunakan:

```env
ENABLE_DOCS=false
```

## Status Teknis dan Keterbatasan

* Deployment produksi aktif sejak 10 Juni 2026.
* Frontend dan backend ditempatkan pada dua proyek Vercel yang terpisah.
* Basis data produksi menggunakan Neon PostgreSQL 16.
* Tabel produksi utama terdiri atas `users` dan `analysis_logs`.
* Konfigurasi CORS backend sudah menggunakan `CORS_ORIGINS` dan telah disesuaikan dengan domain frontend produksi.
* Rate limiter masih berbasis memori, sehingga belum ideal untuk deployment serverless atau multi-instance.
* Migrasi basis data belum menggunakan Alembic.
* Swagger UI masih dapat diaktifkan untuk kebutuhan demonstrasi dan dokumentasi.
* UAT, pengujian beban, dan audit keamanan independen belum dilakukan.
* Sistem ini bersifat purwarupa edukatif dan belum ditujukan sebagai sistem keamanan produksi berskala besar.

## Dokumentasi

* [Status proyek](docs/PROJECT_STATUS.md)
* [Realisasi dan panduan deployment](docs/DEPLOYMENT_PLAN.md)
* [Hasil pengujian](docs/TESTING_RESULT.md)
* [Checklist keamanan](docs/SECURITY_CHECKLIST.md)