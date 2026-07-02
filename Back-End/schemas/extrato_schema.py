from datetime import date

from pydantic import BaseModel


class ExtratoCreate(BaseModel):
    descricao: str
    valor: int
    tipo: str
    data: date | None = None


class ExtratoUpdate(BaseModel):
    descricao: str
    valor: int
    tipo: str
    data: date | None = None


class ExtratoResponse(BaseModel):
    id: int
    descricao: str
    valor: int
    tipo: str
    data: date | None

    class Config:
        from_attributes = True