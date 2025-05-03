# init app 
from flask_migrate import Migrate
from flask import Flask, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text



from .config import Config
from .extencions import db ,migrate, ma, jwt, cors
from . import models
from . import routes
from .models import Employee, Account

def create_app(): 
    app = Flask(__name__)
    config = Config()
    config.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    cors.init_app(app ,  supports_credentials=True , origins=["http://localhost:3000", "http://127.0.0.1:3000"])

    # get user identity to pass current user in jwt_extend
    @jwt.user_lookup_loader
    def user_lookup_callback(jwt_header, jwt_data): 
        identity = jwt_data['sub']
        employee =  Employee.query.filter_by(id=identity).one_or_none()
        account = Account.query.filter_by(id = identity).one_or_none()
        user = {
        "id": identity,
        }
        print(f'user: {user}')
        return user

    # add lib to app Flask 
    db.init_app(app)
    migrate.init_app(app, db)
    
    # register blueprint 
    app.register_blueprint(routes.api_bp)

    with app.app_context(): 
        try:
            db.session.execute(text('select 1'))
            print("success")
        except Exception as e:
            print(f'fail {e}')
        db.create_all()
        db.session.commit()

    return app 