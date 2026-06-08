from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import semua model agar SQLAlchemy mengenali struktur tabel.
from app.models.user import User
from app.models.analysis_log import AnalysisLog

# Import router aplikasi.
from app.routers import analyzer_router, auth_router, dashboard_router
from app.database import Base, engine
from app.core.config import CORS_ORIGINS

# Membuat tabel database otomatis jika belum terbentuk.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SANDIKU API",
    description="API untuk Sistem Analisis Kekuatan Kata Sandi (SANDIKU)",
    version="1.0.0",
)

# Konfigurasi CORS diambil dari environment variable CORS_ORIGINS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mendaftarkan seluruh router ke aplikasi utama.
app.include_router(analyzer_router.router)
app.include_router(auth_router.router)
app.include_router(dashboard_router.router)


@app.get("/")
def read_root():
    return {
        "status": "success",
        "message": "API SANDIKU aktif dan berjalan dengan baik.",
    }