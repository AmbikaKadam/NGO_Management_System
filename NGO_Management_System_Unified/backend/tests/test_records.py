import pytest
from pydantic import ValidationError
from sqlalchemy import text

from app.api.records import _metadata, _tables
from app.config import Settings
from app.models import User


def test_production_configuration_requires_secure_session_cookie():
    with pytest.raises(ValidationError):
        Settings(
            environment="production",
            database_url="postgresql+psycopg://user:pass@localhost/ngo",
            jwt_secret="a-production-secret-that-is-longer-than-thirty-two-characters",
            session_cookie_secure=False,
        )


def _install_test_tables(db_session_factory):
    _tables.clear()
    _metadata.clear()
    with db_session_factory() as db:
        db.execute(
            text(
                """
                CREATE TABLE donors (
                    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
                    display_name TEXT NOT NULL,
                    donor_type TEXT NOT NULL,
                    email TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
        )
        db.execute(
            text(
                """
                CREATE TABLE audit_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    actor_id TEXT,
                    action TEXT NOT NULL,
                    entity_type TEXT NOT NULL,
                    entity_id TEXT NOT NULL,
                    changes JSON NOT NULL DEFAULT '{}',
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
        )
        db.commit()


def _register(client, email="records@example.org"):
    return client.post(
        "/api/auth/register",
        json={
            "fullName": "Records User",
            "email": email,
            "password": "correct-horse-battery-staple",
        },
    )


def test_records_api_requires_auth_and_enforces_module_roles(client, db_session_factory):
    _install_test_tables(db_session_factory)

    assert client.get("/api/donors").status_code == 401
    assert _register(client).status_code == 201
    assert client.post(
        "/api/donors",
        json={"displayName": "Community Donor", "donorType": "Individual"},
    ).status_code == 403


def test_records_api_validates_persists_filters_and_audits(client, db_session_factory):
    _install_test_tables(db_session_factory)
    _register(client)
    assert client.get("/api/donors").status_code == 403
    with db_session_factory() as db:
        user = db.query(User).filter_by(email="records@example.org").one()
        user.role = "Admin"
        db.commit()

    invalid = client.post(
        "/api/donors",
        json={"displayName": "Community Donor", "donorType": "Individual", "unexpected": True},
    )
    assert invalid.status_code == 422

    created = client.post(
        "/api/donors",
        json={"displayName": "Community Donor", "donorType": "Individual", "email": "donor@example.org"},
    )
    assert created.status_code == 201
    record = created.json()
    assert record["displayName"] == "Community Donor"
    with db_session_factory() as db:
        assert db.scalar(text("SELECT COUNT(*) FROM donors")) == 1

    all_records = client.get("/api/donors")
    assert all_records.json()["total"] == 1, all_records.text
    results = client.get("/api/donors?search=Community&limit=10")
    assert results.status_code == 200
    assert results.json()["total"] == 1, results.text
    assert results.json()["items"][0]["id"] == record["id"]

    updated = client.patch(f"/api/donors/{record['id']}", json={"displayName": "Updated Donor"})
    assert updated.status_code == 200
    assert updated.json()["displayName"] == "Updated Donor"

    with db_session_factory() as db:
        assert db.scalar(text("SELECT COUNT(*) FROM audit_logs")) == 2

    assert client.delete(f"/api/donors/{record['id']}").status_code == 204
    assert client.get(f"/api/donors/{record['id']}").status_code == 404
