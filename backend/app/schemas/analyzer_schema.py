from pydantic import BaseModel
from typing import List
from datetime import datetime

# Skema untuk menerima input kata sandi dari pengguna
class PasswordRequest(BaseModel):
    password: str

# Skema untuk mengirimkan hasil analisis ke pengguna
class PasswordResponse(BaseModel):
    id: int
    score: int
    category: str
    password_length: int
    is_breached: bool
    breach_count: int
    detected_patterns: List[str]
    recommendations: List[str]
    created_at: datetime