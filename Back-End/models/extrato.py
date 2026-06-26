from sqlalchemy import Column, Integer, String, Date, func

from app.database import Base


class Extrato(Base):
    __tablename__ = "extrato"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    valor = Column(Integer, nullable=False)
    data = Column(Date, server_default=func.now(), nullable=True)
    tipo = Column(String(255), nullable=True)