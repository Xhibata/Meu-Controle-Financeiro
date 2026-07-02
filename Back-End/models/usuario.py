from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from core.database import Base


class Usuario(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    senha = Column(String(255), nullable=False)

    despesas = relationship(
        "Despesa", back_populates="usuario", cascade="all, delete-orphan"
    )

    receitas = relationship(
        "Receita", back_populates="usuario", cascade="all, delete-orphan"
    )

    extratos = relationship("Extrato", back_populates="usuario")
