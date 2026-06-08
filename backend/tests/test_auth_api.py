def test_login_admin_success(client, admin_user):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "admin@test.local",
            "password": "AdminTest123!",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_admin_wrong_password(client, admin_user):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "admin@test.local",
            "password": "WrongPassword",
        },
    )

    assert response.status_code == 401


def test_login_inactive_admin_rejected(client, inactive_admin):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "inactive@test.local",
            "password": "AdminTest123!",
        },
    )

    assert response.status_code == 401


def test_get_current_admin_profile(client, admin_user):
    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "admin@test.local",
            "password": "AdminTest123!",
        },
    )

    token = login_response.json()["access_token"]

    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["email"] == "admin@test.local"
    assert data["name"] == "Admin Test"
    assert data["is_active"] is True


def test_get_current_admin_without_token_rejected(client):
    response = client.get("/api/auth/me")

    assert response.status_code in [401, 403]