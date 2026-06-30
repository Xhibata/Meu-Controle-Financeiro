import base64
import hashlib
import hmac
import time
from typing import Optional

from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session

from core.database import get_banco
from models.usuario import Usuario

SECRET_KEY = "troque-esta-chave-por-uma-mais-segura"
TOKEN_EXPIRATION_SECONDS = 3600


def verificar_hash(senha_digitada: str, hash_gravado: str) -> bool:
    # Gera o hash da senha digitada para comparação
    hash_digitado = hashlib.sha256(senha_digitada.encode("utf-8")).hexdigest()
    
    # Compara os dois hashes de forma segura contra ataques de tempo
    return hmac.compare_digest(hash_digitado, hash_gravado)


def hash_senha(senha: str) -> str:
    return hashlib.sha256(senha.encode("utf-8")).hexdigest()


def criar_assinatura(mensagem: str) -> str:
    return hmac.new(
        SECRET_KEY.encode("utf-8"),
        mensagem.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def criar_token(usuario_id: int) -> str:
    expiracao = int(time.time()) + TOKEN_EXPIRATION_SECONDS
    payload = f"{usuario_id}:{expiracao}"
    assinatura = criar_assinatura(payload)
    token = f"{payload}:{assinatura}"
    return base64.urlsafe_b64encode(token.encode("utf-8")).decode("utf-8")


def verificar_token(token: str) -> Optional[int]:
    try:
        decoded = base64.urlsafe_b64decode(token.encode("utf-8")).decode("utf-8")
        usuario_id_str, exp_str, assinatura = decoded.split(":")
        payload = f"{usuario_id_str}:{exp_str}"
    except Exception:
        return None

    if criar_assinatura(payload) != assinatura:
        return None

    if int(exp_str) < int(time.time()):
        return None

    return int(usuario_id_str)


def obter_usuario_logado(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_banco),
) -> Usuario:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")

    token = authorization.split(" ", 1)[1].strip()
    usuario_id = verificar_token(token)
    if not usuario_id:
        raise HTTPException(status_code=401, detail="Token expirado ou inválido")

    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")

    return usuario
