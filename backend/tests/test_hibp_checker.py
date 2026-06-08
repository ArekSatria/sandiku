import hashlib

import requests

from app.services.hibp_checker import HibpChecker


class FakeResponse:
    def __init__(self, text: str, status_code: int = 200):
        self.text = text
        self.status_code = status_code

    def raise_for_status(self):
        if self.status_code >= 400:
            raise requests.HTTPError("HTTP error")


def test_hibp_checker_detects_breached_password(monkeypatch):
    password = "password123"
    sha1_password = hashlib.sha1(password.encode("utf-8")).hexdigest().upper()
    suffix = sha1_password[5:]

    def fake_get(*args, **kwargs):
        return FakeResponse(f"{suffix}:999\nABCDE:1")

    monkeypatch.setattr(requests, "get", fake_get)

    result = HibpChecker.check_breached_password(password)

    assert result["is_breached"] is True
    assert result["breach_count"] == 999
    assert result["check_status"] == "checked"
    assert result["error"] is None


def test_hibp_checker_returns_not_breached(monkeypatch):
    def fake_get(*args, **kwargs):
        return FakeResponse("ABCDE:1\nFFFFF:2")

    monkeypatch.setattr(requests, "get", fake_get)

    result = HibpChecker.check_breached_password("UniquePassword123!")

    assert result["is_breached"] is False
    assert result["breach_count"] == 0
    assert result["check_status"] == "checked"


def test_hibp_checker_handles_request_failure(monkeypatch):
    def fake_get(*args, **kwargs):
        raise requests.RequestException("Connection failed")

    monkeypatch.setattr(requests, "get", fake_get)

    result = HibpChecker.check_breached_password("UniquePassword123!")

    assert result["is_breached"] is False
    assert result["breach_count"] == 0
    assert result["check_status"] == "failed"
    assert result["error"] is not None