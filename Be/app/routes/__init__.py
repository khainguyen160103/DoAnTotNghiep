from flask import Blueprint


from .auth_routes import bpAuth
from .user_routes import bpUser
from .formSubmission_routes import bpForm
from .attendance_routes import bpAttendance
from .dayoff_routes import Bpdayoff
from .payroll_routes import bpPayroll

# create parent blueprint with prefix url is /api 
api_bp = Blueprint('api', __name__ , url_prefix='/api')

# register all blueprint to blueprint parents

api_bp.register_blueprint(bpAuth, url_prefix="/auth")
api_bp.register_blueprint(bpUser, url_prefix="/user")
api_bp.register_blueprint(bpAttendance, url_prefix="/attendance")
api_bp.register_blueprint(bpForm, url_prefix="/form")
api_bp.register_blueprint(Bpdayoff, url_prefix="/dayoff")
api_bp.register_blueprint(bpPayroll, url_prefix="/payroll")
