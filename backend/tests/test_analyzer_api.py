from app.models.analysis_log import AnalysisLog
from app.services.hibp_checker import HibpChecker


def test_analyze_endpoint_success(client, db_session, monkeypatch):
    def fake_hibp(password: str, timeout: int = 5):
        return {
            "is_breached": False,
            "breach_count": 0,
            "check_status": "checked",
            "error": None,
        }

    monkeypatch.setattr(HibpChecker, "check_breached_password", staticmethod(fake_hibp))

    response = client.post(
        "/api/analyze",
        json={"password": "LangitBiru#KopiPagi27!"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] is not None
    assert 0 <= data["score"] <= 100
    assert data["category"] in ["Sangat Lemah", "Lemah", "Sedang", "Kuat", "Sangat Kuat"]
    assert data["password_length"] == len("LangitBiru#KopiPagi27!")
    assert data["is_breached"] is False
    assert data["breach_count"] == 0
    assert data["hibp_status"] == "checked"
    assert isinstance(data["detected_patterns"], list)
    assert isinstance(data["recommendations"], list)
    assert "WIB" in data["created_at"]

    logs = db_session.query(AnalysisLog).all()
    assert len(logs) == 1

    log = logs[0]
    assert log.password_length == len("LangitBiru#KopiPagi27!")
    assert log.score == data["score"]
    assert log.category == data["category"]

    # Bukti keamanan: model log tidak memiliki field password asli.
    assert not hasattr(log, "password")
    assert not hasattr(log, "password_hash")


def test_analyze_endpoint_breached_password(client, monkeypatch):
    def fake_hibp(password: str, timeout: int = 5):
        return {
            "is_breached": True,
            "breach_count": 1000,
            "check_status": "checked",
            "error": None,
        }

    monkeypatch.setattr(HibpChecker, "check_breached_password", staticmethod(fake_hibp))

    response = client.post(
        "/api/analyze",
        json={"password": "password123"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["is_breached"] is True
    assert data["breach_count"] == 1000
    assert data["score"] <= 20
    assert data["category"] == "Sangat Lemah"


def test_analyze_endpoint_rejects_empty_password(client):
    response = client.post(
        "/api/analyze",
        json={"password": ""},
    )

    assert response.status_code == 422


def test_analyze_endpoint_rejects_too_long_password(client):
    response = client.post(
        "/api/analyze",
        json={"password": "a" * 129},
    )

    assert response.status_code == 422