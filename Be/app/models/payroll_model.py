from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  Integer, ForeignKey, DATE, DECIMAL, VARCHAR
from datetime import  date

from app.extencions import db

class Payroll(db.Model): 
    __tablename__ = "payroll"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    moth: Mapped[date] = mapped_column(DATE, nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    total_attendance: Mapped[int] = mapped_column(Integer, nullable=False)
    base_salary: Mapped[float] = mapped_column(DECIMAL, nullable=False)
    salary_ot: Mapped[float] = mapped_column(DECIMAL, nullable=False)
    salary_addOn: Mapped[float] = mapped_column(DECIMAL, nullable=False)
    salary_another: Mapped[float] = mapped_column(DECIMAL, nullable=False)
    salary_total: Mapped[float] = mapped_column(DECIMAL, nullable=False)

    # foreign key 
    employee_id = mapped_column(VARCHAR(10) , ForeignKey('employee.id'))

    # relationship
    employee = relationship("Employee" , back_populates='payroll')
    deducation = relationship("Deducation",secondary="payrollDeducation",back_populates="payroll")
    allowance = relationship("Allowance",secondary="payrollAllowance",back_populates="payroll")





    