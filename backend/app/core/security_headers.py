"""Middleware security headers untuk SANDISCAN."""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.core.config import HSTS_ENABLED, HSTS_MAX_AGE, SECURITY_HEADERS_ENABLED


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        if not SECURITY_HEADERS_ENABLED:
            return response

        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = (
            "geolocation=(), microphone=(), camera=(), payment=()"
        )

        # CSP dibuat cukup aman tetapi tetap ramah untuk Swagger UI saat development.
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "img-src 'self' data: https:; "
            "style-src 'self' 'unsafe-inline' https:; "
            "script-src 'self' 'unsafe-inline' https:; "
            "connect-src 'self' https://api.pwnedpasswords.com; "
            "frame-ancestors 'none';"
        )

        if HSTS_ENABLED:
            response.headers["Strict-Transport-Security"] = (
                f"max-age={HSTS_MAX_AGE}; includeSubDomains"
            )

        return response