import csv
import io
from datetime import date, datetime, timezone
from decimal import Decimal
from typing import Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.sql.sqltypes import String

from app.api.records import _table
from app.dependencies import CurrentUser, DbSession

router = APIRouter(prefix="/api/reports", tags=["reports"])
REPORT_TYPES = {"progress", "budget", "impact", "department", "stakeholder"}


def _rows(db, resource: str, project_id: UUID | None) -> list[dict[str, Any]]:
    table = _table(db, resource)
    query = select(table)
    if project_id is not None and "project_id" in table.c:
        filter_value = str(project_id) if isinstance(table.c.project_id.type, String) else project_id
        query = query.where(table.c.project_id == filter_value)
    return [dict(row) for row in db.execute(query).mappings().all()]


def _date_filter(rows: list[dict[str, Any]], field: str, start: date | None, end: date | None):
    def normalize(value: Any) -> date | None:
        if isinstance(value, datetime):
            return value.date()
        if isinstance(value, date):
            return value
        if isinstance(value, str):
            try:
                return date.fromisoformat(value[:10])
            except ValueError:
                return None
        return None

    return [
        row
        for row in rows
        if (start is None or (normalize(row.get(field)) is not None and normalize(row[field]) >= start))
        and (end is None or (normalize(row.get(field)) is not None and normalize(row[field]) <= end))
    ]


def _report(db, report_type: str, project_id: UUID | None, start: date | None, end: date | None):
    if report_type not in REPORT_TYPES:
        raise HTTPException(status_code=404, detail="Report type not found.")

    projects = _rows(db, "projects", project_id)
    if project_id and not projects:
        raise HTTPException(status_code=404, detail="Project not found.")
    tasks = _rows(db, "tasks", project_id)
    expenses = _rows(db, "expenses", project_id)
    indicators = _rows(db, "impact-indicators", project_id)
    measurements = _rows(db, "impact-measurements", None)
    if project_id:
        indicator_ids = {indicator["id"] for indicator in indicators}
        measurements = [row for row in measurements if row["indicator_id"] in indicator_ids]
    checklists = _rows(db, "department-checklists", project_id)
    team = _rows(db, "team-members", project_id)
    partners = _rows(db, "partners", project_id)

    if report_type == "progress":
        scoped_tasks = _date_filter(tasks, "due_date", start, end)
        done = sum(task.get("status") == "Done" for task in scoped_tasks)
        data = [
            {
                "project": project.get("name", ""),
                "status": project.get("status", ""),
                "stage": project.get("current_stage", 0),
                "progress": project.get("progress", 0),
                "tasks": sum(task.get("project_id") == project["id"] for task in scoped_tasks),
                "completedTasks": sum(task.get("project_id") == project["id"] and task.get("status") == "Done" for task in scoped_tasks),
            }
            for project in projects
        ]
        title = "Project Progress Report"
        columns = ["Project", "Status", "Stage", "Progress", "Tasks", "Completed Tasks"]
        values = [[row["project"], row["status"], row["stage"], row["progress"], row["tasks"], row["completedTasks"]] for row in data]
        kpis = [
            {"label": "Projects", "value": len(projects)},
            {"label": "Tasks", "value": len(scoped_tasks)},
            {"label": "Tasks completed", "value": done},
        ]
        chart = {"kind": "bar", "xKey": "project", "series": [{"key": "progress", "label": "Progress (%)"}], "data": data}
    elif report_type == "budget":
        scoped_expenses = _date_filter(expenses, "expense_date", start, end)
        by_section = {
            section: sum((Decimal(str(row.get("amount") or 0)) for row in scoped_expenses if row.get("section") == section), Decimal(0))
            for section in ("Salaries", "Operations", "Assets")
        }
        budget_items = _rows(db, "budget-items", project_id)
        planned = {
            section: sum(
                (Decimal(str(row.get("quantity") or 0)) * Decimal(str(row.get("unit_cost") or 0)) for row in budget_items if row.get("section") == section),
                Decimal(0),
            )
            for section in ("Salaries", "Operations", "Assets")
        }
        title = "Project Budget Report"
        columns = ["Section", "Planned", "Spent", "Remaining"]
        values = [[section, float(planned[section]), float(by_section[section]), float(planned[section] - by_section[section])] for section in planned]
        total_spent = sum(by_section.values(), Decimal(0))
        kpis = [
            {"label": "Planned budget", "value": float(sum(planned.values(), Decimal(0)))},
            {"label": "Spent", "value": float(total_spent)},
            {"label": "Remaining", "value": float(sum(planned.values(), Decimal(0)) - total_spent)},
        ]
        chart = {"kind": "bar", "xKey": "section", "series": [{"key": "planned", "label": "Planned"}, {"key": "spent", "label": "Spent"}], "data": [{"section": key, "planned": float(planned[key]), "spent": float(by_section[key])} for key in planned]}
    elif report_type == "impact":
        scoped_measurements = _date_filter(measurements, "measured_on", start, end)
        measured_by_indicator = {}
        for measurement in sorted(scoped_measurements, key=lambda row: row.get("measured_on") or date.min):
            measured_by_indicator[measurement["indicator_id"]] = measurement.get("value", 0)
        title = "Project Impact Report"
        columns = ["Indicator", "Category", "Unit", "Target", "Actual"]
        values = [
            [item.get("name", ""), item.get("category", ""), item.get("unit", ""), float(item.get("target") or 0), float(measured_by_indicator.get(item["id"], item.get("current_value") or 0))]
            for item in indicators
        ]
        actual_total = sum((Decimal(str(row[4])) for row in values), Decimal(0))
        target_total = sum((Decimal(str(row[3])) for row in values), Decimal(0))
        kpis = [{"label": "Indicators", "value": len(indicators)}, {"label": "Target total", "value": float(target_total)}, {"label": "Measured total", "value": float(actual_total)}]
        chart = {"kind": "bar", "xKey": "name", "series": [{"key": "target", "label": "Target"}, {"key": "actual", "label": "Actual"}], "data": [{"name": row[0], "target": row[3], "actual": row[4]} for row in values]}
    elif report_type == "department":
        title = "Department Readiness Report"
        columns = ["Department", "Responsible", "Priority", "Checklist Items", "Completed", "Completion (%)"]
        values = []
        for checklist in checklists:
            groups = checklist.get("checklist_data") or []
            items = [item for group in groups for item in group.get("items", [])] if isinstance(groups, list) else []
            complete = sum(bool(item.get("done")) for item in items)
            values.append([checklist.get("department_id", ""), checklist.get("responsible_name") or "", checklist.get("priority"), len(items), complete, round(complete / len(items) * 100) if items else 0])
        average = round(sum(row[5] for row in values) / len(values)) if values else 0
        kpis = [{"label": "Departments", "value": len(values)}, {"label": "Average completion", "value": average}, {"label": "Completed items", "value": sum(row[4] for row in values)}]
        chart = {"kind": "bar", "xKey": "department", "series": [{"key": "completion", "label": "Completion (%)"}], "data": [{"department": row[0], "completion": row[5]} for row in values]}
    else:
        title = "Project Stakeholder Report"
        columns = ["Type", "Name", "Role"]
        values = [
            *[["Team", row.get("name", ""), row.get("role_title", "")] for row in team],
            *[["Partner", row.get("name", ""), row.get("contribution", "")] for row in partners],
        ]
        kpis = [{"label": "Team members", "value": len(team)}, {"label": "Partners", "value": len(partners)}, {"label": "Total stakeholders", "value": len(team) + len(partners)}]
        chart = {"kind": "pie", "xKey": "type", "series": [{"key": "count", "label": "Count"}], "data": [{"type": "Team", "count": len(team)}, {"type": "Partner", "count": len(partners)}]}

    return {
        "type": report_type,
        "title": title,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "kpis": kpis,
        "chart": chart,
        "table": {"columns": columns, "rows": values},
    }


