from marshmallow import Schema, fields, validate, post_load, ValidationError, INCLUDE
from app.models.dayOff_model import DayOff
from datetime import datetime
from .baseSchema import BaseSchema

class DayOffSchema(BaseSchema):
         class Meta(BaseSchema.Meta):
             model = DayOff
             load_instance = True
             unknown = INCLUDE
         id = fields.String(dump_only=True)  
         employee_id = fields.String(required=True, validate=validate.Length(max=10))
         DayOff_number = fields.Integer(required=True, validate=validate.Range(min=0))
         DayOff_year = fields.Integer(required=True, 
                                 validate=validate.Range(min=2020, max=2100),
                                 default=lambda: datetime.now().year)
         DayOff_month = fields.Integer(required=True, 
                                 validate=validate.Range(min=1, max=12),
                                 default=lambda: datetime.now().month)
         DayOff_use = fields.Boolean(required=True, default=False)