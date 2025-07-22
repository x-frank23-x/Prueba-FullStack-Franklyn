from fastapi import FastAPI,Depends, Cookie
from fastapi.middleware.cors import CORSMiddleware
import models.models as models
from models.models import Base
from routes.user import user
from routes.category import category
from routes.products import product
from config.db import engine
from functions.security import get_current_user_from_cookie


origins = ["http://localhost:5173","http://127.0.0.1:5173"]

app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Rutas
app.include_router(user)
app.include_router(category)
app.include_router(product)

# Endpoints de prueba
@app.get('/')
def root():
    return {"message": "index"}

@app.get("/dashboard/verify-session")
def verify_session(current_user: models.User = Depends(get_current_user_from_cookie)):
    return {"message": f"Sesión válida para {current_user.email}"}

@app.get("/dashboard")
def dashboard(current_user: models.User = Depends(get_current_user_from_cookie)):
    return {"message": f"Bienvenido, {current_user.first_name}"}

# Ejecutar en consola:
# venv\Scripts\activate
# uvicorn app:app --reload
