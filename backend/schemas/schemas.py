from pydantic import BaseModel
from datetime import datetime
from typing import List,Optional



class UserSchemaPrivate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str


class UserSchemaPublic(BaseModel):
    email: str
    password:str

class ProductSchema(BaseModel):
    product_name:str
    description:str
    price:int
    category_id:int

class ProductResponseSchema(BaseModel):
    product_id: int
    product_name: str
    description: str
    price: float
    category_id: int
    category_name: Optional[str] = None

class CategoryProductsSchema(BaseModel):
    category_name: str
    