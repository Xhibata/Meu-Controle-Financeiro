from fastapi import HTTPException

from models import Extrato
from repo import ExtratoRepository
from schemas import ExtratoCreate, ExtratoUpdate


class ExtratoService:
    def __init__(self, repository: ExtratoRepository):
        self.repository = repository

    def criar_extrato(
        self,
        dados: ExtratoCreate,
        usuario_id: int,
    ):

        extrato = Extrato(
            usuario_id=usuario_id,
            descricao=dados.descricao,
            valor=dados.valor,
            tipo=dados.tipo,
        )

        return self.repository.create(extrato)

    def listar_extratos(
        self,
        usuario_id: int,
    ):
        return self.repository.get_by_usuario(usuario_id)

    def buscar_extrato(
        self,
        extrato_id: int,
    ):

        extrato = self.repository.get_by_id(extrato_id)

        if not extrato:
            raise HTTPException(
                status_code=404,
                detail="Extrato não encontrado",
            )

        return extrato

    def editar_extrato(
        self,
        extrato_id: int,
        dados: ExtratoUpdate,
    ):

        extrato = self.repository.get_by_id(extrato_id)

        if not extrato:
            raise HTTPException(
                status_code=404,
                detail="Extrato não encontrado",
            )

        extrato.descricao = dados.descricao
        extrato.valor = dados.valor
        extrato.tipo = dados.tipo

        self.repository.update()

        return extrato

    def remover_extrato(
        self,
        extrato_id: int,
    ):

        extrato = self.repository.get_by_id(extrato_id)

        if not extrato:
            raise HTTPException(
                status_code=404,
                detail="Extrato não encontrado",
            )

        self.repository.delete(extrato)
        return {"Extrato removido com sucesso."}
