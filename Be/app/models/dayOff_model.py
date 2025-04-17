from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, VARCHAR, VARCHAR, BOOLEAN,ForeignKey

from app.extencions import db

class DayOff(db.Model):
    __tablename__ = "dayOff"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    DayOff_number: Mapped[int] = mapped_column(Integer, nullable=False)
    DayOff_year: Mapped[int] = mapped_column(Integer, nullable=False)
    DayOff_month: Mapped[int] = mapped_column(Integer, nullable=False)
    DayOff_use: Mapped[bool] = mapped_column(BOOLEAN, nullable=False)

    # foreign key with employee
    employee_id: Mapped[str] = mapped_column(VARCHAR(10), ForeignKey('employee.id'))
    
    # relationship one to many with employee
    employee = relationship("Employee", back_populates="dayOff")