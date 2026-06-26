from sqlalchemy import Column, Integer

from core.database import Base


class Saldo(Base):
    __tablename__ = "saldo"

    id = Column(Integer, primary_key=True, index=True)
    valor = Column(Integer, nullable=False)
