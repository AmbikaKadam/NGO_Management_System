from app.api.records import build_resource_router

router = build_resource_router(
    (
        "proposals",
        "projects",
        "team-members",
        "partners",
        "milestones",
        "tasks",
        "department-checklists",
        "documents",
        "budget-items",
        "expenses",
        "funding-sources",
        "impact-indicators",
        "impact-measurements",
        "resources",
        "risks",
        "activity",
    ),
    "projects",
)
