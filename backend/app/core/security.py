from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt

# Konfigurasi keamanan (seharusnya diletakkan di file .env untuk proyek aslinya)
SECRET_KEY = "kunci_rahasia_sandiku_super_aman_polda_sumsel"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Pengaturan algoritma hashing (Bcrypt) sesuai standar OWASP
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt