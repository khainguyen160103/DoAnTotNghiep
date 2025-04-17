from sqlalchemy.orm import Mapped, mapped_column, relationship 
from sqlalchemy import Integer, ForeignKey, VARCHAR, DateTime, DATE
from datetime import datetime, date

from app.extencions import db

class letterLeave(db.Model):
    __tablename__ = "letterLeave"
    id: Mapped[str] = mapped_column(VARCHAR, primary_key=True)
    create_at: Mapped[datetime] = mapped_column(DateTime,nullable=False)
    title: Mapped[str] = mapped_column(VARCHAR,nullable=False)
    request_date: Mapped[date] = mapped_column(DATE,nullable=False)
    start_at: Mapped[datetime] = mapped_column(DateTime,nullable=False)
    end_at: Mapped[datetime] = mapped_column(DateTime,nullable=False)
    note: Mapped[str] = mapped_column(VARCHAR(50),nullable=False)
    
    # foreign key
    employee_id: Mapped[str] = mapped_column(VARCHAR(10), ForeignKey('employee.id'))    
    letter_status_id: Mapped[int] = mapped_column(Integer, ForeignKey('letterStatus.id'))

    # relationship
    letter_status= relationship("LetterStatus", back_populates="letter_leave")
    employee  = relationship("Employee", back_populates="letterLeave")