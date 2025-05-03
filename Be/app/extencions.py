from sqlalchemy.orm import DeclarativeBase
from flask_sqlalchemy import SQLAlchemy 
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from cryptography.fernet import Fernet
import os

key = os.environ.get('FERKEY')

cipher = Fernet(key)

class Base(DeclarativeBase): 
    pass
migrate = Migrate()
db = SQLAlchemy(model_class=Base)
ma = Marshmallow()
jwt = JWTManager()
cors = CORS()