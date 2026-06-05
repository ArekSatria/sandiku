from fastapi import FastAPI
from app.routers import analyzer_router  # Import router yang baru dibuat

app = FastAPI(
    title="SANDIKU API",
    description="API untuk Sistem Analisis Kekuatan Kata Sandi (SANDIKU)",
    version="1.0.0"
)

# Daftarkan router ke dalam aplikasi utama
app.include_router(analyzer_router.router)

@app.get("/")
def read_root():
    return {
        "status": "success",
        "message": "API SANDIKU aktif dan berjalan dengan baik."
    }