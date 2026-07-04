from fastapi import HTTPException
from repo import DespesaRepository
from schemas import DespesaCreate, DespesaUpdate

from models import Despesa

class DespesaService:
    def __init__(self, repository: DespesaRepository):
        self.repository = repository

    def criar_despesa(
        self,
        dados: DespesaCreate,
        usuario_id: int,
    ):

        saldo = self.repository.calcular_saldo(usuario_id)

        if dados.valor > saldo:
            raise HTTPException(
                status_code=400,
                detail={
                    "mensagem": "Saldo insuficiente.",
                    "saldo_disponivel": saldo,
                    "valor_despesa": dados.valor,
                    "faltam": dados.valor - saldo,
                },
            )

        despesa = Despesa(
            usuario_id=usuario_id,
            descricao=dados.descricao,
            valor=dados.valor,
            data=dados.data,
        )

        return self.repository.create(despesa)

    def listar_despesas(self, usuario_id: int):

        return self.repository.get_by_usuario(usuario_id)

    def buscar_despesa(self, despesa_id: int):

        despesa = self.repository.get_by_id(despesa_id)

        if not despesa:
            raise HTTPException(
                status_code=404,
                detail="Despesa não encontrada",
            )

        return despesa

    def editar_despesa(
        self,
        despesa_id: int,
        dados: DespesaUpdate,
    ):

        despesa = self.repository.get_by_id(despesa_id)

        if not despesa:
            raise HTTPException(
                status_code=404,
                detail="Despesa não encontrada",
            )

        despesa.descricao = dados.descricao
        despesa.valor = dados.valor
        despesa.data = dados.data

        self.repository.update()

        return despesa

    def remover_despesa(self, despesa_id: int):

        despesa = self.repository.get_by_id(despesa_id)

        if not despesa:
            raise HTTPException(
                status_code=404,
                detail="Despesa não encontrada",
            )

        self.repository.delete(despesa)

        return {"message": "Despesa removida com sucesso"}
