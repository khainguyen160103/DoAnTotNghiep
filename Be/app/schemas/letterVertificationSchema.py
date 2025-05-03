from marshmallow import fields, INCLUDE
from app.extencions import ma
from app.models import letterVertification
from .baseSchema import BaseSchema

class LetterVertificationSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        load_instance = True
        model = letterVertification
        unknown = INCLUDE
    title = fields.String(required=True, description="Title of the vertification letter")
    note = fields.String(required=True, description="Additional notes")