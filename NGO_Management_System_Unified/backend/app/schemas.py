from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


def to_camel(value: str) -> str:
    head, *tail = value.split("_")
    return head + "".join(part.title() for part in tail)


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    @field_validator("full_name")
    @classmethod
    def strip_name(cls, value: str) -> str:
        normalized = value.strip()
        if len(normalized) < 2:
            raise ValueError("Enter a name between 2 and 120 characters.")
        return normalized

    @field_validator("password")
    @classmethod
    def validate_password_size(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 128:
            raise ValueError("Password must not exceed 128 UTF-8 bytes.")
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

    @field_validator("password")
    @classmethod
    def validate_password_size(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 128:
            raise ValueError("Password must not exceed 128 UTF-8 bytes.")
        return value


class UserResponse(BaseModel):
    id: UUID
    full_name: str
    email: EmailStr
    role: str

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class AdminRoleUpdateRequest(BaseModel):
    role: Literal["Admin", "Project Manager", "Staff", "Volunteer", "Board"]


class AuthResponse(BaseModel):
    user: UserResponse
