from fastapi import HTTPException
from models.extrato import Extrato
from repo.repositories_extrato import ExtratoRepository

class serviceExtrato:
    def __init__(self, repositories: ExtratoRepository):
        self.repository = repositories

    def get_all(self) -> list[Extrato]:
        return self.repository.list_all()

    def get_by_id(self, extrato_id: int) -> Extrato:
        extrato = self.repository.find_by_id(extrato_id)
        if not extrato:
            raise HTTPException(status_code=404, detail="Extrato não encontrado")
        return extrato

    def create(self, extrato: Extrato) -> Extrato:
        return self.repository.add(extrato)

    def update(self, extrato_id: int, extrato_data: Extrato) -> Extrato:
        existing = self.repository.find_by_id(extrato_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Extrato não encontrado")
        return self.repository.update(extrato_id, extrato_data)

    def delete(self, extrato_id: int) -> None:
        if not self.repository.find_by_id(extrato_id):
            raise HTTPException(status_code=404, detail="Extrato não encontrado")
        self.repository.delete(extrato_id)
        
    