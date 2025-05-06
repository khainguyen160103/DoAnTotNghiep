from sqlalchemy import Integer, ForeignKey , VARCHAR
from sqlalchemy.orm import Mapped, mapped_column

from app.extencions import db 

class PayrollAllowance(db.Model): 
    __tablename__ = "payrollAllowance"
    id:Mapped[str] = mapped_column(VARCHAR , primary_key=True)
    payroll_id:Mapped[str] = mapped_column(VARCHAR, ForeignKey('payroll.id'))
    allowance_id:Mapped[str] = mapped_column(VARCHAR,ForeignKey('allowance.id'))