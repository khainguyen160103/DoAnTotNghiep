from marshmallow import fields, validates, INCLUDE
from app.extencions import ma
from app.models import letterLeave
from .baseSchema import BaseSchema

class LetterLeaveSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        load_instance = True
        model = letterLeave
        unknown = INCLUDE

    title = fields.String(
        required=True,
        description="Title of the leave letter")
    request_date = fields.Date(
        required=True, 
        description="Date of the leave request"
        )
    start_at = fields.DateTime(
        required=True, 
        description="Start date and time of the leave")
    end_at = fields.DateTime(
        required=True, 
        description="End date and time of the leave")
    note = fields.String(
        required=True, 
        description="Additional notes")
