import json
import logging
from json import JSONDecodeError

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.database import get_db
from app.models.analysis_log import AnalysisLog
from app.models.user import User
from app.utils.timezone import format_datetime_indonesia

router = APIRouter()
logger = logging.getLogger(__name__)


def parse_detected_patterns(raw_patterns: str | None) -> list:
    """
    Mengubah data detected_patterns dari JSON string menjadi list.

    Data detected_patterns di database disimpan sebagai Text/JSON string.
    Fungsi ini dibuat defensif agar dashboard tetap aman jika data kosong,
    rusak, atau formatnya tidak sesuai.
    """

    if not raw_patterns:
        return []

    try:
        parsed_patterns = json.loads(raw_patterns)

        if isinstance(parsed_patterns, list):
            return parsed_patterns

        if isinstance(parsed_patterns, dict):
            return [parsed_patterns]

        return [str(parsed_patterns)]

    except (JSONDecodeError, TypeError):
        return [str(raw_patterns)]


@router.get("/api/dashboard/statistics", tags=["Dashboard"])
def get_statistics(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """
    Mengambil statistik ringkas hasil analisis kata sandi.

    Endpoint ini hanya dapat diakses oleh admin yang memiliki token valid.
    Data yang dikembalikan bersifat anonim dan tidak berisi kata sandi asli.
    """

    try:
        total_analyses = db.query(AnalysisLog).count()

        avg_score_raw = db.query(func.avg(AnalysisLog.score)).scalar()
        avg_score = float(avg_score_raw) if avg_score_raw is not None else 0.0

        breached_count = (
            db.query(AnalysisLog)
            .filter(AnalysisLog.is_breached.is_(True))
            .count()
        )

        hibp_failed_count = (
            db.query(AnalysisLog)
            .filter(AnalysisLog.hibp_status == "failed")
            .count()
        )

        total_breach_hits_raw = db.query(
            func.sum(AnalysisLog.breach_count)
        ).scalar()
        total_breach_hits = int(total_breach_hits_raw or 0)

        categories = (
            db.query(AnalysisLog.category, func.count(AnalysisLog.id))
            .group_by(AnalysisLog.category)
            .all()
        )

        category_distribution = [
            {
                "category": str(category),
                "total": int(count),
            }
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

    except SQLAlchemyError as exc:
        logger.exception("Database error saat mengambil statistik dashboard: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gagal mengambil statistik dashboard.",
        ) from exc

    except Exception as exc:
        logger.exception("Unexpected error saat mengambil statistik dashboard: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Terjadi kesalahan pada server.",
        ) from exc


@router.get("/api/dashboard/analyses", tags=["Dashboard"])
def get_analysis_history(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """
    Mengambil 50 riwayat analisis terbaru.

    Endpoint ini hanya mengembalikan metadata anonim seperti panjang password,
    skor, kategori, status kebocoran, pola terdeteksi, dan waktu analisis.
    """

    try:
        logs = (
            db.query(AnalysisLog)
            .order_by(AnalysisLog.id.desc())
            .limit(50)
            .all()
        )

        result_logs = []

        for log in logs:
            result_logs.append(
                {
                    "id": int(log.id),
                    "password_length": int(log.password_length or 0),
                    "score": int(log.score or 0),
                    "category": str(log.category),
                    "is_breached": bool(log.is_breached),
                    "breach_count": int(log.breach_count or 0),
                    "hibp_status": str(log.hibp_status or "checked"),
                    "detected_patterns": parse_detected_patterns(
                        log.detected_patterns
                    ),
                    "created_at": format_datetime_indonesia(log.created_at),
                }
            )

        return result_logs

    except SQLAlchemyError as exc:
        logger.exception("Database error saat mengambil riwayat analisis: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gagal mengambil riwayat analisis.",
        ) from exc

    except Exception as exc:
        logger.exception("Unexpected error saat mengambil riwayat analisis: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Terjadi kesalahan pada server.",
        ) from exc