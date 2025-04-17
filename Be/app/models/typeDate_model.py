from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import Integer, VARCHAR

from app.extencions import db

class TypeDate(db.Model): 
    __tablename__= "typeDate"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(VARCHAR, nullable=False)

    # relationsip
    letter_overtime = relationship("letterOvertime", back_populates="type_date")
    