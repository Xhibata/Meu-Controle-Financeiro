from fastapi import FastAPI

from core.database import Base, engine
from models.despesa import Despesa
from models.extrato import Extrato
from models.saldo import Saldo
from models.usuario import Usuario
from rotas.auth import roteador as auth_router
from rotas.saude import roteador as saude_router
from rotas.despesas import roteador as despesas_router
from rotas.extrato import roteador as extrato_router
from rotas.saldo import roteador as saldo_router

app = FastAPI(
    title="API Financeiro",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(saude_router)
app.include_router(despesas_router)
app.include_router(extrato_router)
app.include_router(saldo_router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"mensagem": "API funcionando!"}
