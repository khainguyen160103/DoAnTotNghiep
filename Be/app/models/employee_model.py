from sqlalchemy.orm import relationship, mapped_column, Mapped
from sqlalchemy import VARCHAR, ForeignKey

from app.extencions import db

class Employee(db.Model):
    __tablename__ = "employee"
    id: Mapped[str] = mapped_column(VARCHAR(10), primary_key=True)
    fullname: Mapped[str] = mapped_column(VARCHAR(50),nullable=False)
    email: Mapped[str] = mapped_column(VARCHAR(50),nullable=False)
    employee_type:Mapped[str] = mapped_column(VARCHAR(50),nullable=False,default="onboarded")
    work_status: Mapped[str] = mapped_column(VARCHAR(50),nullable=False,default="active")

    # foreign key with position
    position_id:Mapped[str] = mapped_column(VARCHAR(10), ForeignKey('position.id'))

    # relationship 
    payroll = relationship("Payroll", back_populates="employee")
    position = relationship("Position", back_populates="employee")
    account = relationship("Account", uselist = False, back_populates="employee")
    dayOff = relationship("DayOff", back_populates="employee")
    letterLeave = relationship("letterLeave", back_populates="employee")
    letterOvertime = relationship("letterOvertime", back_populates="employee")
    letterVertification = relationship("letterVertification", back_populates="employee")
    attendance = relationship("Attendance", back_populates="employee")