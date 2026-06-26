from sqlalchemy import Column, Integer

from app.database import Base


class Saldo(Base):
    __tablename__ = "saldo"

    id = Column(Integer, primary_key=True, index=True)
    valor = Column(Integer, nullable=False)