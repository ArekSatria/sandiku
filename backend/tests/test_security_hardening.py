from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient

from app.core.rate_limiter import InMemoryRateLimiter


def test_security_headers_are_added(client):
    response = client.get("/")

    # Pada test_app tidak ada route "/", jadi status bisa 404.
    # Yang diuji adalah header tetap ditambahkan oleh middleware.
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"
    assert response.headers["referrer-policy"] == "strict-origin-when-cross-origin"
    assert "permissions-policy" in response.headers
    assert "content-security-policy" in response.headers


def test_rate_limiter_blocks_after_limit():
    app = FastAPI()
    limiter = InMemoryRateLimiter(max_requests=2, window_seconds=60, name="test-limit")

    @app.get("/limited", dependencies=[Depends(limiter)])
    def limited_route():
        return {"status": "ok"}

    client = TestClient(app)

    response_1 = client.get("/limited")
    response_2 = client.get("/limited")
    response_3 = client.get("/limited")

    assert response_1.status_code == 200
    assert response_2.status_code == 200
    assert response_3.status_code == 429
    assert response_3.json()["detail"] == (
        "Terlalu banyak permintaan. Tunggu beberapa saat sebelum mencoba lagi."
    )