from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from core.database import Base


class Receita(Base):

    __tablename__ = "receita"

    id = Column(Integer, primary_key=True)

    usuario_id = Column(
        Integer,
        ForeignKey("usuario.id"),
        nullable=False
    )

    descricao = Column(String(255), nullable=False)
    valor = Column(Integer, nullable=False)

    data = Column(
        Date,
        server_default=func.now()
    )

    usuario = relationship(
        "Usuario",
        back_populates="receitas"
    )