@router.get("/{report_type}")
def get_report(
    report_type: str,
    user: CurrentUser,
    db: DbSession,
    project_id: UUID | None = Query(default=None, alias="projectId"),
    start: date | None = Query(default=None, alias="from"),
    end: date | None = Query(default=None, alias="to"),
):
    if user.role not in {"Admin", "Project Manager", "Staff"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to view reports.")
    if start and end and end < start:
        raise HTTPException(status_code=422, detail="'to' date must be on or after 'from' date.")
    return _report(db, report_type, project_id, start, end)


@router.get("/{report_type}/export")
def export_report(
    report_type: str,
    user: CurrentUser,
    db: DbSession,
    project_id: UUID | None = Query(default=None, alias="projectId"),
    start: date | None = Query(default=None, alias="from"),
    end: date | None = Query(default=None, alias="to"),
    file_format: str = Query(default="csv", alias="format", pattern="^csv$"),
):
    if user.role not in {"Admin", "Project Manager", "Staff"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to export reports.")
    if start and end and end < start:
        raise HTTPException(status_code=422, detail="'to' date must be on or after 'from' date.")
    report = _report(db, report_type, project_id, start, end)
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(report["table"]["columns"])
    writer.writerows(report["table"]["rows"])
    filename = f"{report_type}-report-{datetime.now(timezone.utc).date().isoformat()}.csv"
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
