from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text

from app.database import Base
from app.utils.timezone import now_wib


class AnalysisLog(Base):
    __tablename__ = "analysis_logs"

    id = Column(Integer, primary_key=True, index=True)

    # Metadata anonim hasil analisis.
    # Sistem tidak menyimpan kata sandi asli maupun hash kata sandi pengguna.
    password_length = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    category = Column(String(50), nullable=False, index=True)

    # Metadata pemeriksaan kebocoran HIBP.
    is_breached = Column(Boolean, default=False, nullable=False, index=True)
    breach_count = Column(Integer, default=0, nullable=False)
    hibp_status = Column(String(20), default="checked", nullable=False, index=True)

    # Pola kelemahan disimpan sebagai JSON string.
    detected_patterns = Column(Text, nullable=True)

    # Waktu disimpan berdasarkan WIB.
    created_at = Column(DateTime, default=now_wib, nullable=False, index=True)