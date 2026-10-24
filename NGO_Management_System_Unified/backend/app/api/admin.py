from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select

from app.dependencies import DbSession, require_roles
from app.models import User
from app.schemas import AdminRoleUpdateRequest, UserResponse

router = APIRouter(prefix="/api/admin", tags=["administration"])
AdminUser = Annotated[User, Depends(require_roles("Admin"))]


@router.get("/users", response_model=list[UserResponse])
def list_users(_admin: AdminUser, db: DbSession):
    return db.scalars(select(User).order_by(User.created_at.desc())).all()


@router.patch("/users/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: UUID,
    body: AdminRoleUpdateRequest,
    admin: AdminUser,
    db: DbSession,
) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    if user.id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You cannot change your own role. Ask another administrator to do this.",
        )
    if user.role == "Admin" and body.role != "Admin" and user.is_active:
        active_admins = db.scalar(
            select(func.count()).select_from(User).where(User.role == "Admin", User.is_active.is_(True))
        )
        if active_admins <= 1:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="The last active administrator cannot be demoted.",
            )

    user.role = body.role
    db.commit()
    db.refresh(user)
    return user
