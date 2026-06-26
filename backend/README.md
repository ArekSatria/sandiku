# SANDISCAN Backend

Backend SANDISCAN dibangun menggunakan FastAPI. Backend menyediakan REST API untuk analisis kata sandi, autentikasi admin, dashboard statistik, serta penyimpanan metadata analisis secara anonim.

## Teknologi Backend

- Python
- FastAPI
- SQLAlchemy
- SQLite
- JWT
- bcrypt/passlib
- zxcvbn
- requests
- pytest

## Struktur Folder

```txt
backend/
├── app/
│   ├── core/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── scripts/
│   ├── services/
│   └── utils/
├── tests/
├── .env.example
├── requirements.txt
├── pytest.ini
└── README.md
```
