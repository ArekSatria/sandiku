from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import CORS_ORIGINS, ENABLE_DOCS
from app.core.db_init import init_database
from app.core.security_headers import SecurityHeadersMiddleware
from app.routers import analyzer_router, auth_router, dashboard_router

init_database()

app = FastAPI(
    title="SANDIKU API",
    description="API untuk Sistem Analisis Kekuatan Kata Sandi (SANDIKU)",
    version="1.0.0",
    docs_url="/docs" if ENABLE_DOCS else None,
    redoc_url="/redoc" if ENABLE_DOCS else None,
    openapi_url="/openapi.json" if ENABLE_DOCS else None,
)

app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
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