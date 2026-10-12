"""Initial migration for DEFCON 2.0 tables

Revision ID: 001_initial_tables
Revises: 
Create Date: 2026-10-11 19:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001_initial_tables'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. participant_sessions
    op.create_table(
        'participant_sessions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('session_token', sa.String(length=64), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('last_seen_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('ip_address', sa.String(length=64), nullable=True),
        sa.Column('user_agent', sa.String(length=500), nullable=True),
        sa.Column('challenge_1_completed', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('challenge_1_completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('challenge_2_completed', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('challenge_2_completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_participant_sessions_id'), 'participant_sessions', ['id'], unique=False)
    op.create_index(op.f('ix_participant_sessions_session_token'), 'participant_sessions', ['session_token'], unique=True)

    # 2. challenge_attempts
    op.create_table(
        'challenge_attempts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('session_id', sa.Integer(), nullable=False),
        sa.Column('challenge_id', sa.Integer(), nullable=False),
        sa.Column('submitted_answer', sa.String(length=200), nullable=False),
        sa.Column('is_correct', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['session_id'], ['participant_sessions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_challenge_attempts_id'), 'challenge_attempts', ['id'], unique=False)
    op.create_index(op.f('ix_challenge_attempts_session_id'), 'challenge_attempts', ['session_id'], unique=False)
    op.create_index(op.f('ix_challenge_attempts_challenge_id'), 'challenge_attempts', ['challenge_id'], unique=False)

    # 3. registrations
    op.create_table(
        'registrations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('registration_code', sa.String(length=32), nullable=False),
        sa.Column('session_id', sa.Integer(), nullable=True),
        sa.Column('team_name', sa.String(length=100), nullable=False),
        sa.Column('institution', sa.String(length=150), nullable=False),
        sa.Column('leader_name', sa.String(length=100), nullable=False),
        sa.Column('leader_email', sa.String(length=255), nullable=False),
        sa.Column('leader_phone', sa.String(length=25), nullable=False),
        sa.Column('team_size', sa.Integer(), nullable=False),
        sa.Column('agreed_to_rules', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['session_id'], ['participant_sessions.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('session_id')
    )
    op.create_index(op.f('ix_registrations_id'), 'registrations', ['id'], unique=False)
    op.create_index(op.f('ix_registrations_registration_code'), 'registrations', ['registration_code'], unique=True)
    op.create_index(op.f('ix_registrations_leader_email'), 'registrations', ['leader_email'], unique=True)

    # 4. team_members
    op.create_table(
        'team_members',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('registration_id', sa.Integer(), nullable=False),
        sa.Column('member_index', sa.Integer(), nullable=False),
        sa.Column('full_name', sa.String(length=100), nullable=False),
        sa.ForeignKeyConstraint(['registration_id'], ['registrations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_team_members_id'), 'team_members', ['id'], unique=False)
    op.create_index(op.f('ix_team_members_registration_id'), 'team_members', ['registration_id'], unique=False)


def downgrade() -> None:
    op.drop_table('team_members')
    op.drop_table('registrations')
    op.drop_table('challenge_attempts')
    op.drop_table('participant_sessions')
