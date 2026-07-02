from sqlalchemy.orm import Session
from models.despesa import Despesa


class DespesaRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, despesa: Despesa):
        self.db.add(despesa)
        self.db.commit()
        self.db.refresh(despesa)
        return despesa

    def get_all(self):
        return self.db.query(Despesa).all()

    def get_by_id(self, despesa_id: int):
        return self.db.query(Despesa).filter(Despesa.id == despesa_id).first()

    def get_by_usuario(self, usuario_id: int):
        return self.db.query(Despesa).filter(Despesa.usuario_id == usuario_id).all()

    def update(self):
        self.db.commit()

    def delete(self, despesa):
        self.db.delete(despesa)
        self.db.commit()
