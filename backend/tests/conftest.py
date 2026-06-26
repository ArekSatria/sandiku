import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.rate_limiter import reset_rate_limiters
from app.core.security import get_password_hash
from app.core.security_headers import SecurityHeadersMiddleware
from app.database import Base, get_db
from app.models.analysis_log import AnalysisLog
from app.models.user import User
from app.routers import analyzer_router, auth_router, dashboard_router


@pytest.fixture(autouse=True)
def reset_rate_limit_state():
    """Membersihkan state rate limiter sebelum dan sesudah setiap test."""
    reset_rate_limiters()
    yield
    reset_rate_limiters()


@pytest.fixture()
def db_session():
    """Membuat database SQLite in-memory khusus testing."""
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )

    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture()
def test_app(db_session):
    """Membuat instance FastAPI khusus untuk testing."""
    app = FastAPI(title="SANDISCAN Test API")

    app.add_middleware(SecurityHeadersMiddleware)

    app.include_router(analyzer_router.router)
    app.include_router(auth_router.router)
    app.include_router(dashboard_router.router)

    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    yield app

    app.dependency_overrides.clear()


@pytest.fixture()
def client(test_app):
    return TestClient(test_app)


@pytest.fixture()
def admin_user(db_session):
    user = User(
        name="Admin Test",
        email="admin@test.local",
        password_hash=get_password_hash("AdminTest123!"),
        is_active=True,
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    return user


@pytest.fixture()
def inactive_admin(db_session):
    user = User(
        name="Inactive Admin",
        email="inactive@test.local",
        password_hash=get_password_hash("AdminTest123!"),
        is_active=False,
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    return user


def login_as_admin(client):
    """Helper untuk login admin dan menghasilkan header Authorization."""
    response = client.post(
        "/api/auth/login",
        json={
            "email": "admin@test.local",
            "password": "AdminTest123!",
        },
    )

    assert response.status_code == 200

    token = response.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}