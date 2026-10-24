import os
from itertools import count

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET", "pytest-only-secret-that-is-at-least-32-bytes-long")
os.environ.setdefault("APP_ORIGIN", "http://testserver")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

_test_client_hosts = count(2)


@pytest.fixture
def db_session_factory():
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    test_session = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    Base.metadata.create_all(engine)

    yield test_session
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture
def client(db_session_factory):
    def override_get_db():
        with db_session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, client=(f"127.0.0.{next(_test_client_hosts)}", 20000)) as test_client:
        yield test_client
    app.dependency_overrides.clear()
