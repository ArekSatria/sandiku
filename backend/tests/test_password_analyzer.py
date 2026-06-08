from app.services.hibp_checker import HibpChecker
from app.services.password_analyzer import PasswordAnalyzer


def test_analyzer_returns_required_fields_when_not_breached(monkeypatch):
    def fake_hibp(password: str, timeout: int = 5):
        return {
            "is_breached": False,
            "breach_count": 0,
            "check_status": "checked",
            "error": None,
        }

    monkeypatch.setattr(HibpChecker, "check_breached_password", staticmethod(fake_hibp))

    result = PasswordAnalyzer.analyze_password("LangitBiru#KopiPagi27!")

    assert "score" in result
    assert "category" in result
    assert "password_length" in result
    assert "is_breached" in result
    assert "breach_count" in result
    assert "hibp_status" in result
    assert "detected_patterns" in result
    assert "recommendations" in result

    assert result["is_breached"] is False
    assert result["breach_count"] == 0
    assert result["hibp_status"] == "checked"
    assert 0 <= result["score"] <= 100


def test_analyzer_caps_score_when_breached(monkeypatch):
    def fake_hibp(password: str, timeout: int = 5):
        return {
            "is_breached": True,
            "breach_count": 2254650,
            "check_status": "checked",
            "error": None,
        }

    monkeypatch.setattr(HibpChecker, "check_breached_password", staticmethod(fake_hibp))

    result = PasswordAnalyzer.analyze_password("password123")

    assert result["is_breached"] is True
    assert result["breach_count"] == 2254650
    assert result["score"] <= 20
    assert result["category"] == "Sangat Lemah"


def test_analyzer_handles_hibp_failed_status(monkeypatch):
    def fake_hibp(password: str, timeout: int = 5):
        return {
            "is_breached": False,
            "breach_count": 0,
            "check_status": "failed",
            "error": "Connection failed",
        }

    monkeypatch.setattr(HibpChecker, "check_breached_password", staticmethod(fake_hibp))

    result = PasswordAnalyzer.analyze_password("LangitBiru#KopiPagi27!")

    assert result["hibp_status"] == "failed"
    assert any("HIBP gagal" in item or "pemeriksaan" in item.lower() for item in result["detected_patterns"])


def test_analyzer_output_uses_indonesian_feedback(monkeypatch):
    def fake_hibp(password: str, timeout: int = 5):
        return {
            "is_breached": False,
            "breach_count": 0,
            "check_status": "checked",
            "error": None,
        }

    monkeypatch.setattr(HibpChecker, "check_breached_password", staticmethod(fake_hibp))

    result = PasswordAnalyzer.analyze_password("password123")
    joined_messages = " ".join(result["detected_patterns"] + result["recommendations"])

    assert "This is a very common password" not in joined_messages
    assert "Add another word" not in joined_messages