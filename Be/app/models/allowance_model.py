from sqlalchemy.orm import mapped_column , Mapped , relationship
from sqlalchemy import Integer, VARCHAR, DECIMAL

from app.extencions import db

class Allowance(db.Model): 
    __tablename__ = 'allowance'
    id: Mapped[str] = mapped_column(VARCHAR, primary_key=True)
    name: Mapped[str] = mapped_column(VARCHAR(50),nullable=False)
    money: Mapped[float] = mapped_column(DECIMAL,nullable=False)

    # relationship 
    payroll = relationship('Payroll', secondary='payrollAllowance',back_populates='allowance')

