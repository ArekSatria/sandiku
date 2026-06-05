from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.analysis_log import AnalysisLog
from app.models.user import User
from app.core.dependencies import get_current_admin
import json

router = APIRouter()

@router.get("/api/dashboard/statistics", tags=["Dashboard"])
def get_statistics(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    # 1. Total Analisis
    total_analyses = db.query(AnalysisLog).count()
    
    # 2. Rata-rata Skor
    avg_score = db.query(func.avg(AnalysisLog.score)).scalar() or 0
    
    # 3. Jumlah password terindikasi bocor
    breached_count = db.query(AnalysisLog).filter(AnalysisLog.is_breached == True).count()
    
    # 4. Distribusi Kategori (Sangat Lemah, Lemah, dll)
    categories = db.query(AnalysisLog.category, func.count(AnalysisLog.id)).group_by(AnalysisLog.category).all()
    category_distribution = [{"category": cat, "total": count} for cat, count in categories]

    return {
        "total_analyses": total_analyses,
        "average_score": round(avg_score, 2),
        "breached_count": breached_count,
        "category_distribution": category_distribution
    }

@router.get("/api/dashboard/analyses", tags=["Dashboard"])
def get_analysis_history(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    # Mengambil 50 riwayat analisis terbaru
    logs = db.query(AnalysisLog).order_by(AnalysisLog.created_at.desc()).limit(50).all()
    
    # Ubah string JSON detected_patterns kembali menjadi list agar rapi di response
    for log in logs:
        if log.detected_patterns:
            log.detected_patterns = json.loads(log.detected_patterns)
            
    return logs