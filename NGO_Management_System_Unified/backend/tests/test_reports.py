from uuid import uuid4

from sqlalchemy import text

from app.api.records import _metadata, _tables
from app.models import User


def test_progress_report_reads_project_data_and_exports_csv(client, db_session_factory):
    _tables.clear()
    _metadata.clear()
    project_id = str(uuid4())
    with db_session_factory() as db:
        statements = [
            "CREATE TABLE projects (id TEXT PRIMARY KEY, name TEXT NOT NULL, status TEXT, current_stage INTEGER, progress INTEGER)",
            "CREATE TABLE project_tasks (id TEXT PRIMARY KEY, project_id TEXT, status TEXT, due_date DATE)",
            "CREATE TABLE project_expenses (id TEXT PRIMARY KEY, project_id TEXT, amount NUMERIC, section TEXT, expense_date DATE)",
            "CREATE TABLE impact_indicators (id TEXT PRIMARY KEY, project_id TEXT, name TEXT, category TEXT, unit TEXT, target NUMERIC, current_value NUMERIC)",
            "CREATE TABLE impact_measurements (id TEXT PRIMARY KEY, indicator_id TEXT, measured_on DATE, value NUMERIC)",
            "CREATE TABLE project_department_checklists (id TEXT PRIMARY KEY, project_id TEXT, department_id TEXT, responsible_name TEXT, priority INTEGER, checklist_data JSON)",
            "CREATE TABLE project_team_members (id TEXT PRIMARY KEY, project_id TEXT, name TEXT, role_title TEXT)",
            "CREATE TABLE project_partners (id TEXT PRIMARY KEY, project_id TEXT, name TEXT, contribution TEXT)",
        ]
        for statement in statements:
            db.execute(text(statement))
        db.execute(
            text("INSERT INTO projects VALUES (:id, 'Clean Water Project', 'Active', 2, 65)"),
            {"id": project_id},
        )
        db.execute(
            text("INSERT INTO project_tasks VALUES ('task-1', :id, 'Done', '2026-10-20')"),
            {"id": project_id},
        )
        db.commit()

    client.post(
        "/api/auth/register",
        json={
            "fullName": "Report Admin",
            "email": "report-admin@example.org",
            "password": "correct-horse-battery-staple",
        },
    )
    with db_session_factory() as db:
        db.query(User).filter_by(email="report-admin@example.org").one().role = "Admin"
        db.commit()

    report = client.get(f"/api/reports/progress?projectId={project_id}&from=2026-10-01&to=2026-10-31")
    assert report.status_code == 200, report.text
    body = report.json()
    assert body["title"] == "Project Progress Report"
    assert body["table"]["rows"][0][0] == "Clean Water Project"
    assert body["table"]["rows"][0][4:] == [1, 1]

    exported = client.get(f"/api/reports/progress/export?projectId={project_id}&format=csv")
    assert exported.status_code == 200
    assert "text/csv" in exported.headers["content-type"]
    assert "Clean Water Project" in exported.text
