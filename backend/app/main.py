from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import CORS_ORIGINS
from app.core.db_init import init_database
from app.routers import analyzer_router, auth_router, dashboard_router

init_database()

app = FastAPI(
    title="SANDIKU API",
    description="API untuk Sistem Analisis Kekuatan Kata Sandi (SANDIKU)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyzer_router.router)
app.include_router(auth_router.router)
app.include_router(dashboard_router.router)


@app.get("/")
def read_root():
    return {
        "status": "success",
        "message": "API SANDIKU aktif dan berjalan dengan baik.",
    }