from datetime import datetime, timezone

from fastapi import APIRouter, Cookie, HTTPException, Request, Response, status
from pwdlib import PasswordHash
from sqlalchemy import delete, func, select
from sqlalchemy.exc import IntegrityError

from app.config import settings
from app.dependencies import CurrentUser, DbSession
from app.limiter import limiter
from app.models import User, UserSession
from app.schemas import AuthResponse, LoginRequest, RegisterRequest, UserResponse
from app.security import create_session, get_session_user, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["authentication"])
dummy_password_hash = PasswordHash.recommended().hash("not-a-real-user-password")


def set_session_cookie(response: Response, token: str, expires_at: datetime) -> None:
    response.set_cookie(
        key="ngo_session",
        value=token,
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite="strict",
        path="/",
        expires=expires_at,
    )


def response_for_user(user: User) -> AuthResponse:
    return AuthResponse(user=UserResponse(id=str(user.id), full_name=user.full_name, email=user.email, role=user.role))


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register(request: Request, body: RegisterRequest, response: Response, db: DbSession) -> AuthResponse:
    email = str(body.email).strip().lower()
    if db.scalar(select(User.id).where(func.lower(User.email) == email)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with that email already exists.")

    user = User(full_name=body.full_name, email=email, password_hash=hash_password(body.password), role="Volunteer")
    db.add(user)
    try:
        db.flush()
        token, expires_at = create_session(db, user)
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with that email already exists.") from error

    set_session_cookie(response, token, expires_at)
    return response_for_user(user)


@router.post("/login", response_model=AuthResponse)
@limiter.limit("5/minute")
def login(request: Request, body: LoginRequest, response: Response, db: DbSession) -> AuthResponse:
    email = str(body.email).strip().lower()
    user = db.scalar(select(User).where(func.lower(User.email) == email, User.is_active.is_(True)))
    password_valid = verify_password(body.password, user.password_hash) if user else verify_password(body.password, dummy_password_hash)
    if not user or not password_valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email or password is incorrect.")

    user.last_login_at = datetime.now(timezone.utc)
    db.execute(delete(UserSession).where(UserSession.expires_at <= datetime.now(timezone.utc)))
    token, expires_at = create_session(db, user)
    set_session_cookie(response, token, expires_at)
    return response_for_user(user)


@router.get("/me", response_model=AuthResponse)
def current_session(user: CurrentUser) -> AuthResponse:
    return response_for_user(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    db: DbSession,
    token: str | None = Cookie(default=None, alias="ngo_session"),
) -> Response:
    session_user = get_session_user(db, token)
    if session_user:
        db.delete(db.get(UserSession, session_user[1]))
        db.commit()
    response.delete_cookie(
        key="ngo_session",
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite="strict",
        path="/",
    )
    response.status_code = status.HTTP_204_NO_CONTENT
    return response
