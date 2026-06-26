"""Script inisialisasi database SANDISCAN.

Jalankan dari folder backend:
python -m app.scripts.init_db
"""

from app.core.db_init import init_database


if __name__ == "__main__":
    init_database()
    print("Database SANDISCAN berhasil disiapkan.")