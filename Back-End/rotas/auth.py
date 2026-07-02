from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from repo.repositories_usuarios import UsuarioRepository
from services.usuario_services import UsuarioService

from core.database import get_banco
from schemas.login_schema import LoginRequest, CadastroRequest

roteador = APIRouter(prefix="/auth", tags=["auth"])


@roteador.post("/login")
def login(dados: LoginRequest, db: Session = Depends(get_banco)):
    repository = UsuarioRepository(db)
    service = UsuarioService(repository)

    return service.autenticar_usuario(dados.email, dados.senha)


@roteador.post("/registro", status_code=201)
def registro(dados: CadastroRequest, db: Session = Depends(get_banco)):
    repository = UsuarioRepository(db)
    service = UsuarioService(repository)

    return service.criar_usuario(dados)
