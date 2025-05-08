from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import VARCHAR, Integer, ForeignKey, DateTime
from datetime import timezone, datetime
from app.extencions import db
import pytz

hanoi_timezone = pytz.timezone('Asia/Ho_Chi_Minh')
class letterOvertime(db.Model):
    __tablename__ = "letterOvertime"
    id: Mapped[str] = mapped_column(VARCHAR, primary_key=True)
    create_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(hanoi_timezone) )
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