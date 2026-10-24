from uuid import UUID

from app.models import User
from app.security import create_session, hash_password


def create_admin_session(client, db_session_factory):
    with db_session_factory() as db:
        admin = User(
            full_name="Office Administrator",
            email="office-admin@example.org",
            password_hash=hash_password("correct-horse-battery-staple"),
            role="Admin",
        )
        db.add(admin)
        db.commit()
        token, _ = create_session(db, admin)
        admin_id = admin.id
    client.cookies.set("ngo_session", token)
    return admin_id


def test_admin_can_list_users_and_assign_a_role(client, db_session_factory):
    create_admin_session(client, db_session_factory)
    with db_session_factory() as db:
        user = User(
            full_name="Project Colleague",
            email="colleague@example.org",
            password_hash=hash_password("correct-horse-battery-staple"),
            role="Volunteer",
        )
        db.add(user)
        db.commit()
        user_id = user.id

    users = client.get("/api/admin/users")
    assert users.status_code == 200
    assert {user["email"] for user in users.json()} == {"office-admin@example.org", "colleague@example.org"}

    response = client.patch(f"/api/admin/users/{user_id}/role", json={"role": "Project Manager"})
    assert response.status_code == 200
    assert response.json()["role"] == "Project Manager"

    with db_session_factory() as db:
        assert db.get(User, user_id).role == "Project Manager"


def test_only_admins_can_change_roles(client, db_session_factory):
    with db_session_factory() as db:
        user = User(
            full_name="Volunteer",
            email="volunteer@example.org",
            password_hash=hash_password("correct-horse-battery-staple"),
            role="Volunteer",
        )
        db.add(user)
        db.commit()
        user_id = user.id
        token, _ = create_session(db, user)

    client.cookies.set("ngo_session", token)
    response = client.patch(f"/api/admin/users/{user_id}/role", json={"role": "Admin"})
    assert response.status_code == 403


def test_admin_role_updates_reject_invalid_roles_and_self_changes(client, db_session_factory):
    admin_id = create_admin_session(client, db_session_factory)

    invalid_role = client.patch(f"/api/admin/users/{admin_id}/role", json={"role": "HR Manager"})
    self_change = client.patch(f"/api/admin/users/{admin_id}/role", json={"role": "Staff"})

    assert invalid_role.status_code == 422
    assert self_change.status_code == 409
