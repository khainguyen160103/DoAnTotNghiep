from marshmallow import fields, validates, INCLUDE , pre_load
from sqlalchemy import select
from werkzeug.security import generate_password_hash
from cryptography.fernet import Fernet

from app.extencions import ma,db, cipher
from app.models import Account, Employee
from app.utils import Error
from .baseSchema import BaseSchema



class UserSchemaFactory: 
    ""
    ""
    ""


    @staticmethod
    def account_schema(hash_password=True, id_required=False, exclude_fields=None, include_only=None): 
        
        
        exclude_fields = exclude_fields or []
        include_only = include_only or []

        class AccountSchema(BaseSchema): 
            def __init__(self, *args, **kwargs):
                self.hash_password = hash_password
                super().__init__(*args, **kwargs)

            class Meta(BaseSchema.Meta):
                load_instance = True
                model = Account
                unknown = INCLUDE

                # Use variables outside Meta to avoid overwriting marshmallow.fields
                if include_only: 
                    fields = tuple(include_only)
               

                if exclude_fields:
                    exclude = tuple(exclude_fields)

            username = fields.String(
                required=True,
                error_messages={'required': "Username is required"}
            )
            password = fields.String(
                required=True, 
                error_messages={"required": "Password is Required"}
            )

            if (id not in exclude_fields or (not include_only and 'id' in include_only)):
                id = fields.String(
                    required=id_required,
                    error_messages={
                        'required': 'ID Is Required'
                    }
                )

            @pre_load
            def process_data(self, data, **kwargs): 
                if self.hash_password and data['password']: 
                    bytePassword = data['password'].encode('utf-8')
                    data['password'] = cipher.encrypt(bytePassword)
                return data 
                
        return AccountSchema()
    @staticmethod
    def employee_schema(nested_account=True,include_account_fields=None, exclude_fields=None, include_fields=None):
        
        if include_fields: 
            include_fields = include_fields or []
        if include_account_fields:
            include_account_fields = include_account_fields or []
        if exclude_fields:
            exclude_fields = exclude_fields or []

        if nested_account and include_account_fields: 
            account_schema = UserSchemaFactory.create_account_schema(hash_password=False,
                                                                     include_only=include_account_fields)
        else: 
            account_schema = None


        class EmployeeSchema(BaseSchema): 
            class Meta(BaseSchema.Meta): 
                load_instance = True
                model = Employee
                unknown = INCLUDE


                if include_fields: 
                    fields = tuple(include_fields)
                if exclude_fields: 
                    exclude = tuple(exclude_fields)

            fullname = fields.String(
                        required=True,
                        error_messages={
                            "required": "fullname is required"
                        }
                    )   
            email = fields.String(
                    required=True, 
                    error_messages={ 
                        "required" : "email is required"
                    }
                )

            if nested_account: 
                    account_id = fields.String(load_only=True)
                    account = fields.Nested(account_schema,dump_only=True)
        return EmployeeSchema()
    
    @staticmethod
    def login_schema():
        return UserSchemaFactory.account_schema(
            hash_password=False,
            id_required=False,
            include_only=['username', 'password']
        )
    
    @staticmethod
    def update_account_schema():
        class UpdateAccountSchema(BaseSchema): 
            class Meta(BaseSchema.Meta): 
                model = Account
                load_instance = True
                unknown = INCLUDE
                
            id = fields.String(required=True)  # ID người dùng bắt buộc
            username = fields.String()
            password = fields.String()
            isActived = fields.Boolean()
            role_id = fields.Integer()
            email = fields.String()
            fullname = fields.String()
            employee_type = fields.String()
            work_status = fields.String()
            position_id = fields.String()
        return UpdateAccountSchema()
    
    @staticmethod
    def update_employee_schema(): 
        class updateEmployeeSchema(BaseSchema): 
            class Meta(BaseSchema.Meta): 
                model = Employee
                load_instance = True
                unknown = INCLUDE
                
            account_id = fields.String()
            fullname = fields.String()
            email = fields.String()
            employee_type = fields.String()
            work_status = fields.String()
            position_id = fields.String()
            account = fields.Nested(UserSchemaFactory.account_schema(), dump_only=True)
        return updateEmployeeSchema()


