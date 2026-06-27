"""Script pembuatan atau pembaruan akun admin SANDISCAN.

Jalankan dari folder backend:
python -m app.scripts.create_admin

Nilai admin dapat diambil dari .env:
ADMIN_NAME=Administrator
ADMIN_EMAIL=admin@sandiscan.local
ADMIN_PASSWORD=ArekSatria07!
"""

import getpass
import os

from sqlalchemy.orm import Session

from app.core.db_init import init_database
from app.core.security import get_password_hash
from app.database import SessionLocal
from app.models.user import User


def _read_value(env_key: str, label: str, secret: bool = False) -> str:
    value = os.getenv(env_key)
    if value:
        return value.strip()

    if secret:
        return getpass.getpass(f"{label}: ").strip()

    return input(f"{label}: ").strip()


def create_or_update_admin(db: Session, name: str, email: str, password: str) -> User:
    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        existing_user.name = name
        existing_user.password_hash = get_password_hash(password)
        existing_user.is_active = True
        db.commit()
        db.refresh(existing_user)
        return existing_user

    user = User(
        name=name,
        email=email,
        password_hash=get_password_hash(password),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def main() -> None:
    init_database()

    name = _read_value("ADMIN_NAME", "Nama admin")
    email = _read_value("ADMIN_EMAIL", "Email admin")
    password = _read_value("ADMIN_PASSWORD", "Password admin", secret=True)

    if len(password) < 8:
        raise ValueError("Password admin minimal 8 karakter.")

    db = SessionLocal()
    try:
        user = create_or_update_admin(db, name=name, email=email, password=password)
        print(f"Admin berhasil dibuat/diperbarui: {user.email}")
    finally:
        db.close()


if __name__ == "__main__":
    main()