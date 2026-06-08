from sqlalchemy import Boolean, Column, DateTime, Integer, String

from app.database import Base
from app.utils.timezone import now_wib


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Waktu pembuatan admin memakai WIB.
    created_at = Column(DateTime, default=now_wib, nullable=False)