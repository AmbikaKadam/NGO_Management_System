from app.api.records import build_resource_router

router = build_resource_router(
    (
        "donors",
        "donor-occasions",
        "campaigns",
        "contributions",
        "donor-interactions",
    ),
    "donors",
)
