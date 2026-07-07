from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.auth import obter_usuario_logado
from core.database import get_banco

from repo import DespesaRepository
from services import DespesaService
from schemas import (
    DespesaCreate,
    DespesaUpdate,
    DespesaResponse,
)

roteador = APIRouter(
    prefix="/despesas",
    tags=["Despesas"],
)


@roteador.post(
    "",
    status_code=201,
    response_model=DespesaResponse,
    include_in_schema=False,
)
def criar_despesa(
    dados: DespesaCreate,
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):
    repository = DespesaRepository(db)
    service = DespesaService(repository)

    return service.criar_despesa(
        dados,
        usuario.id,
    )


@roteador.get(
    "",
    response_model=list[DespesaResponse],
    include_in_schema=False,
)
def listar_despesas(
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):
    repository = DespesaRepository(db)
    service = DespesaService(repository)

    return service.listar_despesas(usuario.id)


@roteador.get(
    "/{despesa_id}",
    response_model=DespesaResponse,
    include_in_schema=False,
)
def obter_despesa(
    despesa_id: int,
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):
    repository = DespesaRepository(db)
    service = DespesaService(repository)

    return service.buscar_despesa(despesa_id)


@roteador.put(
    "/{despesa_id}",
    response_model=DespesaResponse,
    include_in_schema=False,
)
def editar_despesa(
    despesa_id: int,
    dados: DespesaUpdate,
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):
    repository = DespesaRepository(db)
    service = DespesaService(repository)

    return service.editar_despesa(
        despesa_id,
        dados,
    )


@roteador.delete("/{despesa_id}", include_in_schema=False)
def remover_despesa(
    despesa_id: int,
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):
    repository = DespesaRepository(db)
    service = DespesaService(repository)

    return service.remover_despesa(despesa_id)
