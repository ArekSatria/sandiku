from fastapi import APIRouter
from app.schemas.analyzer_schema import PasswordRequest, PasswordResponse
from app.services.password_analyzer import PasswordAnalyzer

router = APIRouter()

@router.post("/api/analyze", response_model=PasswordResponse, tags=["Password Analyzer"])
def analyze_password_endpoint(request: PasswordRequest):
    # Memanggil fungsi otak analitik yang sudah kita buat tadi
    result = PasswordAnalyzer.analyze_password(request.password)
    return result