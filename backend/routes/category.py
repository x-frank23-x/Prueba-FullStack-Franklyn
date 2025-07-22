from fastapi import APIRouter, HTTPException
from config.db import db_dependency
from models import models
from schemas.schemas import (
    CategoryProductsSchema
)

category = APIRouter()

# GET: Obtener todas las categorías con sus productos
@category.get("/category", response_model=list[CategoryProductsSchema])
def get_all_category_with_products(db: db_dependency):
    return db.query(models.Category).all()

# GET: Obtener una categoría por ID con sus productos
@category.get("/category/{category_id}", response_model=CategoryProductsSchema)
def get_category_with_products(category_id: int, db: db_dependency):
    category = db.query(models.Category).filter(models.Category.category_id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

# POST: Crear una nueva categoría
@category.post("/category", response_model=CategoryProductsSchema)
def create_category(data: CategoryProductsSchema, db: db_dependency):
    db_category = models.Category(category_name=data.category_name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# PUT: Actualizar una categoría existente
@category.put("/category/{category_id}", response_model=CategoryProductsSchema)
def update_category(category_id: int, data: CategoryProductsSchema, db: db_dependency):
    category = db.query(models.Category).filter(models.Category.category_id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    category.category_name = data.category_name
    db.commit()
    db.refresh(category)
    return category

# DELETE: Eliminar una categoría
@category.delete("/category/{category_id}", response_model=CategoryProductsSchema)
def delete_category(category_id: int, db: db_dependency):
    category = db.query(models.Category).filter(models.Category.category_id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Puedes validar aquí si tiene productos antes de eliminar
    if category.products:
        raise HTTPException(status_code=400, detail="Category has associated products. Cannot delete.")

    db.delete(category)
    db.commit()
    return category
