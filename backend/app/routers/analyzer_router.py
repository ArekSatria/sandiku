import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.rate_limiter import rate_limit_analyze
from app.database import get_db
from app.models.analysis_log import AnalysisLog
from app.schemas.analyzer_schema import PasswordRequest, PasswordResponse
from app.services.password_analyzer import PasswordAnalyzer
from app.utils.timezone import format_datetime_indonesia

router = APIRouter()


@router.post(
    "/api/analyze",
    response_model=PasswordResponse,
    tags=["Password Analyzer"],
    dependencies=[Depends(rate_limit_analyze)],
)
def analyze_password_endpoint(request: PasswordRequest, db: Session = Depends(get_db)):
    """Menganalisis kata sandi dan menyimpan metadata anonim.

    Catatan keamanan:
    - Kata sandi asli tidak disimpan.
    - Hash kata sandi analisis juga tidak disimpan.
    - Data yang disimpan hanya metadata hasil analisis.
    """
    result = PasswordAnalyzer.analyze_password(request.password)

    db_log = AnalysisLog(
        password_length=result["password_length"],
        score=result["score"],
        category=result["category"],
        is_breached=result["is_breached"],
        breach_count=result["breach_count"],
        hibp_status=result["hibp_status"],
        detected_patterns=json.dumps(result["detected_patterns"], ensure_ascii=False),
    )

    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    result["id"] = db_log.id
    result["created_at"] = format_datetime_indonesia(db_log.created_at)

    return result