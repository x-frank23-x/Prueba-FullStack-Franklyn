from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date
from sqlalchemy import Column, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from config.db import Base

class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(25))
    last_name = Column(String(50))
    email = Column(String(255),unique=True)    
    password = Column(String(255))
    

class Product(Base):
    __tablename__ = 'product'

    product_id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(30))
    description = Column(String(255))
    price = Column(Integer)
    category_id = Column(Integer, ForeignKey("category.category_id"))

    category = relationship("Category", back_populates="products")  

class Category(Base):
    __tablename__ = 'category'

    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(30))
    products = relationship("Product", back_populates="category")