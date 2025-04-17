from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, ForeignKey, VARCHAR, DateTime, DATE
from datetime import datetime, date

from app.extencions import db

class Attendance(db.Model):
    __tablename__ = "attendance"
    id: Mapped[int] = mapped_column(Integer, primary_key=True,autoincrement=True)
    attendance_date: Mapped[date] = mapped_column(DATE,nullable=False)
    time_in: Mapped[datetime] = mapped_column(DateTime,nullable=False)
    time_out: Mapped[datetime] = mapped_column(DateTime,nullable=False)
    status_attendance: Mapped[str] = mapped_column(VARCHAR(10),nullable=False)
    total_overtime: Mapped[int] = mapped_column(Integer,nullable=False)
    late_in: Mapped[int] = mapped_column(Integer,nullable=False)
    early_out: Mapped[int] = mapped_column(Integer,nullable=False)
    note: Mapped[str] = mapped_column(VARCHAR(50),nullable=False)

    # foreign key
    employee_id: Mapped[str] = mapped_column(VARCHAR(10), ForeignKey('employee.id'))
    attendance_status_id = mapped_column(Integer , ForeignKey('attendanceStatus.id'))

    
    # relationship 
    employee = relationship("Employee", back_populates="attendance")
    attendance_status = relationship("AttendanceStatus" , back_populates="attendance")
    