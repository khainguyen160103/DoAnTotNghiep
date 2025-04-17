from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import VARCHAR, VARCHAR, DECIMAL, DATE, Integer
from datetime import date

from app.extencions import db

class Deducation(db.Model): 
    __tablename__ = 'deducation'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    type_deducation: Mapped[str] = mapped_column(VARCHAR, nullable=False , unique=True)
    name_deducation: Mapped[str] = mapped_column(VARCHAR, nullable=False)
    money:Mapped[float] = mapped_column(DECIMAL,nullable=False)
    date_deducation: Mapped[date] = mapped_column(DATE,nullable=False)
    money:Mapped[float] = mapped_column(DECIMAL,nullable=False)

    # relationship 
    payroll = relationship("Payroll", secondary= "payrollDeducation",back_populates='deducation' )
