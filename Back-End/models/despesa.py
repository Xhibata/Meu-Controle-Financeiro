from sqlalchemy import Column, Integer, String, Date

from app.database import Base


class Despesa(Base):
    __tablename__ = "despesa"

    id = Column(Integer, primary_key=True, index=True)
    despesa = Column(String(255), nullable=False)
    valor = Column(Integer, nullable=False)
    data = Column(Date, nullable=True)