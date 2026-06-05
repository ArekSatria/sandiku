from fastapi import FastAPI
from app.routers import analyzer_router, auth_router
from app.database import engine, Base

# otomatis membuat tabel users dan analysis_logs jika belum ada
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SANDIKU API",
    description="API untuk Sistem Analisis Kekuatan Kata Sandi (SANDIKU)",
    version="1.0.0"
)

# Daftarkan router
app.include_router(analyzer_router.router)
app.include_router(auth_router.router)

@app.get("/")
def read_root():
    return {
        "status": "success",
        "message": "API SANDIKU aktif dan berjalan dengan baik."
    }