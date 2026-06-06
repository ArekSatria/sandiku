from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. Import semua model agar SQLAlchemy otomatis mengenali dan membuat tabelnya
from app.models.user import User
from app.models.analysis_log import AnalysisLog

# 2. Import semua router (Pastikan dashboard_router ikut didaftarkan)
from app.routers import analyzer_router, auth_router, dashboard_router
from app.database import engine, Base

# Perintah membuat tabel database otomatis jika belum terbentuk
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SANDIKU API",
    description="API untuk Sistem Analisis Kekuatan Kata Sandi (SANDIKU)",
    version="1.0.0"
)

# Konfigurasi CORS agar Frontend React bisa menembak API Backend FastAPI
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Mengizinkan semua method (GET, POST, dll)
    allow_headers=["*"],  # Mengizinkan semua header standar
)

# 3. Daftarkan seluruh router ke dalam aplikasi utama FastAPI
app.include_router(analyzer_router.router)
app.include_router(auth_router.router)
app.include_router(dashboard_router.router)  # <-- INI DIA YANG KEMARIN TERLEWAT, BOSS!

@app.get("/")
def read_root():
    return {
        "status": "success",
        "message": "API SANDIKU aktif dan berjalan dengan baik."
    }