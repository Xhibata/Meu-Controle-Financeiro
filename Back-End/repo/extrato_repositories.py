from sqlalchemy.orm import Session
from models.extrato import Extrato

class ExtratoRepository:
    def __init__(self, db: Session):
        self.db = db
        
    def create(self, extrato: Extrato):
        self.db.add(extrato)
        self.db.commit()
        self.db.refresh(extrato)
        return extrato
    
    def get_all(self):
        return self.db.query(Extrato).all()
    
    def get_by_id(self, extrato_id: int):
        return (
            self.db.query(Extrato)
            .filter(Extrato.id == extrato_id)
            .first()
        )
        
    def get_by_usuario_id(self, usuario_id: int):
        return (
            self.db.query(Extrato)
            .filter(Extrato.usuario_id == usuario_id)
            .all()
        )