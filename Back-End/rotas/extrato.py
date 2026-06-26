from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from core.auth import obter_usuario_logado
from core.database import get_banco
from models.extrato import Extrato

roteador = APIRouter(
    prefix="/extrato",
    tags=["extrato"]
)


class ExtratoCreate(BaseModel):
    nome: str
    valor: int
    tipo: str | None = None


@roteador.post("", status_code=201)
def criar_extrato(dados: ExtratoCreate, db: Session = Depends(get_banco), usuario=Depends(obter_usuario_logado)):
    registro = Extrato(
        nome=dados.nome,
        valor=dados.valor,
        tipo=dados.tipo,
    )
    db.add(registro)
    db.commit()
    db.refresh(registro)
    return registro


@roteador.get("")
def listar_extrato(db: Session = Depends(get_banco), usuario=Depends(obter_usuario_logado)):
    return db.query(Extrato).all()


@roteador.get("/{extrato_id}")
def obter_extrato(extrato_id: int, db: Session = Depends(get_banco), usuario=Depends(obter_usuario_logado)):
    registro = db.query(Extrato).filter(Extrato.id == extrato_id).first()
    if not registro:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    return registro


@roteador.delete("/{extrato_id}", status_code=204)
def remover_extrato(extrato_id: int, db: Session = Depends(get_banco), usuario=Depends(obter_usuario_logado)):
    registro = db.query(Extrato).filter(Extrato.id == extrato_id).first()
    if not registro:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    db.delete(registro)
    db.commit()
