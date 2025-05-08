from __future__ import annotations
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import VARCHAR, Integer, DateTime, ForeignKey, BOOLEAN
from datetime import datetime, timezone

from app.extencions import db
import pytz

hanoi_timezone = pytz.timezone('Asia/Ho_Chi_Minh')
class Account(db.Model):
    __tablename__ = "account"
    id: Mapped[int] = mapped_column(VARCHAR(10),ForeignKey('employee.id') , primary_key=True,nullable=False)
    username: Mapped[str] = mapped_column(VARCHAR(50), unique=True)
    password: Mapped[str] = mapped_column(VARCHAR(255), nullable=False)
    isActived: Mapped[bool] = mapped_column(BOOLEAN,default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(hanoi_timezone))  # Added timezone=True

    # foreign key with role
    role_id: Mapped[int] = mapped_column(Integer, ForeignKey('role.id'),default=3)
    # relationship
    role = relationship('Role', back_populates="account")
    employee = relationship('Employee', back_populates="account", uselist=False)