from app.extencions import db
from app.utils import Error, Success
from app.models import DayOff
from app.schemas import DayOffSchema


class DayoffServices:
 
     @staticmethod
     def get_dayoff_by_id(employee_id):
         print("employee_id", employee_id)
         data = db.session.query(DayOff).filter_by(employee_id=employee_id).all()
         if not data:
             return Error(message="Day off not found", status=404).to_json() , 404
     
         schema = DayOffSchema(many=True)
         res = schema.dump(data)
         return Success(payload=res, message="Day off found", status=200).to_json(), 200
 
     
     @staticmethod
     def add_dayoff(json_data):
         try:
 
             if not json_data or not json_data.get("employee_id"):
                 return Error(
                     message="Invalid input data - employee_id is required",
                     status=400
                 ).to_json(), 400
             
             schema = DayOffSchema()
             data = schema.load(json_data)
             db.session.add(data)
             db.session.commit()
 
             return Success(
                 message="Create Successfully",
                 status=200
             ).to_json(), 200
         except Exception as err:
             print("Error", err)
             db.session.rollback()
             return Error(
                 message=str(err),
                 status=400
             ).to_json(), 400
         
     
     @staticmethod
     def update_dayoff(json_data):
         try:
             # Kiểm tra xem có ID không
             if "id" not in json_data:
                 return Error(
                     message="Dayoff ID is required",
                     status=400
                 ).to_json(), 400
             
             # Tìm bản ghi theo ID
             dayoff_id = json_data["id"]
             dayoff_record = db.session.get(DayOff, dayoff_id)
             
             if not dayoff_record:
                 return Error(
                     message=f"No dayoff record found with ID {dayoff_id}",
                     status=404
                 ).to_json(), 404
             
             if "DayOff_number" in json_data:
                 dayoff_record.DayOff_number = json_data["DayOff_number"]
             
             # Nếu bạn muốn cập nhật các trường khác
             for key, value in json_data.items():
                 if (key in ["DayOff_use", "DayOff_year", "DayOff_month"] and 
                     hasattr(dayoff_record, key)):
                     setattr(dayoff_record, key, value)
             
             # Lưu thay đổi vào database
             db.session.commit()
             
             # Trả về dữ liệu đã cập nhật
             schema = DayOffSchema()
             updated_data = schema.dump(dayoff_record)
             
             return Success(
                 message="DayOff record updated successfully",
                 status=200,
                 payload=updated_data
             ).to_json(), 200
         
         except Exception as err:
             print("Error updating dayoff:", err)
             db.session.rollback()
             return Error(
                 message=str(err),
                 status=500
             ).to_json(), 500