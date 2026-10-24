from app.api.records import build_resource_router

router = build_resource_router(
    ("beneficiaries", "beneficiary-enrollments", "beneficiary-services"),
    "beneficiaries",
)
