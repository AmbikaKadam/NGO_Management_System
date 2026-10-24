from app.api.records import build_resource_router

router = build_resource_router(
    (
        "staff",
        "staff-attendance",
        "volunteers",
        "volunteer-assignments",
        "intern-applications",
    ),
    "people management",
)
