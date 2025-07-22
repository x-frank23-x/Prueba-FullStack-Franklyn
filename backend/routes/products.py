from fastapi import APIRouter, HTTPException
from models import models
from config.db import db_dependency  
from schemas.schemas import ProductSchema, ProductResponseSchema
from sqlalchemy.orm import joinedload

product = APIRouter()

# GET: Obtener todos los productos
@product.get('/products', response_model=list[ProductResponseSchema])
def products_get(db: db_dependency):
    products = db.query(models.Product).options(joinedload(models.Product.category)).all()

    result = []
    for product in products:
        result.append({
            "product_id": product.product_id,
            "product_name": product.product_name,
            "description": product.description,
            "price": product.price,
            "category_id": product.category_id,
            "category_name": product.category.category_name  
        })
    return result

# GET: Obtener un producto por ID
@product.get("/products/{id}", response_model=ProductSchema)
def product_get(id: int, db: db_dependency):
    product = db.query(models.Product).filter(models.Product.product_id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail='Product not found')
    return product

# GET: Obtener productos por categoría
@product.get("/products/category/{category_id}", response_model=list[ProductSchema])
def get_products_by_category(category_id: int, db: db_dependency):
    products = db.query(models.Product).filter(models.Product.category_id == category_id).all()
    
    if not products:
        raise HTTPException(status_code=404, detail="No products found for this category")
    
    return products

# POST: Crear producto
@product.post('/products', response_model=ProductSchema)
def product_create(products: ProductSchema, db: db_dependency):
    db_product = models.Product(
        product_name=products.product_name,
        description=products.description,
        price=products.price,
        category_id=products.category_id,
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# PUT: Actualizar producto
@product.put('/products/{product_id}', response_model=ProductSchema)
def update_product(product_id: int, updated_data: ProductSchema, db: db_dependency):
    product_update = db.query(models.Product).filter(models.Product.product_id == product_id).first()
    if not product_update:
        raise HTTPException(status_code=404, detail="Product not found")

    product_update.product_name = updated_data.product_name
    product_update.description = updated_data.description
    product_update.price = updated_data.price
    product_update.category_id = updated_data.category_id
    db.commit()
    db.refresh(product_update)
    return product_update

# DELETE: Eliminar producto
@product.delete("/products/{id}", response_model=ProductSchema)
def delete_product(id: int, db: db_dependency):
    product_delete = db.query(models.Product).filter(models.Product.product_id == id).first()
    if not product_delete:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product_delete)
    db.commit()
    return product_delete
