from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from core.auth import obter_usuario_logado
from core.database import get_banco
from models.saldo import Saldo

roteador = APIRouter(prefix="/saldo", tags=["Saldo"])


class SaldoUpdate(BaseModel):
    valor: int


@roteador.post("", status_code=201)
def criar_saldo(
    dados: SaldoUpdate,
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):
    saldo = Saldo(valor=dados.valor)
    db.add(saldo)
    db.commit()
    db.refresh(saldo)
    return saldo


@roteador.get("")
def listar_saldo(
    db: Session = Depends(get_banco), usuario=Depends(obter_usuario_logado)
):
    return db.query(Saldo).all()


@roteador.put("/{saldo_id}")
def atualizar_saldo(
    saldo_id: int,
    dados: SaldoUpdate,
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):
    saldo = db.query(Saldo).filter(Saldo.id == saldo_id).first()
    if not saldo:
        raise HTTPException(status_code=404, detail="Saldo não encontrado")
    saldo.valor = dados.valor
    db.commit()
    db.refresh(saldo)
    return saldo


@roteador.delete("/{saldo_id}", status_code=204)
def remover_saldo(
    saldo_id: int,
    db: Session = Depends(get_banco),
    usuario=Depends(obter_usuario_logado),
):
    saldo = db.query(Saldo).filter(Saldo.id == saldo_id).first()
    if not saldo:
        raise HTTPException(status_code=404, detail="Saldo não encontrado")
    db.delete(saldo)
    db.commit()
