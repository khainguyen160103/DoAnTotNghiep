from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, ForeignKey, VARCHAR, DateTime, DATE, Time
from datetime import datetime, date, time

from app.extencions import db

class Attendance(db.Model):
    __tablename__ = "attendance"
    id: Mapped[str] = mapped_column(VARCHAR, primary_key=True)
    attendance_date: Mapped[date] = mapped_column(DATE,nullable=False)
    time_in: Mapped[time] = mapped_column(Time)
    time_out: Mapped[time] = mapped_column(Time)
    total_overtime: Mapped[int] = mapped_column(Integer,nullable=True)
    note: Mapped[str] = mapped_column(VARCHAR(200),)

    # foreign key
    employee_id: Mapped[str] = mapped_column(VARCHAR(10), ForeignKey('employee.id'))
    attendance_status_id = mapped_column(Integer , ForeignKey('attendanceStatus.id'),nullable=True)

    
    # relationship 
    employee = relationship("Employee", back_populates="attendance")
    attendance_status = relationship("AttendanceStatus" , back_populates="attendance")
    