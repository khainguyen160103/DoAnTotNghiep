from sqlalchemy.orm import relationship, mapped_column, Mapped
from sqlalchemy import VARCHAR

from app.extencions import db

class Position(db.Model):
    __tablename__ = "position"
    id: Mapped[str] = mapped_column(VARCHAR(10), primary_key=True)
    name: Mapped[str] = mapped_column(VARCHAR(50),nullable=False)

    # relationship many to one with employee
    employee = relationship("Employee", back_populates="position")