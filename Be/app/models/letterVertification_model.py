from sqlalchemy.orm import Mapped, mapped_column, relationship 
from sqlalchemy import Integer, ForeignKey,VARCHAR ,DateTime
from datetime import datetime, date, timezone

from app.extencions import db

class letterVertification(db.Model):
    __tablename__ = "letterVertification"
    id: Mapped[int] = mapped_column(VARCHAR, primary_key=True)
    create_at: Mapped[datetime] = mapped_column(DateTime,default=datetime.now(timezone.utc))
    title: Mapped[str] = mapped_column(VARCHAR(50),nullable=False)
    note: Mapped[str] = mapped_column(VARCHAR(500),nullable=False)

    # foreign key
    employee_id: Mapped[str] = mapped_column(VARCHAR(10), ForeignKey('employee.id'))
    letter_status_id: Mapped[int] = mapped_column(Integer, ForeignKey('letterStatus.id'))

    # relationship  
    letter_status= relationship("LetterStatus", back_populates="letter_vertification")
    employee = relationship("Employee", back_populates="letterVertification")