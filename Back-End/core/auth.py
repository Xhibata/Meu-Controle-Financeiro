from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from jose import JWTError, jwt

from core.database import get_banco
from core.jwt import CHAVE_SECRETA, ALGORITMO
from models.usuario import Usuario


def obter_usuario_logado(
    authorization: str = Header(...),
    db: Session = Depends(get_banco),
):

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")

    token = authorization.replace("Bearer ", "")

    try:
        payload = jwt.decode(token, CHAVE_SECRETA, algorithms=[ALGORITMO])

        usuario_id = payload.get("sub")

        if usuario_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")

    except JWTError:
        raise HTTPException(status_code=401, detail="Token expirado ou inválido")

    usuario = db.query(Usuario).filter(Usuario.id == int(usuario_id)).first()

    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")

    return usuario
