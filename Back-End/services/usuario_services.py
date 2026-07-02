from fastapi import HTTPException

from core.jwt import criar_token
from core.seguranca import gerar_hash, verificar_senha

from models import Usuario
from repo import UsuarioRepository
from schemas import UsuarioCreate


class UsuarioService:
    def __init__(self, repository: UsuarioRepository):
        self.repository = repository

    def criar_usuario(self, dados: UsuarioCreate):

        usuario_existe = self.repository.get_by_email(dados.email)

        if usuario_existe:
            raise HTTPException(status_code=400, detail="Usuário já cadastrado")

        usuario = Usuario(
            nome=dados.nome, email=dados.email, senha=gerar_hash(dados.senha)
        )

        return self.repository.create(usuario)

    def listar_usuarios(self):
        return self.repository.get_all()

    def buscar_usuario(self, usuario_id: int):

        usuario = self.repository.get_by_id(usuario_id)

        if not usuario:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        return usuario

    def autenticar_usuario(self, email: str, senha: str):

        usuario = self.repository.get_by_email(email)

        if not usuario:
            raise HTTPException(status_code=401, detail="Credenciais inválidas")

        if not verificar_senha(senha, usuario.senha):
            raise HTTPException(status_code=401, detail="Credenciais inválidas")

        token = criar_token({"sub": str(usuario.id), "email": usuario.email})

        return {"access_token": token, "token_type": "bearer"}
