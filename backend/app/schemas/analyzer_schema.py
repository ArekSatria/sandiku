from datetime import datetime
from typing import List, Literal

from pydantic import BaseModel, Field


class PasswordRequest(BaseModel):
    password: str = Field(
        ...,
        min_length=1,
        max_length=128,
        description="Kata sandi yang akan dianalisis. Tidak disimpan dalam database.",
    )


class PasswordResponse(BaseModel):
    id: int
    score: int
    category: str
    password_length: int
    is_breached: bool
    breach_count: int
    hibp_status: Literal["checked", "failed"]
    detected_patterns: List[str]
    recommendations: List[str]
    created_at: datetime