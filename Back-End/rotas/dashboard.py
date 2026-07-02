from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.auth import obter_usuario_logado
from core.database import get_banco

from services import DashboardService
from schemas import DashboardResponse, DashboardExtratoResponse

roteador = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@roteador.get(
    "",
    response_model=DashboardResponse,
)
def dashboard(
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):

    service = DashboardService(db)

    return service.resumo(usuario.id)


@roteador.get(
    "/extrato",
    response_model=list[DashboardExtratoResponse],
)
def dashboard_extrato(
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):

    service = DashboardService(db)

    return service.extrato(usuario.id)
