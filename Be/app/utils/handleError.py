from flask import jsonify
class Error(Exception): 
    def __init__(self,message, status=404, payload=None):
        self.status = status
        self.message = message
        self.payload = payload or {}

    def to_json(self): 
        error_dict={ 
            'message' : self.message,
            'status' : self.status
        }
        if self.payload:
            error_dict = dict(self.payload)
        return jsonify(error_dict)
    