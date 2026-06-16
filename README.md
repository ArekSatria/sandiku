# SANDIKU

## Sistem Analisis Kekuatan Kata Sandi

SANDIKU adalah aplikasi web edukatif untuk membantu pengguna mengevaluasi kekuatan kata sandi. Sistem menampilkan skor keamanan, kategori, pola kelemahan, indikasi kebocoran publik, dan rekomendasi perbaikan dalam bahasa Indonesia.

Proyek ini dikembangkan secara mandiri sebagai purwarupa full-stack. Frontend menggunakan React.js dan Vite, sedangkan backend menggunakan Python dan FastAPI. SQLite digunakan untuk pengembangan lokal, sementara lingkungan produksi menggunakan Neon PostgreSQL 16.

> **Status deployment:** aplikasi telah ditempatkan pada lingkungan produksi pada 10 Juni 2026. SANDIKU bukan sistem resmi dan tidak digunakan sebagai perangkat operasional instansi tempat magang.

## Akses Produksi

| Komponen     | URL                                       |
|--------------|-------------------------------------------|
| Frontend     | https://sandiku-frontend.vercel.app       |
| Backend      | https://sandiku-backend.vercel.app        |
| Status API   | https://sandiku-backend.vercel.app/       |
| Health check | https://sandiku-backend.vercel.app/health |
| Swagger UI   | https://sandiku-backend.vercel.app/docs   |

## Fitur Utama

- Analisis kekuatan kata sandi berbasis web.
- Skor keamanan dalam rentang 0–100.
- Kategori: Sangat Lemah, Lemah, Sedang, Kuat, dan Sangat Kuat.
- Deteksi pola lemah melalui rule-based checking.
- Pemeriksaan kata sandi umum melalui blocklist lokal.
- Pemeriksaan indikasi kebocoran melalui Have I Been Pwned menggunakan k-Anonymity.
- Rekomendasi perbaikan dalam bahasa Indonesia.
- Login administrator menggunakan JWT.
- Dashboard statistik dan riwayat analisis anonim.
- Ekspor riwayat analisis dalam format CSV.
- Penyimpanan metadata tanpa menyimpan kata sandi asli atau hash lengkap kata sandi publik.
- Format waktu Indonesia dan zona WIB.
- Rate limiting dasar dan security headers pada backend.
- Pengujian otomatis backend menggunakan pytest.

## Privasi

Kata sandi yang dimasukkan pengguna dikirim melalui HTTPS ke backend untuk diproses sementara. Sistem tidak menyimpan kata sandi asli maupun hash lengkap kata sandi publik. Data yang disimpan hanya berupa metadata anonim:

- panjang kata sandi;
- skor;
- kategori;
- status kebocoran;
- jumlah kemunculan pada data kebocoran;
- status pemeriksaan HIBP;
- pola kelemahan; dan
- waktu analisis.

Pemeriksaan HIBP hanya mengirimkan lima karakter awal hash SHA-1 ke layanan eksternal. SHA-1 pada proses ini tidak digunakan untuk menyimpan kredensial.

## Teknologi

### Frontend

- React.js 19
- Vite 8
- Axios
- React Router DOM
- Bootstrap dan CSS khusus

### Backend

- Python 3.12
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite untuk pengembangan lokal
- PostgreSQL 16 pada Neon untuk produksi
- JWT dan bcrypt/passlib
- zxcvbn
- requests
- pytest dan pytest-cov

### Deployment

- Vercel untuk frontend
- Vercel untuk backend FastAPI
- Neon PostgreSQL untuk basis data produksi
- GitHub untuk repositori

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
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
├── docs/
│   ├── SCREENSHOT_GUIDE.md
│   ├── TESTING_RESULT.md
│   ├── DEPLOYMENT_PLAN.md
│   ├── SECURITY_CHECKLIST.md
│   └── PROJECT_STATUS.md
├── .gitignore
└── README.md
```

## Menjalankan Backend Secara Lokal

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python -m app.scripts.init_db
python -m app.scripts.create_admin
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

```bash
cd frontend
npm install
copy .env.example .env
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
python -m pytest -q
```

Jalankan pengujian dengan coverage:

```bash
python -m pytest --cov=app --cov-report=term-missing
```

Hasil verifikasi terakhir terhadap source code yang diserahkan:

- 32 pengujian backend lulus;
- total coverage 83%;
- build frontend berhasil;
- pemeriksaan lint frontend masih memerlukan perbaikan.

Rincian pengujian tersedia pada [`docs/TESTING_RESULT.md`](docs/TESTING_RESULT.md).

## Konfigurasi Produksi

Frontend memerlukan:

```env
VITE_API_BASE_URL=https://sandiku-backend.vercel.app
```

Backend memerlukan environment variable berikut tanpa menuliskan nilainya ke repositori:

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
ADMIN_NAME=<nama-admin>
ADMIN_EMAIL=<email-admin>
ADMIN_PASSWORD=<password-admin-kuat>
```

## Status Teknis dan Keterbatasan

- Deployment produksi aktif sejak 10 Juni 2026.
- Frontend dan backend ditempatkan pada dua proyek Vercel yang terpisah.
- Basis data produksi menggunakan proyek Neon `sandiku`, database `neondb`, wilayah Asia Pacific/Singapore.
- Tabel produksi terdiri atas `users` dan `analysis_logs`.
- Konfigurasi CORS pada `app/main.py` masih menggunakan wildcard dan perlu diselaraskan dengan `CORS_ORIGINS`.
- Rate limiter masih berbasis memori, sehingga belum ideal untuk deployment serverless atau multi-instance.
- Swagger UI masih diaktifkan untuk dokumentasi dan demonstrasi.
- Migrasi basis data belum menggunakan Alembic.
- UAT, pengujian beban, dan audit keamanan independen belum dilakukan.

## Dokumentasi

- [Status proyek](docs/PROJECT_STATUS.md)
- [Realisasi dan panduan deployment](docs/DEPLOYMENT_PLAN.md)
- [Hasil pengujian](docs/TESTING_RESULT.md)
- [Checklist keamanan](docs/SECURITY_CHECKLIST.md)