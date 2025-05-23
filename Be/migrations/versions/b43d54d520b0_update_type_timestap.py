"""update type timestap

Revision ID: b43d54d520b0
Revises: 86c148224ad4
Create Date: 2025-05-03 03:55:04.126412

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'b43d54d520b0'
down_revision = '86c148224ad4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('attendance', schema=None) as batch_op:
        batch_op.alter_column('time_in',
               existing_type=postgresql.TIMESTAMP(),
               type_=sa.Time(),
               existing_nullable=False)
        batch_op.alter_column('time_out',
               existing_type=postgresql.TIMESTAMP(),
               type_=sa.Time(),
               existing_nullable=False)
        batch_op.alter_column('note',
               existing_type=sa.VARCHAR(length=50),
               type_=sa.VARCHAR(length=200),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('attendance', schema=None) as batch_op:
        batch_op.alter_column('note',
               existing_type=sa.VARCHAR(length=200),
               type_=sa.VARCHAR(length=50),
               existing_nullable=False)
        batch_op.alter_column('time_out',
               existing_type=sa.Time(),
               type_=postgresql.TIMESTAMP(),
               existing_nullable=False)
        batch_op.alter_column('time_in',
               existing_type=sa.Time(),
               type_=postgresql.TIMESTAMP(),
               existing_nullable=False)

    # ### end Alembic commands ###
