from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.auth_schema import LoginRequest, TokenResponse
from app.models.user import User
from app.database import get_db
from app.core.security import verify_password, create_access_token

router = APIRouter()

@router.post("/api/auth/login", response_model=TokenResponse, tags=["Authentication"])
def login_admin(request: LoginRequest, db: Session = Depends(get_db)):
    # 1. Cari user di database berdasarkan email
    user = db.query(User).filter(User.email == request.email).first()
    
    # 2. Jika email tidak ada atau password salah, tolak!
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Jika benar, buatkan token JWT
    access_token = create_access_token(data={"sub": user.email, "id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}