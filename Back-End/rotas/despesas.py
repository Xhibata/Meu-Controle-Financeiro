from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from core.auth import obter_usuario_logado
from core.database import get_banco
from models.despesa import Despesa

roteador = APIRouter(
    prefix="/despesas",
    tags=["despesas"]
)


class DespesaCreate(BaseModel):
    despesa: str
    valor: int
    data: str | None = None


@roteador.post("", status_code=201)
def criar_despesa(dados: DespesaCreate, db: Session = Depends(get_banco), usuario=Depends(obter_usuario_logado)):
    despesa = Despesa(
        despesa=dados.despesa,
        valor=dados.valor,
        data=dados.data,
    )
    db.add(despesa)
    db.commit()
    db.refresh(despesa)
    return despesa


@roteador.get("")
def listar_despesas(db: Session = Depends(get_banco), usuario=Depends(obter_usuario_logado)):
    return db.query(Despesa).all()


@roteador.get("/{despesa_id}")
def obter_despesa(despesa_id: int, db: Session = Depends(get_banco), usuario=Depends(obter_usuario_logado)):
    despesa = db.query(Despesa).filter(Despesa.id == despesa_id).first()
    if not despesa:
        raise HTTPException(status_code=404, detail="Despesa não encontrada")
    return despesa


@roteador.delete("/{despesa_id}", status_code=204)
def remover_despesa(despesa_id: int, db: Session = Depends(get_banco), usuario=Depends(obter_usuario_logado)):
    despesa = db.query(Despesa).filter(Despesa.id == despesa_id).first()
    if not despesa:
        raise HTTPException(status_code=404, detail="Despesa não encontrada")
    db.delete(despesa)
    db.commit()
