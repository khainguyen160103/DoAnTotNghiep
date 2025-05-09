from flask import jsonify
from werkzeug.security import generate_password_hash
from marshmallow import ValidationError
from flask_jwt_extended import jwt_required , get_jwt_identity
import binascii
import cryptography.fernet

from app.extencions import db , cipher
from app.models import Account, Employee, Role, DayOff ,  Position
from app.utils import Error, Success
from app.schemas import UserSchemaFactory
class UserSerives: 
    
    @staticmethod
    def create_user(json_data): 
        try: 
            print(json_data)
            
            duplicate_id = db.session.get(Account,json_data["id"])
            duplicate_username = db.session.query(Account).filter_by(username=json_data['username']).first()
            print(duplicate_username)
            if(duplicate_id): 
                error = Error(
                    message="Mã nhân viên đã tồn tại",
                    status=400
                )
                return error.to_json(), 400
            
            if (duplicate_username): 
                error = Error( 
                    message="Tên đăng nhập đã tồn tại",
                    status=400
                )
                return error.to_json(), 400
            
            employee = UserSchemaFactory.employee_schema().load(json_data)
            account = UserSchemaFactory.account_schema(hash_password=True, id_required=True).load(json_data)
           
            db.session.add(employee) 
            db.session.add(account)
            db.session.commit()
            success = Success(
                message="Tạo tài khoản thành công",
                status=200
            )
    
            return success.to_json(), 200

        except ValidationError as err: 
            error = Error( 
                message=str(err),
                status=400,
                payload=err.messages
            )
            return error.to_json(), 400
        except Exception as err: 
            print("Error", err)
            db.session.rollback()  # Ensure rollback on error
            error = Error(
                message=str(err),
                status=400
            )
            return error.to_json() , 400
        
    @staticmethod
    def get_user_by_id(id): 
        user = db.session.query(Account.username,Account.role_id, Account.password, Employee.email , Employee.fullname , DayOff.DayOff_number.label('dayoff')).filter_by(id=id).join(Employee, Employee.id == Account.id).join(DayOff , DayOff.employee_id == Employee.id).first()
        if not user: 
            return Error(
                message="Not Found User",
                status=404
            ).to_json(), 404
        print(user)
        data = { 
            "id": id,
            "username": user.username,
            "password": user.password,
            "email": user.email,
            "fullname": user.fullname,
            "dayOff": user.dayoff,
            "role": user.role_id
        }
    
        return Success(
            message="Successfully",
            status=200,
            payload=data
        ).to_json() , 200
        
    @staticmethod
    def delete_user(id): 
        if not id: 
            return Error(
                message="ID is required",
                status=400
            ).to_json(), 400
        
        user = db.session.query(Account).filter_by(id=id).first()
      
        print(user)
        if not user: 
            return Error(
                message="User not found",
                status=404
            ).to_json(), 404
        
        user.isActived = False
        db.session.commit()
        return Success(message="Delete successfully", status=200).to_json(), 200
    

    @staticmethod
    def get_all_user(): 
        query = db.session.query(Account.id, Account.username ,Account.created_at, Account.isActived, Account.password,Employee.fullname,Employee.work_status, Employee.employee_type, Employee.email , Role.name.label('role') ,Position.name.label('position')).join(Employee,Account.id == Employee.id).join(Role, Account.role_id == Role.id).join(Position , Employee.position_id == Position.id).all()

        users = [
            { 
                "id" : user_id,
                "username": username,
                "created_at": create_at,
                "isActived": isActived,
                "password": cipher.decrypt(password).decode('utf-8'),
                "fullname":fullname,
                "work_status": work_status,
                "employee_type": employee_type,
                "role": role,
                "email": email,
                "position": position
            }
            for user_id , username, create_at ,isActived, password,fullname, work_status, employee_type ,email, role , position  in query
        ]
        
        return Success(
            message="Successfully",
            status=200,
            payload=users
           
        ).to_json(),200
    
