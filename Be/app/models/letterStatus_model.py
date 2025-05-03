from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import VARCHAR, Integer

from app.extencions import db


class LetterStatus(db.Model):
    __tablename__ = "letterStatus"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name:Mapped[str] = mapped_column(VARCHAR(50),nullable=False)
    # relationship one to many with letter

    letter_overtime = relationship("letterOvertime", back_populates="letter_status")
    letter_leave = relationship("letterLeave", back_populates='letter_status')
    letter_vertification = relationship("letterVertification", back_populates='letter_status')