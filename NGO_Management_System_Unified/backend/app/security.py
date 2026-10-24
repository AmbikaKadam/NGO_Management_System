from datetime import datetime, timedelta, timezone
from uuid import UUID, uuid4

import jwt
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.models import User, UserSession

password_hasher = PasswordHash.recommended()
JWT_ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return password_hasher.verify(password, password_hash)
    except (ValueError, TypeError):
        return False


def create_session(db: Session, user: User) -> tuple[str, datetime]:
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=settings.jwt_expire_minutes)
    session_id = uuid4()
    token = jwt.encode(
        {"sub": str(user.id), "jti": str(session_id), "iat": now, "exp": expires_at},
        settings.jwt_secret,
        algorithm=JWT_ALGORITHM,
    )
    db.add(UserSession(jti=session_id, user_id=user.id, expires_at=expires_at))
    db.commit()
    return token, expires_at


def get_session_user(db: Session, token: str | None) -> tuple[User, UUID] | None:
    if not token:
        return None
    try:
        claims = jwt.decode(token, settings.jwt_secret, algorithms=[JWT_ALGORITHM])
        user_id = UUID(claims["sub"])
        session_id = UUID(claims["jti"])
    except (jwt.InvalidTokenError, KeyError, TypeError, ValueError):
        return None

    session = db.scalar(
        select(UserSession).where(
            UserSession.jti == session_id,
            UserSession.user_id == user_id,
            UserSession.expires_at > datetime.now(timezone.utc),
        )
    )
    if session is None:
        return None
    user = db.scalar(select(User).where(User.id == user_id, User.is_active.is_(True)))
    return (user, session_id) if user else None
