from .auth import roteador as auth_router
from .usuario import roteador as usuario_router
from .despesas import roteador as despesas_router
from .extrato import roteador as extrato_router
from .saude import roteador as saude_router
from .dashboard import roteador as dashboard_router

__all__ = [
    "auth_router",
    "usuario_router",
    "despesas_router",
    "extrato_router",
    "saude_router",
    "dashboard_router",
]
