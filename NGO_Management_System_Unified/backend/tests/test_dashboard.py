from datetime import date, datetime, timezone
from uuid import uuid4

from sqlalchemy import text

from app.api.records import _metadata, _tables
from app.models import User


def test_dashboard_aggregates_persisted_records(client, db_session_factory):
    _tables.clear()
    _metadata.clear()
    project_id = str(uuid4())
    today = date.today()
    with db_session_factory() as db:
        statements = [
            "CREATE TABLE projects (id TEXT PRIMARY KEY, name TEXT, status TEXT, progress INTEGER, end_date DATE, updated_at TIMESTAMP)",
            "CREATE TABLE project_team_members (id TEXT PRIMARY KEY, project_id TEXT, name TEXT, member_group TEXT, created_at TIMESTAMP)",
            "CREATE TABLE project_budget_items (id TEXT PRIMARY KEY, project_id TEXT, quantity NUMERIC, unit_cost NUMERIC)",
            "CREATE TABLE contributions (id TEXT PRIMARY KEY, contributed_on DATE, amount NUMERIC, status TEXT, currency TEXT)",
            "CREATE TABLE events (id TEXT PRIMARY KEY, title TEXT, starts_at TIMESTAMP, location TEXT, status TEXT)",
            "CREATE TABLE project_tasks (id TEXT PRIMARY KEY, title TEXT, status TEXT, priority TEXT, due_date DATE, updated_at TIMESTAMP, assignee_id UUID)",
            "CREATE TABLE volunteer_profiles (id TEXT PRIMARY KEY, status TEXT)",
            "CREATE TABLE volunteer_assignments (id TEXT PRIMARY KEY, project_id TEXT, status TEXT)",
            "CREATE TABLE beneficiary_enrollments (id TEXT PRIMARY KEY, beneficiary_id TEXT, status TEXT)",
            "CREATE TABLE beneficiaries (id TEXT PRIMARY KEY, created_at TIMESTAMP)",
            "CREATE TABLE donors (id TEXT PRIMARY KEY)",
            "CREATE TABLE campaigns (id TEXT PRIMARY KEY, status TEXT)",
            "CREATE TABLE proposals (id TEXT PRIMARY KEY, status TEXT)",
        ]
        for statement in statements:
            db.execute(text(statement))
        db.execute(
            text("INSERT INTO projects VALUES (:id, 'Community Garden', 'Active', 60, :end_date, :updated_at)"),
            {"id": project_id, "end_date": date(today.year, 12, 31), "updated_at": datetime.now(timezone.utc)},
        )
        db.execute(
            text("INSERT INTO project_team_members VALUES ('lead-1', :id, 'Asha Rao', 'Core', :created_at)"),
            {"id": project_id, "created_at": datetime.now(timezone.utc)},
        )
        db.execute(text("INSERT INTO project_budget_items VALUES ('budget-1', :id, 2, 250)"), {"id": project_id})
        db.execute(
            text("INSERT INTO contributions VALUES ('gift-1', :today, 1500, 'Received', 'INR')"),
            {"today": today},
        )
        db.execute(
            text("INSERT INTO events VALUES ('event-1', 'Garden Day', :starts_at, 'Pune', 'Scheduled')"),
            {"starts_at": datetime(2030, 1, 1, tzinfo=timezone.utc)},
        )
        db.execute(
            text("INSERT INTO project_tasks VALUES ('task-1', 'Prepare beds', 'In Progress', 'High', :due_date, :updated_at, NULL)"),
            {"due_date": today, "updated_at": datetime.now(timezone.utc)},
        )
        db.execute(text("INSERT INTO volunteer_profiles VALUES ('volunteer-1', 'Active')"))
        db.execute(text("INSERT INTO volunteer_assignments VALUES ('assignment-1', :id, 'Active')"), {"id": project_id})
        db.execute(text("INSERT INTO beneficiary_enrollments VALUES ('enrollment-1', 'beneficiary-1', 'Active')"))
        db.execute(text("INSERT INTO beneficiaries VALUES ('beneficiary-1', :created_at)"), {"created_at": datetime.now(timezone.utc)})
        db.execute(text("INSERT INTO donors VALUES ('donor-1')"))
        db.execute(text("INSERT INTO campaigns VALUES ('campaign-1', 'Active')"))
        db.execute(text("INSERT INTO proposals VALUES ('proposal-1', 'Under Review')"))
        db.commit()

    client.post(
        "/api/auth/register",
        json={
            "fullName": "Dashboard Admin",
            "email": "dashboard-admin@example.org",
            "password": "correct-horse-battery-staple",
        },
    )
    with db_session_factory() as db:
        volunteer = db.query(User).filter_by(email="dashboard-admin@example.org").one()
        db.execute(
            text("UPDATE project_tasks SET assignee_id = :assignee_id WHERE id = 'task-1'"),
            {"assignee_id": volunteer.id.hex},
        )
        db.commit()

    denied = client.get("/api/dashboard")
    assert denied.status_code == 403

    volunteer_reminders = client.get("/api/dashboard/reminders")
    assert volunteer_reminders.status_code == 200, volunteer_reminders.text
    assert volunteer_reminders.json()["pendingTasks"][0]["task"] == "Prepare beds"
    assert volunteer_reminders.json()["upcomingEvents"][0]["title"] == "Garden Day"

    with db_session_factory() as db:
        user = db.query(User).filter_by(email="dashboard-admin@example.org").one()
        user.role = "Board"
        db.commit()

    board_reminders = client.get("/api/dashboard/reminders")
    assert board_reminders.status_code == 200, board_reminders.text
    assert board_reminders.json()["pendingTasks"] == []
    assert board_reminders.json()["upcomingEvents"][0]["title"] == "Garden Day"
    assert client.get("/api/dashboard").status_code == 403

    with db_session_factory() as db:
        db.query(User).filter_by(email="dashboard-admin@example.org").one().role = "Admin"
        db.commit()

    response = client.get("/api/dashboard")
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["metrics"]["activeProjects"] == 1
    assert body["metrics"]["activeVolunteers"] == 1
    assert body["metrics"]["beneficiariesServed"] == 1
    assert body["metrics"]["fundsRaisedThisMonth"] == 1500
    assert body["metrics"]["pendingTasks"] == 1
    assert body["metrics"]["pendingProposals"] == 1
    assert body["recentProjects"][0]["name"] == "Community Garden"
    assert body["recentProjects"][0]["lead"] == "Asha Rao"
    assert body["recentProjects"][0]["budget"] == 500
    assert body["upcomingEvents"][0]["title"] == "Garden Day"
    assert body["pendingTasks"][0]["task"] == "Prepare beds"
    assert body["volunteerActivity"][0] == {"dept": "Community Garden", "assignments": 1}
