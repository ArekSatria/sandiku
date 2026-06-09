"""Bootstrap akun admin dari environment variable."""

from sqlalchemy.orm import Session

from app.core.config import ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD
from app.core.security import get_password_hash
from app.database import SessionLocal
from app.models.user import User


def ensure_admin_from_env() -> None:
    """Membuat atau memperbarui admin dari environment variable."""

    admin_email = (ADMIN_EMAIL or "").strip().lower()
    admin_name = (ADMIN_NAME or "Administrator").strip()
    admin_password = (ADMIN_PASSWORD or "").strip()

    if not admin_email or not admin_password:
        return

    if len(admin_password) < 8:
        raise RuntimeError("ADMIN_PASSWORD minimal 8 karakter.")

    db: Session = SessionLocal()

    try:
        existing_user = db.query(User).filter(User.email == admin_email).first()

        if existing_user:
            existing_user.name = admin_name
            existing_user.password_hash = get_password_hash(admin_password)
            existing_user.is_active = True
            db.commit()
            return

        admin = User(
            name=admin_name,
            email=admin_email,
            password_hash=get_password_hash(admin_password),
            is_active=True,
        )

        db.add(admin)
        db.commit()

    finally:
        db.close()