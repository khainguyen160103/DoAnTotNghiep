from marshmallow_sqlalchemy import SQLAlchemySchema

from app.extencions import db 

class BaseSchema(SQLAlchemySchema):
    class Meta: 
        sqla_session = db.session  