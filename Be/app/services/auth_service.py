from flask import request, jsonify, make_response
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies

from app.schemas import UserSchemaFactory
from app.extencions import db, cipher
from app.utils import Error, Success
from app.models import Account, Employee
class AuthService:

    @staticmethod
    def login(json_data):
        print('check')
        # validate user
        user = UserSchemaFactory.login_schema().load(json_data)
        
        # data after validate
        username = user.username
        password = user.password
        isUsernameExits = db.session.query(Account).filter_by(username=username, isActived = True).first()
        
        if not isUsernameExits: 
            return Error("Tài khoản không chính xác", 400).to_json() , 400
            

        password_db = cipher.decrypt(isUsernameExits.password).decode()
        user_id = isUsernameExits.id
        print(password , password_db)
        if password != password_db: 
            return  Error("Mật khẩu không chính xác", 400).to_json() , 400
            
        
        access_token = create_access_token(identity=user_id)

        response = make_response(Success(message="Đăng nhập thành công", payload={'token': access_token}, status=200).to_json())
        
        # set_access_cookies(response, access_token, max_age=60*60*24*7) # 7 days
        response.set_cookie(
            'access_token_cookie',
            value=access_token,
            max_age=60*60*24*7,  # 7 days
            path='/',
            domain=None,  # Thử None trước
            secure=False,  # False cho development
            httponly=False,
            samesite='Lax'
        )
        print("Set-Cookie header:", response.headers.get('Set-Cookie'))
        return response, 200

    @staticmethod
    def logout():
        response = Success(message="Đăng xuất thành công", status=200).to_json()
        unset_jwt_cookies(response)
        return response, 200

        
    @staticmethod
    def update(data_json): 
        print(data_json)
        account = UserSchemaFactory.update_account_schema().load(data_json)
        info = UserSchemaFactory.update_employee_schema().load(data_json)
        
        print(account)
        id = account.id
    
        account = db.session.query(Account).filter_by(id=id).first()
        if not account: 
            error = Error("Không tìm thấy người dùng", 400)
            return error.to_json(), 400
        
        info = db.session.query(Employee).filter_by(id=id).first()
        
        if 'username' in data_json:
            account.username = data_json['username']
        if 'password' in data_json:
            bytePassword = data_json['password'].encode('utf-8')
            account.password = cipher.encrypt(bytePassword) 
        if 'isActived' in data_json:
            account.isActived = data_json['isActived']
        if 'role_id' in data_json:
            account.role_id = data_json['role_id']
        if 'email' in data_json:
            info.email = data_json['email']
        if 'fullname' in data_json:
            info.fullname = data_json['fullname']
        if 'employee_type' in data_json:
            info.employee_type = data_json['employee_type']
        if 'work_status' in data_json:
            info.work_status = data_json['work_status']
        if 'position_id' in data_json:
            info.position_id = data_json['position_id']
        
        try: 
            db.session.commit()
            return Success(message="Cập nhật thành công", payload={}, status=200).to_json() , 200
        except Exception as e: 
            db.session.rollback()
            return Error("Cập nhật thất bại", 400).to_json(), 400



