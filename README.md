# SANDIKU

## Sistem Analisis Kekuatan Kata Sandi

SANDIKU adalah aplikasi web edukatif untuk menganalisis kekuatan kata sandi. Sistem ini membantu pengguna memahami kualitas kata sandi melalui skor keamanan, kategori, deteksi pola lemah, pemeriksaan indikasi kebocoran publik, serta rekomendasi perbaikan.

Proyek ini dikembangkan sebagai purwarupa fullstack menggunakan React.js pada sisi frontend, FastAPI pada sisi backend, dan SQLite sebagai database lokal pengembangan. Sistem dirancang dengan prinsip privasi, yaitu tidak menyimpan kata sandi asli pengguna maupun hash kata sandi publik.

## Fitur Utama

* Analisis kekuatan kata sandi berbasis web.
* Skor keamanan kata sandi dalam rentang 0 sampai 100.
* Kategori kekuatan: Sangat Lemah, Lemah, Sedang, Kuat, dan Sangat Kuat.
* Deteksi pola lemah melalui rule-based checking.
* Pemeriksaan kata sandi umum melalui blocklist lokal.
* Pemeriksaan indikasi kebocoran melalui Have I Been Pwned dengan pendekatan k-Anonymity.
* Rekomendasi perbaikan kata sandi dalam bahasa Indonesia.
* Login admin menggunakan JWT.
* Dashboard statistik analisis anonim.
* Penyimpanan metadata analisis tanpa menyimpan kata sandi asli.
* Format waktu menggunakan kalender Indonesia dan WIB.
* Pengujian otomatis backend menggunakan pytest.

## Teknologi

### Frontend

* React.js
* Vite
* Axios
* React Router DOM
* CSS custom

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* JWT
* bcrypt/passlib
* zxcvbn
* requests
* pytest

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
│   ├── .env.example
│   ├── requirements.txt
│   ├── pytest.ini
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── docs/
│   ├── SCREENSHOT_GUIDE.md
│   ├── TESTING_RESULT.md
│   ├── DEPLOYMENT_PLAN.md
│   └── PROJECT_STATUS.md
├── .gitignore
└── README.md
```

## Cara Menjalankan Backend

Masuk ke folder backend.

```bash
cd backend
```

Buat virtual environment.

```bash
python -m venv venv
```

Aktifkan virtual environment.

```bash
venv\Scripts\activate
```

Instal dependency.

```bash
pip install -r requirements.txt
```

Salin file environment.

```bash
copy .env.example .env
```

Inisialisasi database.

```bash
python -m app.scripts.init_db
```

Buat akun admin.

```bash
python -m app.scripts.create_admin
```

Jalankan backend.

```bash
uvicorn app.main:app --reload
```

Backend berjalan pada alamat:

```txt
http://127.0.0.1:8000
```

Swagger UI tersedia pada alamat:

```txt
http://127.0.0.1:8000/docs
```

## Cara Menjalankan Frontend

Masuk ke folder frontend.

```bash
cd frontend
```

Instal dependency.

```bash
npm install
```

Salin file environment.

```bash
copy .env.example .env
```

Jalankan frontend.

```bash
npm run dev
```

Frontend berjalan pada alamat:

```txt
http://localhost:5173
```

## Pengujian Backend

Masuk ke folder backend dan aktifkan virtual environment.

```bash
cd backend
venv\Scripts\activate
```

Jalankan pengujian.

```bash
pytest
```

Jalankan pengujian dengan coverage.

```bash
pytest --cov=app
```

Hasil pengujian terakhir menunjukkan 30 test berhasil dengan total coverage 85%.

## Catatan Privasi

SANDIKU tidak menyimpan kata sandi asli pengguna. Data yang disimpan pada tabel analisis hanya berupa metadata anonim, yaitu panjang kata sandi, skor, kategori, status kebocoran, jumlah kemunculan pada basis data kebocoran, status pemeriksaan HIBP, pola kelemahan, dan waktu analisis.

## Status Deployment

Pada tahap pengembangan ini, sistem berjalan secara lokal. Rencana deployment dapat menggunakan:

* Frontend: Vercel
* Backend: Vercel
* Database produksi: Neon PostgreSQL atau layanan PostgreSQL lain

SQLite digunakan untuk pengembangan lokal dan demonstrasi purwarupa.
