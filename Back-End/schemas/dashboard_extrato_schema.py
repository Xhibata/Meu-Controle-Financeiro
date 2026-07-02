from datetime import date

from pydantic import BaseModel


class DashboardExtratoResponse(BaseModel):
    tipo: str
    descricao: str
    valor: int
    data: date

    class Config:
        from_attributes = True
