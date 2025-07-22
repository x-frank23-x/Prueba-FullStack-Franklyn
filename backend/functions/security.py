from fastapi import Depends, HTTPException, status,Request
from passlib.context import CryptContext
from config.db import db_dependency
from models.models import User
from datetime import datetime, timedelta, timezone
from jose import JWTError,jwt

SECRET_KEY="ADFEF78E9A8D1417E1BC5646629C5"
ALGORITHM = "HS256"
TOKEN_EXP=20

# Usamos bcrypt como algoritmo de hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verificacion_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_token(data: dict , expired_delta:timedelta | None =None):
    data_token = data.copy()
    if expired_delta:
        expire = datetime.now(timezone.utc) + expired_delta
    else:
        data_token.update({"exp": expire})
    token = jwt.encode(data_token, key=SECRET_KEY, algorithm=ALGORITHM)
    return token

def verify_token(token: str):
    try:
        payload = jwt.decode(token, key=SECRET_KEY, algorithms=['HS256'])
        email:str =payload.get("sub")
        if email is None:
            raise HTTPException(status_code=403,detail="token es invalido o expiro")
        return payload
    except JWTError:
        raise HTTPException(status_code=403,detail="token es invalido o expiro")



def get_current_user_from_cookie(request: Request, db: db_dependency):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Token no encontrado")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")
        if not email:
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user
