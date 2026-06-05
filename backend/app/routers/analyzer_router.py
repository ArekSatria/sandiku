import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.analyzer_schema import PasswordRequest, PasswordResponse
from app.services.password_analyzer import PasswordAnalyzer
from app.database import get_db
from app.models.analysis_log import AnalysisLog

router = APIRouter()

@router.post("/api/analyze", response_model=PasswordResponse, tags=["Password Analyzer"])
def analyze_password_endpoint(request: PasswordRequest, db: Session = Depends(get_db)):
    # 1. Jalankan otak analisis (termasuk cek kebocoran HIBP)
    result = PasswordAnalyzer.analyze_password(request.password)
    
    # 2. Simpan hasil analisis secara anonim ke Database
    db_log = AnalysisLog(
        password_length=result["password_length"],
        score=result["score"],
        category=result["category"],
        is_breached=result["is_breached"],
        # Data berupa List kita ubah ke JSON String agar bisa disimpan di kolom Text
        detected_patterns=json.dumps(result["detected_patterns"])
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log) # Mengambil id dan created_at yang baru saja dibuat database
    
    # 3. Tambahkan id dan created_at ke dalam hasil akhir untuk dikirim ke Frontend
    result["id"] = db_log.id
    result["created_at"] = db_log.created_at
    
    return result