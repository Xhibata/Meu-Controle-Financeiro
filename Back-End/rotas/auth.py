from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from repo.usuario_repositories import UsuarioRepository
from services.usuario_services import UsuarioService

from core.database import get_banco
from schemas import (
    LoginRequest,
    UsuarioCreate,
    UsuarioResponse,
    TokenResponse,
)

roteador = APIRouter(prefix="/auth", tags=["auth"])


@roteador.post("/login", response_model=TokenResponse)
def login(dados: LoginRequest, db: Session = Depends(get_banco)):
    repository = UsuarioRepository(db)
    service = UsuarioService(repository)

    return service.autenticar_usuario(dados.email, dados.senha)


@roteador.post("/registro", status_code=201, response_model=UsuarioResponse)
def registro(dados: UsuarioCreate, db: Session = Depends(get_banco)):
    repository = UsuarioRepository(db)
    service = UsuarioService(repository)

    return service.criar_usuario(dados)
