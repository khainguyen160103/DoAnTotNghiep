from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import VARCHAR, Integer

from app.extencions import db

class Role(db.Model):
    __tablename__ = "role"
    id: Mapped[int] = mapped_column(Integer,primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(VARCHAR(50), unique=True)
    
    # relationship many to one with account
    account = relationship("Account", back_populates="role")