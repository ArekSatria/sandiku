"""Rate limiter sederhana berbasis memori.

Rate limiter ini cocok untuk purwarupa, pengembangan lokal, dan demonstrasi.
Untuk produksi multi-instance, gunakan Redis atau layanan rate limiting eksternal.
"""

import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request, status

from app.core.config import (
    ANALYZE_RATE_LIMIT_PER_MINUTE,
    LOGIN_RATE_LIMIT_PER_MINUTE,
    RATE_LIMIT_ENABLED,
)


class InMemoryRateLimiter:
    def __init__(self, max_requests: int, window_seconds: int = 60, name: str = "default"):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.name = name
        self.requests = defaultdict(deque)

    def _get_client_key(self, request: Request) -> str:
        client_host = request.client.host if request.client else "unknown"
        return f"{self.name}:{client_host}"

    def reset(self) -> None:
        """Membersihkan seluruh catatan request.

        Fungsi ini berguna untuk testing agar satu test tidak memengaruhi test lain.
        """
        self.requests.clear()

    async def __call__(self, request: Request) -> None:
        if not RATE_LIMIT_ENABLED:
            return

        now = time.time()
        key = self._get_client_key(request)
        request_times = self.requests[key]

        while request_times and now - request_times[0] > self.window_seconds:
            request_times.popleft()

        if len(request_times) >= self.max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=(
                    "Terlalu banyak permintaan. Tunggu beberapa saat sebelum mencoba lagi."
                ),
            )

        request_times.append(now)


rate_limit_login = InMemoryRateLimiter(
    max_requests=LOGIN_RATE_LIMIT_PER_MINUTE,
    window_seconds=60,
    name="login",
)

rate_limit_analyze = InMemoryRateLimiter(
    max_requests=ANALYZE_RATE_LIMIT_PER_MINUTE,
    window_seconds=60,
    name="analyze",
)


def reset_rate_limiters() -> None:
    """Membersihkan seluruh limiter global aplikasi.

    Dipakai pada pengujian otomatis agar state rate limiter tidak bocor antar-test.
    """
    rate_limit_login.reset()
    rate_limit_analyze.reset()