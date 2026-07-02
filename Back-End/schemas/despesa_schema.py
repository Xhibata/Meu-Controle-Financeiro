from datetime import date

from pydantic import BaseModel


class DespesaCreate(BaseModel):
    descricao: str
    valor: int
    data: date | None = None


class DespesaUpdate(BaseModel):
    descricao: str
    valor: int
    data: date | None = None


class DespesaResponse(BaseModel):
    id: int
    descricao: str
    valor: int
    data: date | None

    class Config:
        from_attributes = True