import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.database import get_db
from app.models.analysis_log import AnalysisLog
from app.models.user import User
from app.utils.timezone import format_datetime_indonesia

router = APIRouter()


@router.get("/api/dashboard/statistics", tags=["Dashboard"])
def get_statistics(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    try:
        total_analyses = db.query(AnalysisLog).count()

        avg_score_raw = db.query(func.avg(AnalysisLog.score)).scalar()
        avg_score = float(avg_score_raw) if avg_score_raw is not None else 0.0

        breached_count = (
            db.query(AnalysisLog).filter(AnalysisLog.is_breached.is_(True)).count()
        )

        hibp_failed_count = (
            db.query(AnalysisLog).filter(AnalysisLog.hibp_status == "failed").count()
        )

        total_breach_hits_raw = db.query(func.sum(AnalysisLog.breach_count)).scalar()
        total_breach_hits = int(total_breach_hits_raw or 0)

        categories = (
            db.query(AnalysisLog.category, func.count(AnalysisLog.id))
            .group_by(AnalysisLog.category)
            .all()
        )

        category_distribution = [
            {"category": str(category), "total": int(count)}
            for category, count in categories
        ]

        return {
            "total_analyses": int(total_analyses),
            "average_score": round(avg_score, 2),
            "breached_count": int(breached_count),
            "hibp_failed_count": int(hibp_failed_count),
            "total_breach_hits": total_breach_hits,
            "category_distribution": category_distribution,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database Stats Error: {exc}")


@router.get("/api/dashboard/analyses", tags=["Dashboard"])
def get_analysis_history(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    try:
        logs = db.query(AnalysisLog).order_by(AnalysisLog.id.desc()).limit(50).all()

        result_logs = []

        for log in logs:
            patterns = []

            if log.detected_patterns:
                try:
                    patterns = json.loads(log.detected_patterns)
                except Exception:
                    patterns = [str(log.detected_patterns)]

            result_logs.append(
                {
                    "id": int(log.id),
                    "password_length": int(log.password_length or 0),
                    "score": int(log.score or 0),
                    "category": str(log.category),
                    "is_breached": bool(log.is_breached),
                    "breach_count": int(getattr(log, "breach_count", 0) or 0),
                    "hibp_status": str(getattr(log, "hibp_status", "checked") or "checked"),
                    "detected_patterns": patterns,
                    "created_at": format_datetime_indonesia(log.created_at),
                }
            )

        return result_logs
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database History Error: {exc}")