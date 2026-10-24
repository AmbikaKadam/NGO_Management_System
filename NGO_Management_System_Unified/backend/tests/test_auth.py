from app.models import User
from app.security import create_session, hash_password, verify_password


def test_register_hashes_password_and_assigns_least_privilege_role(client, db_session_factory):
    password = "correct-horse-battery-staple"
    response = client.post(
        "/api/auth/register",
        json={
            "fullName": "New Volunteer",
            "email": "New.User@Example.org",
            "password": password,
            "role": "Admin",
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert body["user"]["fullName"] == "New Volunteer"
    assert body["user"]["email"] == "new.user@example.org"
    assert body["user"]["role"] == "Volunteer"
    assert "password" not in body["user"]
    assert client.cookies.get("ngo_session")

    with db_session_factory() as db:
        user = db.query(User).filter_by(email="new.user@example.org").one()
        assert user.password_hash != password
        assert verify_password(password, user.password_hash)


def test_login_requires_valid_credentials_and_logout_revokes_session(client):
    client.post(
        "/api/auth/register",
        json={
            "fullName": "Session User",
            "email": "session@example.org",
            "password": "correct-horse-battery-staple",
        },
    )
    client.post("/api/auth/logout")

    invalid = client.post(
        "/api/auth/login",
        json={"email": "session@example.org", "password": "incorrect-password"},
    )
    assert invalid.status_code == 401

    valid = client.post(
        "/api/auth/login",
        json={"email": "SESSION@example.org", "password": "correct-horse-battery-staple"},
    )
    assert valid.status_code == 200
    assert client.get("/api/auth/me").status_code == 200

    assert client.post("/api/auth/logout").status_code == 204
    assert client.get("/api/auth/me").status_code == 401


def test_registration_rejects_weak_password_and_duplicate_email(client):
    data = {"fullName": "Existing User", "email": "existing@example.org", "password": "correct-horse-battery-staple"}
    assert client.post("/api/auth/register", json=data).status_code == 201

    duplicate = client.post("/api/auth/register", json=data)
    weak = client.post(
        "/api/auth/register",
        json={"fullName": "Other User", "email": "other@example.org", "password": "short"},
    )
    assert duplicate.status_code == 409
    assert weak.status_code == 422


def test_admin_route_enforces_the_database_role(client, db_session_factory):
    with db_session_factory() as db:
        user = User(
            full_name="Role Test User",
            email="role@example.org",
            password_hash=hash_password("correct-horse-battery-staple"),
            role="Volunteer",
        )
        db.add(user)
        db.commit()
        token, _ = create_session(db, user)

    client.cookies.set("ngo_session", token)
    assert client.get("/api/admin/users").status_code == 403

    with db_session_factory() as db:
        user = db.query(User).filter_by(email="role@example.org").one()
        user.role = "Admin"
        db.commit()

    response = client.get("/api/admin/users")
    assert response.status_code == 200
    assert response.json()[0]["email"] == "role@example.org"
