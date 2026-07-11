from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from core.database import Base, motor
from rotas import (
    auth_router,
    usuario_router,
    despesas_router,
    extrato_router,
    saude_router,
    dashboard_router,
)

app = FastAPI(title="API Financeiro", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(saude_router)
app.include_router(extrato_router)
app.include_router(usuario_router)
app.include_router(despesas_router)
app.include_router(dashboard_router)

Base.metadata.create_all(bind=motor)


@app.get("/")
def home():
    return {"mensagem": "API funcionando!"}


app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
