from fastapi import APIRouter, HTTPException, status, Response
from fastapi.responses import JSONResponse
from models import models
from config.db import db_dependency
from schemas.schemas import UserSchemaPrivate, UserSchemaPublic
from functions.security import hash_password, verificacion_password, create_token
from pydantic import BaseModel
from datetime import timedelta

user = APIRouter()


# ✅ Schema de entrada para login
class LoginSchema(BaseModel):
    email: str
    password: str


# ✅ Obtener todos los usuarios
@user.get('/users', response_model=list[UserSchemaPublic])
def users_get(db: db_dependency):
    return db.query(models.User).all()


# ✅ Obtener un usuario por ID
@user.get("/users/{id}", response_model=UserSchemaPublic)
def user_get(id: int, db: db_dependency):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail='Usuario no encontrado')
    return user


# ✅ Crear usuario
@user.post('/create/users', response_model=UserSchemaPrivate)
def user_create(users: UserSchemaPrivate, db: db_dependency):
    hashed_password = hash_password(users.password)
    db_user = models.User(
        first_name=users.first_name,
        last_name=users.last_name,
        email=users.email,
        password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ✅ Actualizar usuario
@user.put('/update/users/{id}', response_model=UserSchemaPrivate)
def update_user(id: int, updated_data: UserSchemaPrivate, db: db_dependency):
    user_update = db.query(models.User).filter(models.User.id == id).first()
    if not user_update:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    user_update.first_name = updated_data.first_name
    user_update.last_name = updated_data.last_name
    user_update.email = updated_data.email
    user_update.password = hash_password(updated_data.password)
    user_update.updated_user = updated_data.updated_user

    db.commit()
    db.refresh(user_update)
    return user_update


# ✅ Eliminar un usuario por su ID
@user.delete("/delete/users/{id}", response_model=UserSchemaPublic)
def delete_user(id: int, db: db_dependency):
    user_delete = db.query(models.User).filter(models.User.id == id).first()
    if not user_delete:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.delete(user_delete)
    db.commit()
    return user_delete


# ✅ Login: compara contraseña y guarda JWT en cookie
@user.post('/login')
def login(user_data: LoginSchema, response: Response, db: db_dependency):
    user_login = db.query(models.User).filter(models.User.email == user_data.email).first()

    if not user_login:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Datos incorrectos")

    is_valid = verificacion_password(user_data.password, user_login.password)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Datos incorrectos")

    token = create_token({'email': user_login.email}, timedelta(minutes=60)) 
    
    json_response = JSONResponse(content={"message": "Login exitoso"})
    json_response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=60 * 60 * 24,    
        secure=False,            
        samesite="Lax"
    )
    return json_response 