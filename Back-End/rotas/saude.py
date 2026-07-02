from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from core.auth import obter_usuario_logado
from core.database import get_banco

roteador = APIRouter(prefix="/projeto", tags=["Saúde do projeto"])


@roteador.get("")
def projeto():
    return {"status": "UP", "servico": "projeto-api"}


@roteador.get("/db")
def projeto_db(db: Session = Depends(get_banco)):
    try:
        db.execute(text("SELECT 1"))

        return {"status": "UP", "banco de dados": "conectado"}
    except Exception as erro:
        return {"status": "DOWN", "banco de dados": "desconectado", "ERRO": str(erro)}


@roteador.get("/me")
def perfil(usuario=Depends(obter_usuario_logado)):
    return {
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email,
    }
