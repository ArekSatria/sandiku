"""Bootstrap akun admin dari environment variable."""

from sqlalchemy.orm import Session

from app.core.config import ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD
from app.core.security import get_password_hash
from app.database import SessionLocal
from app.models.user import User


def ensure_admin_from_env() -> None:
    """Membuat atau memperbarui admin jika ADMIN_PASSWORD tersedia."""

    if not ADMIN_EMAIL or not ADMIN_PASSWORD:
        return

    if len(ADMIN_PASSWORD) < 8:
        raise RuntimeError("ADMIN_PASSWORD minimal 8 karakter.")

    db: Session = SessionLocal()

    try:
        existing_user = db.query(User).filter(User.email == ADMIN_EMAIL).first()

        if existing_user:
            existing_user.name = ADMIN_NAME
            existing_user.password_hash = get_password_hash(ADMIN_PASSWORD)
            existing_user.is_active = True
            db.commit()
            return

        admin = User(
            name=ADMIN_NAME,
            email=ADMIN_EMAIL,
            password_hash=get_password_hash(ADMIN_PASSWORD),
            is_active=True,
        )

        db.add(admin)
        db.commit()

    finally:
        db.close()