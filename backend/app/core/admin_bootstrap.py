"""Bootstrap akun admin dari environment variable."""

from sqlalchemy.orm import Session

from app.core.config import ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD
from app.core.security import get_password_hash
from app.database import SessionLocal
from app.models.user import User


def ensure_admin_from_env() -> None:

        raise RuntimeError("ADMIN_PASSWORD minimal 8 karakter.")

    db: Session = SessionLocal()

    try:

            existing_user.is_active = True
            db.commit()
            return

        admin = User(

            is_active=True,
        )

        db.add(admin)
        db.commit()

    finally:
        db.close()