from app.extencions import db
from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped
class PayrollDeducation(db.Model): 
    __tablename__= 'payrollDeducation'
    id: Mapped[int] = mapped_column(Integer,primary_key=True,autoincrement=True)
    payroll_id:Mapped[int] = mapped_column(Integer, ForeignKey('payroll.id'))
    deducation_id:Mapped[int] = mapped_column(Integer,ForeignKey('deducation.id'))
    