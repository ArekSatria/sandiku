import json

from app.models.analysis_log import AnalysisLog
from tests.conftest import login_as_admin


def seed_analysis_logs(db_session):
    logs = [
        AnalysisLog(
            password_length=11,
            score=6,
            category="Sangat Lemah",
            is_breached=True,
            breach_count=1000,
            hibp_status="checked",
            detected_patterns=json.dumps(["Kata sandi umum"], ensure_ascii=False),
        ),
        AnalysisLog(
            password_length=22,
            score=82,
            category="Sangat Kuat",
            is_breached=False,
            breach_count=0,
            hibp_status="checked",
            detected_patterns=json.dumps(["Tidak ditemukan pola lemah"], ensure_ascii=False),
        ),
        AnalysisLog(
            password_length=18,
            score=70,
            category="Kuat",
            is_breached=False,
            breach_count=0,
            hibp_status="failed",
            detected_patterns=json.dumps(["Pemeriksaan HIBP gagal"], ensure_ascii=False),
        ),
    ]

    db_session.add_all(logs)
    db_session.commit()


def test_dashboard_rejects_request_without_token(client):
    response = client.get("/api/dashboard/statistics")

    assert response.status_code in [401, 403]


def test_dashboard_statistics_success(client, admin_user, db_session):
    seed_analysis_logs(db_session)

    headers = login_as_admin(client)

    response = client.get(
        "/api/dashboard/statistics",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total_analyses"] == 3
    assert data["breached_count"] == 1
    assert data["hibp_failed_count"] == 1
    assert data["total_breach_hits"] == 1000
    assert isinstance(data["category_distribution"], list)


def test_dashboard_analysis_history_success(client, admin_user, db_session):
    seed_analysis_logs(db_session)

    headers = login_as_admin(client)

    response = client.get(
        "/api/dashboard/analyses",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) == 3

    first_item = data[0]

    assert "id" in first_item
    assert "password_length" in first_item
    assert "score" in first_item
    assert "category" in first_item
    assert "is_breached" in first_item
    assert "breach_count" in first_item
    assert "hibp_status" in first_item
    assert "detected_patterns" in first_item
    assert "created_at" in first_item

    # Bukti response riwayat tidak membocorkan kata sandi asli.
    assert "password" not in first_item
    assert "password_hash" not in first_item