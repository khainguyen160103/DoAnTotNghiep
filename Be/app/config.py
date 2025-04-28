import os 
from dotenv import load_dotenv

load_dotenv()
print(os.environ.get('database_url'))
class Config: 
    def __init__(self,db_config_url=None):
        self.database_url = db_config_url or os.environ.get('database_url')
        # Add a secret key for session handling
        self.secret_key = os.environ.get('SECRET_KEY')

    def init_app(self,app):
        app.config["SQLALCHEMY_DATABASE_URI"] = self.database_url
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        # Set the secret key for the application

        app.config['JWT_SECRET_KEY'] = self.secret_key
        # config cookie 
        app.config["JWT_COOKIE_SAMESITE"] = "Lax"
        # app.config['JWT_TOKEN_LOCATION'] = ['cookies']
        app.config['JWT_SECRET_KEY'] = self.secret_key
        app.config["JWT_COOKIE_SECURE"] = False
        app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 60*60*24*7
        app.config["JWT_COOKIE_CSRF_PROTECT"] = False
        app.config["JWT_COOKIE_HTTPONLY"] = False
        app.config["JWT_SESSION_COOKIE"] = False
        



    