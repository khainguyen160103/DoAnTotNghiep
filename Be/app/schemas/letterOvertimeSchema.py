from marshmallow import fields, INCLUDE
from app.extencions import ma
from app.models import letterOvertime
from .baseSchema import BaseSchema

class LetterOvertimeSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        load_instance = True
        model = letterOvertime
        unknown = INCLUDE

    title = fields.String(required=True, description="Title of the overtime letter")
    start_at = fields.DateTime(required=True, description="Start date and time of the overtime")
    end_at = fields.DateTime(required=True, description="End date and time of the overtime")
    note = fields.String(required=True, description="Additional notes")
