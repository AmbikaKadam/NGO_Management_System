"""Add revocable JWT session records.

Revision ID: 0001_user_sessions
Revises:
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_user_sessions"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (lower(email))")
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS user_sessions (
            jti uuid PRIMARY KEY,
            user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            expires_at timestamptz NOT NULL,
            created_at timestamptz NOT NULL DEFAULT now()
        )
        """
    )
    op.execute("CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id)")
    op.execute("CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at)")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS user_sessions")
    op.execute("DROP INDEX IF EXISTS idx_users_email_lower")
