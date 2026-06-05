from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from datetime import datetime
from app.database import Base

class AnalysisLog(Base):
    __tablename__ = "analysis_logs"

    id = Column(Integer, primary_key=True, index=True)
    password_length = Column(Integer)
    score = Column(Integer)
    category = Column(String)
    is_breached = Column(Boolean, default=False)
    detected_patterns = Column(Text) # Disimpan sebagai JSON string
    created_at = Column(DateTime, default=datetime.utcnow)