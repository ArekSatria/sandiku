"""Inisialisasi dan peningkatan skema database ringan.

Proyek ini belum memakai Alembic agar tetap sederhana untuk level purwarupa.
Fungsi di bawah memastikan tabel dibuat dan menambahkan kolom baru yang
belum ada pada database SQLite lama.
"""

from sqlalchemy import inspect, text

from app.database import Base, engine

# Import model agar metadata SQLAlchemy mengetahui seluruh tabel.
from app.models.analysis_log import AnalysisLog  # noqa: F401
from app.models.user import User  # noqa: F401


SQLITE_COLUMN_UPGRADES = {
    "users": {
        "is_active": "BOOLEAN DEFAULT 1 NOT NULL",
    },
    "analysis_logs": {
        "breach_count": "INTEGER DEFAULT 0 NOT NULL",
        "hibp_status": "VARCHAR(20) DEFAULT 'checked' NOT NULL",
    },
}


def _ensure_sqlite_columns() -> None:
    """Menambahkan kolom baru pada SQLite tanpa menghapus data lama."""
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())

    with engine.begin() as connection:
        for table_name, columns in SQLITE_COLUMN_UPGRADES.items():
            if table_name not in existing_tables:
                continue

            existing_columns = {
                column["name"] for column in inspector.get_columns(table_name)
            }

            for column_name, column_definition in columns.items():
                if column_name not in existing_columns:
                    connection.execute(
                        text(
                            f"ALTER TABLE {table_name} "
                            f"ADD COLUMN {column_name} {column_definition}"
                        )
                    )


def init_database() -> None:
    """Membuat tabel dan menjalankan upgrade skema ringan bila diperlukan."""
    Base.metadata.create_all(bind=engine)

    if engine.dialect.name == "sqlite":
        _ensure_sqlite_columns()