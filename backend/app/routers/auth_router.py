from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.core.rate_limiter import rate_limit_login
from app.core.security import create_access_token, verify_password
from app.database import get_db
from app.models.user import User
from app.schemas.auth_schema import LoginRequest, TokenResponse, UserResponse

router = APIRouter()


@router.post(
    "/api/auth/login",
    response_model=TokenResponse,
    tags=["Authentication"],
    dependencies=[Depends(rate_limit_login)],
)
def login_admin(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()

    if not user or not user.is_active or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.email, "id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/api/auth/me", response_model=UserResponse, tags=["Authentication"])
def get_current_user_profile(current_admin: User = Depends(get_current_admin)):
    return current_admin