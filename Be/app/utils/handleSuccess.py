from flask import jsonify
class Success(): 
    def __init__(self,message,payload=None,status=200):
        self.message = message
        self.status = status
        self.payload = payload or {}
        
    def to_json(self): 
        sucess = { 
            'message' : self.message, 
            'status' : self.status
        }
        if self.payload: 
            sucess['payload'] = dict(self.payload)
        return jsonify(sucess)
        