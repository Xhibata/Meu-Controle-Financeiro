from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship

from core.database import Base


class Despesa(Base):
    __tablename__ = "despesa"

    id = Column(Integer, primary_key=True, index=True)

    usuario_id = Column(
        Integer,
        ForeignKey("usuario.id"),
        nullable=False,
    )

    descricao = Column(
        String(255),
        nullable=False,
    )

    valor = Column(
        Integer,
        nullable=False,
    )

    data = Column(Date)

    usuario = relationship(
        "Usuario",
        back_populates="despesas",
    )
