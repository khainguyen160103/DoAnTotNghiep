"""empty message

Revision ID: b5c734ee4815
Revises: b56562c9e236
Create Date: 2025-05-01 13:57:31.952985

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b5c734ee4815'
down_revision = 'b56562c9e236'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('letterVertification', schema=None) as batch_op:
        batch_op.alter_column('note',
               existing_type=sa.VARCHAR(length=50),
               type_=sa.VARCHAR(length=500),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('letterVertification', schema=None) as batch_op:
        batch_op.alter_column('note',
               existing_type=sa.VARCHAR(length=500),
               type_=sa.VARCHAR(length=50),
               existing_nullable=False)

    # ### end Alembic commands ###
