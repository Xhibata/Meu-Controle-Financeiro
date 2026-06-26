from sqlalchemy import Column, Integer, String

from core.database import Base


class Usuario(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    senha = Column(String(255), nullable=True)
