from flask import Blueprint, request
from app.services import FormSubmissionService

import uuid
bpForm = Blueprint( 
    "form",__name__
)

@bpForm.route('/create/vertification', methods=['POST'])
def create_form_ver(): 
    data = request.get_json()
    id = str(uuid.uuid4())
    data['id'] = id
    data['letter_status_id'] = 1
    response = FormSubmissionService.create_form_ver(data);
    return response

@bpForm.route('/create/leave', methods=['POST'])
def create_form_leave(): 
    data = request.get_json()
    id = str(uuid.uuid4())
    data['id'] = id
    data['letter_status_id'] = 1
    response = FormSubmissionService.create_form_leave(data);
    return response

@bpForm.route('/create/overtime', methods=['POST'])
def create_form_over(): 
    data = request.get_json()
    id = str(uuid.uuid4())
    data['id'] = id
    data['letter_status_id'] = 1
    response = FormSubmissionService.create_form_over(data);
    return response

@bpForm.route('/delete/<id>', methods=['DELETE'])
def delete_form(id): 
    response = FormSubmissionService.delete_form(id);
    return response

@bpForm.route('/update', methods=['PATCH'])
def update_form(): 
    data = request.get_json()
    response = FormSubmissionService.update_form(data);
    return response

@bpForm.route('/all', methods=['GET'])
def get_all_form(): 
    response = FormSubmissionService.get_all()
    return response

@bpForm.route('/all/<id>', methods=["GET"])
def get_all_by_id(id): 
    response = FormSubmissionService.get_all_by_id(id)
    return response