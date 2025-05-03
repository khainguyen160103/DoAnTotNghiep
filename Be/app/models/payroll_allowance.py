from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.extencions import db 

class PayrollAllowance(db.Model): 
    __tablename__ = "payrollAllowance"
    id:Mapped[int] = mapped_column(Integer , primary_key=True, autoincrement=True)
    payroll_id:Mapped[int] = mapped_column(Integer, ForeignKey('payroll.id'))
    allowance_id:Mapped[int] = mapped_column(Integer,ForeignKey('allowance.id'))