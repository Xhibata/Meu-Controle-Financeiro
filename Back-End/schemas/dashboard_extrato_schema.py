from datetime import date

from pydantic import BaseModel


class DashboardExtratoResponse(BaseModel):
    id: int
    tipo: str
    descricao: str
    valor: int
    data: date

    class Config:
        from_attributes = True
