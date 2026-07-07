from sqlalchemy import func

from models import Extrato


class DashboardService:
    def __init__(self, db):
        self.db = db

    from sqlalchemy import func

    def resumo(self, usuario_id: int):

        total_receitas = (
            self.db.query(func.coalesce(func.sum(Extrato.valor), 0))
            .filter(
                Extrato.usuario_id == usuario_id,
                Extrato.tipo == "E",
            )
            .scalar()
        )

        total_despesas = (
            self.db.query(func.coalesce(func.sum(Extrato.valor), 0))
            .filter(
                Extrato.usuario_id == usuario_id,
                Extrato.tipo == "S",
            )
            .scalar()
        )

        quantidade_receitas = (
            self.db.query(Extrato)
            .filter(
                Extrato.usuario_id == usuario_id,
                Extrato.tipo == "E",
            )
            .count()
        )

        quantidade_despesas = (
            self.db.query(Extrato)
            .filter(
                Extrato.usuario_id == usuario_id,
                Extrato.tipo == "S",
            )
            .count()
        )

        return {
            "total_receitas": total_receitas,
            "total_despesas": total_despesas,
            "saldo": total_receitas - total_despesas,
            "quantidade_receitas": quantidade_receitas,
            "quantidade_despesas": quantidade_despesas,
        }

    def extrato(self, usuario_id: int):

        movimentos = (
            self.db.query(Extrato)
            .filter(Extrato.usuario_id == usuario_id)
            .order_by(Extrato.data.desc())
            .all()
        )

        return [
            {
                "tipo": "Receita" if mov.tipo == "E" else "Despesa",
                "descricao": mov.descricao,
                "valor": mov.valor,
                "data": mov.data,
            }
            for mov in movimentos
        ]
