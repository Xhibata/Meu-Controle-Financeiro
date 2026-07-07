from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.auth import obter_usuario_logado
from core.database import get_banco

from repo import ExtratoRepository
from services import ExtratoService
from schemas import (
    ExtratoCreate,
    ExtratoUpdate,
    ExtratoResponse,
)

roteador = APIRouter(
    prefix="/extrato",
    tags=["Extrato"],
)


@roteador.post(
    "",
    status_code=201,
    response_model=ExtratoResponse,
)
def criar_extrato(
    dados: ExtratoCreate,
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):
    repository = ExtratoRepository(db)
    service = ExtratoService(repository)

    return service.criar_extrato(
        dados,
        usuario.id,
    )


@roteador.get(
    "",
    response_model=list[ExtratoResponse],
)
def listar_extratos(
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):
    repository = ExtratoRepository(db)
    service = ExtratoService(repository)

    return service.listar_extratos(usuario.id)


@roteador.get(
    "/{extrato_id}",
    response_model=ExtratoResponse,
)
def buscar_extrato(
    extrato_id: int,
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):
    repository = ExtratoRepository(db)
    service = ExtratoService(repository)

    return service.buscar_extrato(extrato_id)


@roteador.put(
    "/{extrato_id}",
    response_model=ExtratoResponse,
)
def editar_extrato(
    extrato_id: int,
    dados: ExtratoUpdate,
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):
    repository = ExtratoRepository(db)
    service = ExtratoService(repository)

    return service.editar_extrato(
        extrato_id,
        dados,
    )


@roteador.delete(
    "",
    status_code=204,
)
def limpar_todos_extratos(
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):
    repository = ExtratoRepository(db)
    service = ExtratoService(repository)

    return service.limpar_extrato(usuario.id)


@roteador.delete(
    "/{extrato_id}",
    status_code=204,
)
def remover_extrato(
    extrato_id: int,
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):
    repository = ExtratoRepository(db)
    service = ExtratoService(repository)

    service.remover_extrato(extrato_id)
