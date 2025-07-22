# backend/alembic/env.py

from logging.config import fileConfig
import sys
import os

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# --- INICIO DE LA SECCIÓN DE CONFIGURACIÓN CRÍTICA ---

# Añade la ruta al directorio padre (backend/) para que Python pueda encontrar tus módulos
# Esto es crucial para que las importaciones relativas (como 'from models.models import Base') funcionen
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Importa la Base de tus modelos de SQLAlchemy.
# ¡AJUSTA ESTA LÍNEA SEGÚN LA RUTA Y NOMBRE REAL DE TU ARCHIVO BASE!
# Ejemplos comunes:
# Si tu Base está en backend/models/models.py:
from models.models import Base
# Si tu Base está en backend/models/base.py:
# from models.base import Base
# Si tu Base está directamente en backend/app.py:
# from app import Base

# Este es el objeto MetaData de tus modelos. Alembic lo usa para autogenerar migraciones.
# Asegúrate de que 'Base' sea el objeto Base de SQLAlchemy que usas para tus modelos.
target_metadata = Base.metadata # <--- ¡ESTA ES LA CORRECCIÓN CLAVE!

# --- FIN DE LA SECCIÓN DE CONFIGURACIÓN CRÍTICA ---


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()