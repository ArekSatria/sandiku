from fastapi import APIRouter, Depends, HTTPException
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
    try:
        # 1. Total Analisis
        total_analyses = db.query(AnalysisLog).count()
        
        # 2. Rata-rata Skor (Gunakan float aman jika None)
        avg_score_raw = db.query(func.avg(AnalysisLog.score)).scalar()
        avg_score = float(avg_score_raw) if avg_score_raw is not None else 0.0
        
        # 3. Jumlah password terindikasi bocor
        breached_count = db.query(AnalysisLog).filter(AnalysisLog.is_breached == True).count()
        
        # 4. Distribusi Kategori
        categories = db.query(AnalysisLog.category, func.count(AnalysisLog.id)).group_by(AnalysisLog.category).all()
        category_distribution = [{"category": str(cat), "total": int(count)} for cat, count in categories]

        return {
            "total_analyses": int(total_analyses),
            "average_score": round(avg_score, 2),
            "breached_count": int(breached_count),
            "category_distribution": category_distribution
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Stats Error: {str(e)}")

@router.get("/api/dashboard/analyses", tags=["Dashboard"])
def get_analysis_history(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    try:
        # Mengambil 50 riwayat analisis terbaru
        logs = db.query(AnalysisLog).order_by(AnalysisLog.id.desc()).limit(50).all()
        
        result_logs = []
        for log in logs:
            # Siasati konversi pola deteksi yang berbentuk string JSON
            patterns = []
            if log.detected_patterns:
                try:
                    patterns = json.loads(log.detected_patterns)
                except Exception:
                    patterns = [str(log.detected_patterns)]

            # Penanganan Amandemen Tanggal SQLite (Kebal Crash)
            created_at_str = None
            if log.created_at:
                if isinstance(log.created_at, str):
                    created_at_str = log.created_at
                else:
                    try:
                        created_at_str = log.created_at.isoformat()
                    except Exception:
                        created_at_str = str(log.created_at)

            result_logs.append({
                "id": int(log.id),
                "password_length": int(log.password_length) if log.password_length else 0,
                "score": int(log.score) if log.score else 0,
                "category": str(log.category),
                "is_breached": bool(log.is_breached),
                "detected_patterns": patterns,
                "created_at": created_at_str
            })
                
        return result_logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database History Error: {str(e)}")