from flask_jwt_extended import get_current_user

from app.schemas import LetterLeaveSchema, LetterOvertimeSchema, LetterVertificationSchema
from app.models import letterLeave, letterOvertime, letterVertification
from app.extencions import db
from app.utils import Error, Success    

class FormSubmissionService: 
    @staticmethod
    def create_form_ver(json_data): 
        print(json_data)
        duplicate_id = db.session.get(letterVertification, json_data["id"])
        if duplicate_id:
            return Error(
                message="ID already exists",
                status=400
            ).to_json(), 400
        
        schema = LetterVertificationSchema()
        form = schema.load(json_data)
        db.session.add(form)
        db.session.commit()
        return Success(
            message="Create Successfully",
            status=200
        ).to_json(), 200

    @staticmethod
    def create_form_leave(json_data): 
        duplicate_id = db.session.get(letterLeave, json_data["id"])
        if duplicate_id:
            return Error(
                message="ID already exists",
                status=400
            ).to_json(), 400
        
        schema = LetterLeaveSchema()
        form = schema.load(json_data)
        db.session.add(form)
        db.session.commit()
        return Success(
            message="Create Successfully",
            status=200
        ).to_json(), 200
        

    @staticmethod
    def create_form_over(json_data): 
        duplicate_id = db.session.get(letterOvertime, json_data["id"])
        if duplicate_id:
            return Error(
                message="ID already exists",
                status=400
            ).to_json(), 400
        
        schema = LetterOvertimeSchema()
        form = schema.load(json_data)
        db.session.add(form)
        db.session.commit()
        return Success(
            message="Create Successfully",
            status=200
        ).to_json(), 200

    @staticmethod
    def delete_form(id):
        letter_ver = db.session.get(letterVertification, id)
        letter_leave = db.session.get(letterLeave, id)
        letter_ot = db.session.get(letterOvertime, id)

        # Nếu không tìm thấy trong bất kỳ loại đơn nào
        if not letter_ver and not letter_leave and not letter_ot:
            return Error(
                message="ID not found in any form type",
                status=404
            ).to_json(), 404

        # Xóa đơn nếu tìm thấy
        try:
            if letter_ver:
                db.session.delete(letter_ver)
            elif letter_leave:
                db.session.delete(letter_leave)
            elif letter_ot:
                db.session.delete(letter_ot)

            db.session.commit()
            return Success(
                message="Form deleted successfully",
                status=200
            ).to_json(), 200
        except Exception as e:
            db.session.rollback()
            return Error(
                message="An error occurred while deleting the form",
                status=500,
                error=str(e)
            ).to_json(), 500
    
    @staticmethod
    def update_form(json_data):
        try:
          # Tìm form theo id trong cả 3 loại
            form = None
            form_type = None

            if db.session.get(letterVertification, json_data["id"]):
                form = db.session.get(letterVertification, json_data["id"])
                form_type = "letterVertification"
            elif db.session.get(letterLeave, json_data["id"]):
                form = db.session.get(letterLeave, json_data["id"])
                form_type = "letterLeave"
            elif db.session.get(letterOvertime, json_data["id"]):
                form = db.session.get(letterOvertime, json_data["id"])
                form_type = "letterOvertime"

            # Nếu không tìm thấy form
            if not form:
                return Error(
                    message="ID not found in any form type",
                    status=404
                ).to_json(), 404

            # Cập nhật dữ liệu
            for key, value in json_data.items():
                if hasattr(form, key):
                    setattr(form, key, value)

            db.session.commit()
            return Success(
                message=f"{form_type} updated successfully",
                status=200
            ).to_json(), 200
        except Exception as e:
            db.session.rollback()
            return Error(
                message="An error occurred while updating the form",
                status=500,
                error=str(e)
            ).to_json(), 500

    @staticmethod
    def get_all(): 
        try:
            # Lấy tất cả các form từ 3 loại
            letter_ver_list = letterVertification.query.all()
            letter_leave_list = letterLeave.query.all()
            letter_ot_list = letterOvertime.query.all()

            # Chuyển đổi dữ liệu thành danh sách dictionary
            result = {
                "letterVertifications": [
                    {column.name: getattr(ver, column.name) for column in ver.__table__.columns}
                    for ver in letter_ver_list
                ],
                "letterLeaves": [
                    {column.name: getattr(leave, column.name) for column in leave.__table__.columns}
                    for leave in letter_leave_list
                ],
                "letterOvertimes": [
                    {column.name: getattr(ot, column.name) for column in ot.__table__.columns}
                    for ot in letter_ot_list
                ]
            }

            return Success(
                message="Forms retrieved successfully",
                status=200,
                payload=result
            ).to_json(), 200
        except Exception as e:
            return Error(
                message=str(e),
                status=500,
                error=str(e)
            ).to_json(), 400

    @staticmethod
    def get_all_by_id(id): 
        try:
            # Tìm form theo id trong cả 3 loại
            letter_ver = db.session.get(letterVertification, id)
            letter_leave = db.session.get(letterLeave, id)
            letter_ot = db.session.get(letterOvertime, id)

            # Nếu không tìm thấy trong bất kỳ loại đơn nào
            if not letter_ver and not letter_leave and not letter_ot:
                return Error(
                    message="ID not found in any form type",
                    status=404
                ).to_json(), 404

            # Trả về dữ liệu của form tìm thấy
            if letter_ver:
                data = {column.name: getattr(letter_ver, column.name) for column in letter_ver.__table__.columns}
            elif letter_leave:
                data = {column.name: getattr(letter_leave, column.name) for column in letter_leave.__table__.columns}
            elif letter_ot:
                data = {column.name: getattr(letter_ot, column.name) for column in letter_ot.__table__.columns}

            return Success(
                message="Form retrieved successfully",
                status=200,
                payload=data
            ).to_json(), 200
        except Exception as e:
            return Error(
                message="An error occurred while retrieving the form",
                status=500,
                error=str(e)
            ).to_json(), 500
