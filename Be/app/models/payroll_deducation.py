from app.extencions import db
from sqlalchemy import Integer, ForeignKey , VARCHAR
from sqlalchemy.orm import mapped_column, Mapped
class PayrollDeducation(db.Model): 
    __tablename__= 'payrollDeducation'
    id: Mapped[str] = mapped_column(VARCHAR,primary_key=True)
    payroll_id:Mapped[str] = mapped_column(VARCHAR, ForeignKey('payroll.id'))
    deducation_id:Mapped[str] = mapped_column(VARCHAR,ForeignKey('deducation.id'))
    