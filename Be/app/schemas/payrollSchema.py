from marshmallow import fields, validates, INCLUDE
from app.models import Payroll
from .baseSchema import BaseSchema

class PayrollSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        load_instance = True
        model = Payroll
        unknown = INCLUDE

    id = fields.String(dump_only=True)
    month = fields.Date(required=True)
    year = fields.Integer(required=True)
    total_attendance = fields.Float()
    base_salary = fields.Float()
    salary_ot = fields.Float()
    salary_addOn = fields.Float()
    salary_another = fields.Float()
    salary_total = fields.Float()

