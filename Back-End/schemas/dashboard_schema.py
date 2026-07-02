from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_receitas: int
    total_despesas: int
    saldo: int
    quantidade_receitas: int
    quantidade_despesas: int