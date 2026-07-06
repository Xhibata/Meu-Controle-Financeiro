from datetime import date

from sqlalchemy import func

from models import Despesa, Extrato


class DashboardService:
    def __init__(self, db):
        self.db = db

    def resumo(self, usuario_id: int):

        total_receitas = (
            self.db.query(func.coalesce(func.sum(Extrato.valor), 0))
            .filter(Extrato.usuario_id == usuario_id)
            .scalar()
        )

        total_despesas = (
            self.db.query(func.coalesce(func.sum(Despesa.valor), 0))
            .filter(Despesa.usuario_id == usuario_id)
            .scalar()
        )

        quantidade_receitas = (
            self.db.query(Extrato).filter(Extrato.usuario_id == usuario_id).count()
        )

        quantidade_despesas = (
            self.db.query(Despesa).filter(Despesa.usuario_id == usuario_id).count()
        )

        return {
            "total_receitas": total_receitas,
            "total_despesas": total_despesas,
            "saldo": total_receitas - total_despesas,
            "quantidade_receitas": quantidade_receitas,
            "quantidade_despesas": quantidade_despesas,
        }

    def extrato(self, usuario_id: int):

        receitas = self.db.query(Extrato).filter(Extrato.usuario_id == usuario_id).all()

        despesas = self.db.query(Despesa).filter(Despesa.usuario_id == usuario_id).all()

        movimentos = []

        for receita in receitas:
            movimentos.append(
                {
                    "tipo": "Receita",
                    "descricao": receita.descricao,
                    "valor": receita.valor,
                    "data": receita.data,
                }
            )

        for despesa in despesas:
            movimentos.append(
                {
                    "tipo": "Despesa",
                    "descricao": despesa.descricao,
                    "valor": despesa.valor,
                    "data": despesa.data,
                }
            )

        movimentos.sort(
            key=lambda x: x.get("data") or date.min,
            reverse=True,
        )

        return movimentos
