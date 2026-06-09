"""Konfigurasi terpusat aplikasi SANDIKU."""

import os
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[2]

try:
    from dotenv import load_dotenv

    load_dotenv(BACKEND_DIR / ".env")
except ImportError:
    pass


def get_bool_env(key: str, default: bool = False) -> bool:
    value = os.getenv(key)

    if value is None:
        return default

    return value.strip().lower() in {"1", "true", "yes", "y", "on"}


DEFAULT_DATABASE_URL = f"sqlite:///{BACKEND_DIR / 'sandiku.db'}"

DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

SECRET_KEY = os.getenv("SECRET_KEY", "ganti-secret-key-ini-di-file-env")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

APP_ENV = os.getenv("APP_ENV", "development").strip().lower()
DEBUG = get_bool_env("DEBUG", APP_ENV == "development")

ENABLE_DOCS = get_bool_env("ENABLE_DOCS", APP_ENV != "production")

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]


SECURITY_HEADERS_ENABLED = get_bool_env("SECURITY_HEADERS_ENABLED", True)

HSTS_ENABLED = get_bool_env("HSTS_ENABLED", APP_ENV == "production")
HSTS_MAX_AGE = int(os.getenv("HSTS_MAX_AGE", "31536000"))

RATE_LIMIT_ENABLED = get_bool_env("RATE_LIMIT_ENABLED", True)
LOGIN_RATE_LIMIT_PER_MINUTE = int(os.getenv("LOGIN_RATE_LIMIT_PER_MINUTE", "5"))
ANALYZE_RATE_LIMIT_PER_MINUTE = int(os.getenv("ANALYZE_RATE_LIMIT_PER_MINUTE", "30"))

ADMIN_NAME = os.getenv("ADMIN_NAME", "Administrator")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@sandiku.local")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")

if APP_ENV == "production":
    if not SECRET_KEY or SECRET_KEY == "ganti-secret-key-ini-di-file-env":
        raise RuntimeError("SECRET_KEY wajib diatur pada environment production.")

    if not CORS_ORIGINS:
        raise RuntimeError("CORS_ORIGINS wajib diatur pada environment production.")