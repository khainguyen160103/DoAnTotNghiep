from  flask_jwt_extended import get_jwt_identity
from functools import wraps

from app.models import Account
from app.extencions import db
from app.utils import Error, Success

class AuthMiddleware(): 
    def adminRequired(): 
       user_id = get_jwt_identity()

       if not user_id: 
           error = Error(
               message="User not found",
               status=401
           )
           return error.to_json(), 401
       
       user = db.session.get(Account, user_id)
       if not user: 
              error = Error(
                message="User not found",
                status=401
              )
              return error.to_json(), 401
       if user.role_id != 1: 
              error = Error(
                message="You are not authorized to perform this action",
                status=403
              )
              return error.to_json(), 403
       return None