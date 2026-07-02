from .auth import roteador as auth_router
from .usuario import roteador as usuario_router
from .despesas import roteador as despesas_router
from .extrato import roteador as extrato_router
from .saldo import roteador as saldo_router
from .saude import roteador as saude_router

__all__ = [
    "auth_router",
    "usuario_router",
    "despesas_router",
    "extrato_router",
    "saldo_router",
    "saude_router",
]
