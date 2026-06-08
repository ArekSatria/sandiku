"""Konfigurasi terpusat aplikasi SANDIKU.

File ini dibuat agar konfigurasi sensitif tidak lagi ditulis langsung
pada source code. Nilai konfigurasi dapat diambil dari file .env atau dari
environment variable server produksi.
"""

import os
from pathlib import Path

# Struktur path:
# backend/app/core/config.py -> parents[0]=core, parents[1]=app, parents[2]=backend
BACKEND_DIR = Path(__file__).resolve().parents[2]

# Memuat file .env jika python-dotenv tersedia. Pada server produksi,
# environment variable tetap dapat dibaca langsung walaupun file .env tidak ada.
try:
    from dotenv import load_dotenv

    load_dotenv(BACKEND_DIR / ".env")
except ImportError:
    pass

DEFAULT_DATABASE_URL = f"sqlite:///{BACKEND_DIR / 'sandiku.db'}"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)

# Beberapa platform deployment memberi URL dengan awalan postgres://.
# SQLAlchemy lebih aman memakai postgresql://.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

SECRET_KEY = os.getenv("SECRET_KEY", "ganti-secret-key-ini-di-file-env")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]