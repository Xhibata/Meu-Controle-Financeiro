from fastapi import HTTPException, status
from models.despesa import Despesa
from repo.repositories_despesa import DespesaRepository

class DespesaService:
    def __init__(self, repository: DespesaRepository):
        self.repository = repository
        
    def criar_despesa(self, dados):
        despesa = Despesa(
            usuario_id=dados.usuario_id,
            descricao=dados.descricao,
            valor=dados.valor
        ) 
        despesa = self.repository.create(despesa)
        return {
            "Mensagem": "Despesa criada com sucesso",
            "objeto": {
                "id": despesa.id,
                "usuario_id": despesa.usuario_id,
                "descricao": despesa.descricao,
                "valor": despesa.valor
            }
        }
    
    def listar_despesas(self):
        lista = self.repository.get_all()
        return {
            "mensagem": "despesas encontradas",
            "total": len(lista),
            "objetos": lista
        }
        
    def buscar_despesa(self, despesa_id: int):
        despesa = self.repository.get_by_id(
            despesa_id
        )
        
        if not despesa:
            raise HTTPException(
                status_code=404,
                detail="Despesa não encontrada"
            )
        return {
            "mensagem": "Despesa encontrada",
            "objeto": {
                "id": despesa.id,
                "usuario_id": despesa.usuario_id,
                "descricao": despesa.descricao,
                "valor": despesa.valor
            }
        }