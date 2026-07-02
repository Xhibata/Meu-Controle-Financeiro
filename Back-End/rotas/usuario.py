from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_banco

from repo.repositories_usuarios import UsuarioRepository
from services.usuario_services import UsuarioService

from schemas import UsuarioResponse

roteador = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"],
)


# GET - Listar usuários
@roteador.get("", response_model=list[UsuarioResponse])
def listar_usuarios(db: Session = Depends(get_banco)):
    repository = UsuarioRepository(db)
    service = UsuarioService(repository)

    return service.listar_usuarios()


@roteador.get("/{usuario_id}", response_model=UsuarioResponse)
def listar_usuario_unico(usuario_id: int, db: Session = Depends(get_banco)):
    repository = UsuarioRepository(db)
    service = UsuarioService(repository)

    return service.buscar_usuario(usuario_id)
