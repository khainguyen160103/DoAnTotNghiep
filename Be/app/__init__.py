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
def create_app(): 
    app = Flask(__name__)
    config = Config()
    config.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    cors.init_app(app ,  supports_credentials=True, resources={r"/*" : {
        "origins" : "http://localhost:3000" 
    }})

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