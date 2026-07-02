from sqlalchemy import Column, Integer, String, Date, func, ForeignKey

from core.database import Base


class Extrato(Base):
    __tablename__ = "extrato"

    id = Column(Integer, primary_key=True)

    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)

    descricao = Column(String(255))

    valor = Column(Integer)

    tipo = Column(String(20))

    data = Column(Date, server_default=func.now())
