from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from typing import Annotated
from fastapi import Depends  
import os

# URL de conexión a PostgreSQL
URL_DB = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:jugohit23@db:5432/postgres")

# Crear el motor
engine = create_engine(URL_DB)

# Crear una clase de sesión local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()

# Dependencia para obtener una sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Tipo anotado para inyectar la sesión de la base de datos en los endpoints
db_dependency = Annotated[Session, Depends(get_db)]
