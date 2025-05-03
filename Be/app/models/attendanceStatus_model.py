from sqlalchemy.orm import  mapped_column, Mapped, relationship
from sqlalchemy import  Integer, VARCHAR

from app.extencions import db

class AttendanceStatus(db.Model):
    __tablename__ = 'attendanceStatus'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(VARCHAR(50), nullable=False)
    
    # relationship 
    attendance = relationship("Attendance", back_populates="attendance_status")