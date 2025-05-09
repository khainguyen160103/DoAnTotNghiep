from app.extencions import db
from sqlalchemy import Integer, ForeignKey , VARCHAR, DATE
from sqlalchemy.orm import mapped_column, Mapped
from datetime import date

class PayrollDeducation(db.Model): 
    __tablename__= 'payrollDeducation'
    id: Mapped[str] = mapped_column(VARCHAR,primary_key=True)
    payroll_id:Mapped[str] = mapped_column(VARCHAR, ForeignKey('payroll.id'))
    deducation_id:Mapped[str] = mapped_column(VARCHAR,ForeignKey('deducation.id'))
    attendance_date:Mapped[date] = mapped_column(DATE)