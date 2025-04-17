from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import VARCHAR, Integer, ForeignKey

from app.extencions import db

class letterOvertime(db.Model):
    __tablename__ = "letterOvertime"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    create_at: Mapped[str] = mapped_column(VARCHAR(50),nullable=False)
    title: Mapped[str] = mapped_column(VARCHAR(50),nullable=False)
    request_date: Mapped[str] = mapped_column(VARCHAR(50),nullable=False)
    start_at: Mapped[str] = mapped_column(VARCHAR(50),nullable=False)
    end_at: Mapped[str] = mapped_column(VARCHAR(50),nullable=False)
    note: Mapped[str] = mapped_column(VARCHAR(50),nullable=False)

    # foreign key 
    employee_id: Mapped[str] = mapped_column(VARCHAR(10), ForeignKey('employee.id'))
    letter_status_id: Mapped[int] = mapped_column(Integer, ForeignKey('letterStatus.id'))
    type_date_ot_id: Mapped[int] = mapped_column(Integer , ForeignKey('typeDate.id'))
    
    # relationship
    letter_status = relationship("LetterStatus", back_populates="letter_overtime")
    employee = relationship("Employee", back_populates="letterOvertime")
    type_date = relationship("TypeDate" , back_populates='letter_overtime')